
class Level4 extends gameLevel {

    delta_time = 0;
    dist_vector = null;
    gravity_force = null;
    G = 0;
    already_in = false;

    planets = [];
    levelDuration = 10;


    
    

    initLevel(){
        this.time = 0;
        this.delta_time = 0.1;
        this.dist_vector = BABYLON.Vector3.Zero();
        this.gravity_force = BABYLON.Vector3.Zero();
        this.G = 0.00001;

        // Création du soleil
        this.initSun();  
        this.sun.setEnabled(false);
        this.planets.push(this.sun);

        // création de la planete 1
        var P1 = BABYLON.MeshBuilder.CreateSphere("P1", {diameter: 0.15, segments: 32}, theScene);
        P1.material = new BABYLON.StandardMaterial("earthMat", theScene);
        P1.material.diffuseTexture = new BABYLON.Texture("textures/earth2.jpg", theScene);
    
        
        P1.initialPosition = new BABYLON.Vector3(0,theHeight - 0.2,2); // à deux endroits
        P1.position = P1.initialPosition.clone();
        P1.initialMomentum = new BABYLON.Vector3(-0.1,-0.1,0.1);
        P1.momentum = P1.initialMomentum.clone();
        P1.masse = 1;

        P1.setEnabled(false);
        
        P1.arrow = this.drawPlanetMomentum(P1);
        P1.arrow.setEnabled(false);

        this.planets.push(P1);

        // création de la planete 2
        var P2 = BABYLON.MeshBuilder.CreateSphere("P2", {diameter: 0.1, segments: 32}, theScene);
        P2.material = new BABYLON.StandardMaterial("mercure", theScene);
        P2.material.diffuseTexture = new BABYLON.Texture("textures/neptune.jpg", theScene);
    
        P2.initialPosition = new BABYLON.Vector3(1,theHeight - 0.2,2.5);
        P2.position =  P2.initialPosition.clone();
        P2.initialMomentum = new BABYLON.Vector3(-0.01,0.01,-0.1);
        P2.momentum = P2.initialMomentum.clone();
        P2.masse = 1;

        P2.setEnabled(false);
        
        P2.arrow = this.drawPlanetMomentum(P2);
        P2.arrow.setEnabled(false);

        this.planets.push(P2);
    }

    initPlayground(){
        
        this.sun.setEnabled(true);
        this.sunlight.setEnabled(true);

        this.sunlight.position = this.sun.position;

        // i=0 -> sun   
        for(let i = 1; i < this.planets.length; i++) {
            this.planets[i].position = this.planets[i].initialPosition.clone();
            this.planets[i].momentum = this.planets[i].initialMomentum.clone();

            this.planets[i].setEnabled(true);
            this.planets[i].arrow.setEnabled(true);
        }
    }

    launchGame(){
        // i=0 -> sun
        for(let i = 1; i < this.planets.length; i++) {
            this.planets[ i ].arrow.setEnabled(false);
        }

        this.timer = Date.now();
        theTimerPlaneText.text = String((this.levelDuration).toLocaleString('en-GB',{ minimumFractionDigits: 1 }));
    }

    cleanLevel(){
        super.cleanLevel();

        var p;
        while(this.planets.length > 0){
            p = this.planets.pop();
            p.arrow.dispose();
            p.dispose();

        }
    }


    gameLoop(){
        /* ************************************************************* 
        Mise à jour de la position du soleil et des disques de proximité
        ************************************************************* */
        this.computeSunPosition();

        for(let i = 1; i < this.planets.length; i++) {
            this.manageDiscs(this.planets[i]);
        }

        /* ************************************************************* 
        Calcul spécifique du timer pour le gain de la partie
        ************************************************************* */
        // i=0 -> sun
        for(let i = 1; i < this.planets.length; i++) {
            let x = this.planets[i].position.x;
            let y = this.planets[i].position.y;
            let z = this.planets[i].position.z;

            if (!((x>xMin)&&(x<xMax)&&(z>zMin)&&(z<zMax)&&(y>yMin)&&(y<yMax))) {
                this.stateChange = true;
                this.nextState = LEVEL_STATE_FAIL; // fail
                console.log("Fail #1");
            }
        }

        let s = Math.ceil(10*this.levelDuration - (Date.now() - this.timer)/100)/10;
        theTimerPlaneText.text = String(s.toLocaleString('en-GB',{ minimumFractionDigits: 1 }));
        if(s <= 0){
            this.stateChange = true;
            this.nextState = LEVEL_STATE_SUCCESS; // success
            theTimerPlaneText.text = String((0).toLocaleString('en-GB',{ minimumFractionDigits: 1 }));
        }

        /* ************************************************************* 
        Calcul du déplacement de la planète
        ************************************************************* */
        
        let gravity_force = new Array(this.planets.length).fill(0).map(() => new Array(this.planets.length).fill(0));

        var dist_vector = new BABYLON.Vector3.Zero();
        var distance2 = 0;

        for(let i = 0; i < this.planets.length; i++) {
            for(let j = 0; j < i; j++) {
                dist_vector = this.planets[j].position.subtract(this.planets[i].position);
                distance2 = Math.pow(dist_vector.length(),2);
                gravity_force[i][j] = dist_vector.scale( this.G * this.planets[i].masse * this.planets[j].masse /  distance2);
                gravity_force[j][i] = gravity_force[i][j].scale( - 1);
                //console.log(gravity_force[i][j]);alert("*****")
            }

        }
        // console.table(gravity_force[0][1]);alert("ici");

        let sum_gravity_force_for_i = new BABYLON.Vector3.Zero();
        // i=0 -> sun
        for(let i = 1; i < this.planets.length; i++) {
            sum_gravity_force_for_i = BABYLON.Vector3.Zero();

            for(let j = 0; j < this.planets.length; j++) {

                if(i != j) {
                    sum_gravity_force_for_i.addInPlace( gravity_force[i][j]);
                }
            }
            if(sum_gravity_force_for_i.length() > 1) {
                sum_gravity_force_for_i.normalize().scaleInPlace(1);
                console.log('+');
            }
            if(sum_gravity_force_for_i.length() < 0.02) {
                sum_gravity_force_for_i.normalize().scaleInPlace(0.02);
                //console.log('-');
            }

            this.planets[i].momentum.addInPlace( sum_gravity_force_for_i.scale(this.delta_time) );
            this.planets[i].position.addInPlace( this.planets[i].momentum.scale(this.delta_time / this.planets[i].masse));

        }

        /* ************************************************************* 
        Detection des collisions
        ************************************************************* */
        for(let i = 0; i < this.planets.length; i++) {
            for(let j = 0; j < i; j++) {
                if((i != j)&&(this.planets[i].intersectsMesh(this.planets[j]))){
                    console.log(i+" "+j);
                    this.stateChange = true;
                    this.nextState = LEVEL_STATE_FAIL; // fail
                }
            }
        }
    }

    cleanLevel(){
        super.cleanLevel();

        planet.dispose();
        this.sun.dispose();
    }

} // end class Level2

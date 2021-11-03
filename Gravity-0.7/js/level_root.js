var SOLAR = SOLAR || {};

class gameLevel {

    /* décrit dans quelle partie du niveau on est : 
    0 : présentation
    1 : attente de démarrage
    2 : jeu, 
    3 : fin-gagné 
    4 : fin-perdu
    */
    state = SOLAR.LEVEL_STATE_UNDEFINED;

    dist_vector = [];
    gravity_force = [];
    planets = [];

    stateChange = true;
    nextState = SOLAR.LEVEL_STATE_INTRO;

    timer = 0;
    delta_time = 0.1;
    G = 0.00001;
    levelDuration = 10;

    // liste des disques qui signalent le rapprochement d'une paroi
    discs = [];

    // création des objets spécifiques au niveau
    // cube, panels et sun sont construit au niveau global
    initLevel(){

    }

    // setup et affichage des objets pendant le compte à rebours
    initPlayground(){
        
        this.sun.setEnabled(true);
        this.sunlight.setEnabled(true);

        this.sunlight.position = this.sun.position;
        this.sun.material = this.sun.initialMaterial;

        // i=0 -> sun   
        for(let i = 1; i < this.planets.length; i++) {
            this.planets[i].position = this.planets[i].initialPosition.clone();
            this.planets[i].momentum = this.planets[i].initialMomentum.clone();
            this.planets[i].material = this.planets[i].initialMaterial;

            this.planets[i].setEnabled(true);
            this.planets[i].arrow.setEnabled(true);
        }

        // il peut rester un ou plusieurs disque de sortie
        if(this.discs.length > 0)
            this.cleanDiscs();
    }

    launchGame(){
        // i=0 -> sun
        for(let i = 1; i < this.planets.length; i++) {
            this.planets[ i ].arrow.setEnabled(false);
        }

        this.timer = Date.now();
        SOLAR.theTimerPlaneText.text = String((this.levelDuration).toLocaleString('en-GB',{ minimumFractionDigits: 1 }));
    }

    // nettoyage des meshs spécifiques au niveau
    cleanLevel(){
        SOLAR.theFailPlane.setEnabled(false);
        SOLAR.theSuccessPlane.setEnabled(false);

        for(let i = 1; i < this.planets.length; i++) {
            this.planets[ i ].arrow.dispose();
        }

        var p;
        while(this.planets.length > 0){
            p = this.planets.pop();
            p.dispose();
        }

        if(this.discs.length > 0)
            this.cleanDiscs();
    }

    // configuration du level en fonction de son état (suite à un stateChange)
    initState(state){
        switch(state)
        {
            case SOLAR.LEVEL_STATE_INTRO : 
                console.log("LEVEL_STATE_INTRO");
                SOLAR.theExplanationPlane.setEnabled(true);
                break;
            case SOLAR.LEVEL_STATE_WAIT :
                console.log("LEVEL_STATE_WAIT");
                SOLAR.theFailPlane.setEnabled(false);
                SOLAR.theSuccessPlane.setEnabled(false);
                SOLAR.theExplanationPlane.setEnabled(false);
                SOLAR.hideControllers();
                SOLAR.theTimerPlane.setEnabled(true);
                SOLAR.theCubePlayground.setEnabled(true);
                this.initPlayground();
                this.timer = Date.now();
                break;
            case SOLAR.LEVEL_STATE_GAME :
                console.log("LEVEL_STATE_GAME");
                SOLAR.theExplanationPlane.setEnabled(false);
                SOLAR.theTimerPlane.setEnabled(true);
                this.launchGame();
                this.timer = Date.now();
                break;
            case SOLAR.LEVEL_STATE_SUCCESS : 
                console.log("LEVEL_STATE_SUCCESS");
                SOLAR.theTimerPlane.setEnabled(false);
                SOLAR.showControllers();
                SOLAR.theSuccessPlane.setEnabled(true);
                break;
            case SOLAR.LEVEL_STATE_FAIL : 
                console.log("LEVEL_STATE_FAIL");

                SOLAR.theTimerPlane.setEnabled(false);
                SOLAR.showControllers();
                SOLAR.theFailPlaneText = "You failed !";
                SOLAR.theFailPlane.setEnabled(true);
                break;
        }
    }


    levelRenderLoop() {
        if(this.stateChange)
        {
            //console.log(this.nextState);
            this.initState(this.nextState);
            this.state = this.nextState;
            this.nextState = SOLAR.LEVEL_STATE_UNDEFINED;
            this.stateChange = false;
        }

        switch(this.state)
        {
            case SOLAR.LEVEL_STATE_WAIT : 
                this.timerLoop();
                break;
            case SOLAR.LEVEL_STATE_GAME :
                this.gameLoop();
                break;
        }

    }

    initSun(){
        this.sun = BABYLON.MeshBuilder.CreateSphere("sun", {diameter: 0.2}, theScene);
        this.sun.masse = 1000;
        this.sun.radius = 0.1; // necessaire pour la collision parfaite
        
        var sunMaterial = new BABYLON.StandardMaterial('sunMaterial', theScene);


        this.sunlight = new BABYLON.PointLight('sunLight', new BABYLON.Vector3.Zero(), theScene);
        sunMaterial.emissiveTexture = new BABYLON.Texture('textures/sun.jpg', theScene);
        sunMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sunMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.sun.material = sunMaterial;
        this.sun.initialMaterial = sunMaterial;
        this.sunlight.intensity = 15;
        
    }

    sunAngle = 0;
    computeSunPosition(){
        //this.sun.position = (theRightMotionController.rootMesh.getAbsolutePosition() - this.centralPoint)*2 +  this.centralPoint;
        /*
        var delta = this.centralPoint.clone();
        delta.scaleInPlace(-1);
        delta.addInPlace(theRightMotionController.rootMesh.getAbsolutePosition());
        delta.scaleInPlace(2);
        delta.addInPlace(this.centralPoint);
        this.sun.position = delta;
        */
        var x0 = 0.1 ,
            y0 = SOLAR.theHeight - 0.3,
            z0 = 0;
       
        var xc = SOLAR.theRightMotionController.rootMesh.getAbsolutePosition().x; // c pour controller
        var yc = SOLAR.theRightMotionController.rootMesh.getAbsolutePosition().y;
        var zc = SOLAR.theRightMotionController.rootMesh.getAbsolutePosition().z;

        var xs, ys, zs; // S pour sun
        /*
        xs = (xc - x0)*(3 + 3*Math.abs(xc - x0)) + x0;
        ys = (yc - y0)*(3 + 3*Math.abs(yc - y0)) + y0;
        zs = (zc - z0)*(10 + 5*Math.abs(zc - z0)) + z0;
        */
       /*
        xs = (xc - x0)*(1+ 10*Math.abs(Math.pow(2*(xc - x0),4))) + x0;
        ys = (yc - y0)*(1+ 10*Math.abs(Math.pow(2*(yc - y0),4))) + y0;
        zs = (zc - z0)*(1+ 10*Math.abs(Math.pow(2*(zc - z0),4))) + z0;
        */

        var x,y,z;
        x = (xc - x0);
        y = (yc - y0);
        z = (zc - z0);

        var ro, theta, alpha;
        ro = Math.sqrt(x*x + y*y + z*z);
        theta = Math.acos(z/ro);
        alpha = Math.atan2(y,x);

        //x*(1+abs((3*x)^4))
        ro = ro * (1 + Math.pow(3*ro,4));

        xs = ro * Math.sin(theta) * Math.cos(alpha) + x0;
        ys = ro * Math.sin(theta) * Math.sin(alpha) + y0;
        zs = ro * Math.cos(theta) + z0;

        xs = (xs > SOLAR.xMax) ? SOLAR.xMax : xs;
        xs = (xs < SOLAR.xMin) ? SOLAR.xMin : xs;
        ys = (ys > SOLAR.yMax) ? SOLAR.yMax : ys;
        ys = (ys < SOLAR.yMin) ? SOLAR.yMin : ys;
        zs = (zs > SOLAR.zMax) ? SOLAR.zMax : zs;
        zs = (zs < SOLAR.zMin) ? SOLAR.zMin : zs;

        this.sun.position.x = xs;
        this.sun.position.y = ys;
        this.sun.position.z = zs;
        this.sunAngle += 0.02;
        this.sun.rotation = new BABYLON.Vector3(0,this.sunAngle,0);
    }

    

    drawFrontCircle(planet) {
        var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.position.z - SOLAR.zMax)/2});
        /*
        d.material = new BABYLON.StandardMaterial("MoonMaterial", theScene);
        d.material.ambiantColor = new BABYLON.Color3(1,0,0);
        d.material.diffuseColor = new BABYLON.Color3(1,0,0);
        d.material.specularColor = new BABYLON.Color3(1,0,0);
        */

        d.position.x = planet.position.x;
        d.position.y = planet.position.y;
        d.position.z = SOLAR.zMax;
        d.visibility = Math.pow((SOLAR.DISC_DIST - Math.abs(planet.position.z - SOLAR.zMax))/SOLAR.DISC_DIST,2) ;
        this.discs.push(d);
    }

    drawTopCircle(planet) {
        var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.position.y - SOLAR.yMax)/2});
        
        d.rotation = new BABYLON.Vector3(-Math.PI / 2,0,0);
        d.position.x = planet.position.x;
        d.position.y = SOLAR.yMax;
        d.position.z = planet.position.z;
        d.visibility = Math.pow((SOLAR.DISC_DIST - Math.abs(planet.position.y - SOLAR.yMax))/SOLAR.DISC_DIST,2) ;
        this.discs.push(d);
    }

    drawBottomCircle(planet) {
        var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.position.y - SOLAR.yMin)/2});
        
        d.rotation = new BABYLON.Vector3(Math.PI / 2,0,0);
        d.position.x = planet.position.x;
        d.position.y = SOLAR.yMin;
        d.position.z = planet.position.z;
        d.visibility = Math.pow((SOLAR.DISC_DIST - Math.abs(planet.position.y - SOLAR.yMin))/SOLAR.DISC_DIST,2) ;
        this.discs.push(d);
    }

    drawLeftCircle(planet) {
        var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.position.x - SOLAR.xMin)/2});
        
        d.rotation = new BABYLON.Vector3(0,-Math.PI / 2,0);
        d.position.x = SOLAR.xMin;
        d.position.y = planet.position.y;
        d.position.z = planet.position.z;
        d.visibility = Math.pow((SOLAR.DISC_DIST - Math.abs(planet.position.x - SOLAR.xMin))/SOLAR.DISC_DIST,2) ;
        this.discs.push(d);
    }

    drawRightCircle(planet) {
        var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.position.x - SOLAR.xMax)/2});
        
        d.rotation = new BABYLON.Vector3(0,Math.PI / 2,0);
        d.position.x = SOLAR.xMax;
        d.position.y = planet.position.y;
        d.position.z = planet.position.z;
        d.visibility = Math.pow((SOLAR.DISC_DIST - Math.abs(planet.position.x - SOLAR.xMax))/SOLAR.DISC_DIST,2) ;
        this.discs.push(d);
    }

    cleanDiscs(){
        var d;
        while(this.discs.length > 0){
            d = this.discs.pop();
            d.dispose();
        }
    }

    

    manageDiscs(planet)
    {
        var x = planet.position.x;
        var y = planet.position.y;
        var z = planet.position.z;

        if(((x-SOLAR.xMin)<SOLAR.DISC_DIST)&&((x-SOLAR.xMin)>0)&&(z>SOLAR.zMin)&&(z<SOLAR.zMax)&&(y>SOLAR.yMin)&&(y<SOLAR.yMax)) {
            this.drawLeftCircle(planet);
        }
        if(((SOLAR.xMax-x)<SOLAR.DISC_DIST)&&((SOLAR.xMax-x)>0)&&(z>SOLAR.zMin)&&(z<SOLAR.zMax)&&(y>SOLAR.yMin)&&(y<SOLAR.yMax)) {
            this.drawRightCircle(planet);
        }
        if(((SOLAR.yMax-y)<SOLAR.DISC_DIST)&&((SOLAR.yMax-y)>0)&&(z>SOLAR.zMin)&&(z<SOLAR.zMax)&&(x>SOLAR.xMin)&&(x<SOLAR.xMax)) {
            this.drawTopCircle(planet);
        }
        if(((y-SOLAR.yMin)<SOLAR.DISC_DIST)&&((y-SOLAR.yMin)>0)&&(z>SOLAR.zMin)&&(z<SOLAR.zMax)&&(x>SOLAR.xMin)&&(x<SOLAR.xMax)) {
            this.drawBottomCircle(planet);
        }
        if(((SOLAR.zMax-z)<SOLAR.DISC_DIST)&&((SOLAR.zMax-z)>0)&&(x>SOLAR.xMin)&&(x<SOLAR.xMax)&&(y>SOLAR.yMin)&&(y<SOLAR.yMax)) {
            this.drawFrontCircle(planet);
        }
        
    }

    drawPlanetMomentum(planet){
        
        var arrowEndPoint = planet.position.clone().addInPlace(planet.momentum);
        var lg = planet.momentum.length();
        
        var arrowPoint1 = SOLAR.arrowTransform(planet.momentum, planet.position, new BABYLON.Vector3(lg-0.03,0.01,0));
        var arrowPoint2 = SOLAR.arrowTransform(planet.momentum, planet.position, new BABYLON.Vector3(lg-0.03,-0.01,0));
        var arrowPoint3 = SOLAR.arrowTransform(planet.momentum, planet.position, new BABYLON.Vector3(lg-0.03,0,0.01));
        var arrowPoint4 = SOLAR.arrowTransform(planet.momentum, planet.position, new BABYLON.Vector3(lg-0.03,0,-0.01));
        
        var returnedArrow = BABYLON.Mesh.CreateLines("planet_arrow", [ 
            planet.position, 
            arrowEndPoint 
            , arrowPoint1,
            arrowEndPoint, arrowPoint2,
            arrowEndPoint, arrowPoint3,
            arrowEndPoint, arrowPoint4 
            ], this.scene);
        returnedArrow.color = new BABYLON.Color3(0, 1, 0);

        return returnedArrow;
    }

    // loop utilisée uniquement lors du compte à rebours
    timerLoop(){
        var s = Math.ceil(5 - (Date.now() - this.timer)/1000);
        if(s == 0){
            this.stateChange = true;
            this.nextState = SOLAR.LEVEL_STATE_GAME;
        }
        else {
            SOLAR.theTimerPlaneText.text = String(s);
            this.timer += 1;
        }
        this.computeSunPosition();

        for(let i = 1; i < this.planets.length; i++) {
            this.planets[i].rotate(BABYLON.Axis.Y,this.planets[i].angleSpeed);
            //this.planets[i].rotate(this.planets[i].axis,this.planets[i].angleSpeed, BABYLON.Space.WORLD);
        }
    }

    // loop utilisée pour la phase de jeu
    gameLoop(){
        /* ************************************************************* 
        Mise à jour de la position du soleil et des disques de proximité
        ************************************************************* */
        this.computeSunPosition();

        if(this.discs.length > 0)
            this.cleanDiscs();

        for(let i = 1; i < this.planets.length; i++) {
            this.manageDiscs(this.planets[i]);
        }

        /* ************************************************************* 
        Calcul de la sortie d'une planete
        ************************************************************* */

        // i=0 -> sun
        for(let i = 1; i < this.planets.length; i++) {
            let x = this.planets[i].position.x;
            let y = this.planets[i].position.y;
            let z = this.planets[i].position.z;

            if (!((x>SOLAR.xMin)&&(x<SOLAR.xMax)&&(z>SOLAR.zMin)&&(z<SOLAR.zMax)&&(y>SOLAR.yMin)&&(y<SOLAR.yMax))) {
                this.stateChange = true;
                this.nextState = SOLAR.LEVEL_STATE_FAIL; // fail
                console.log("Fail #1");
                this.showExitPoint(this.planets[i]);
            }
        }

        /* ************************************************************* 
        Calcul spécifique du timer pour le gain de la partie
        ************************************************************* */

        let s = Math.ceil(10*this.levelDuration - (Date.now() - this.timer)/100)/10;
        SOLAR.theTimerPlaneText.text = String(s.toLocaleString('en-GB',{ minimumFractionDigits: 1 }));
        if(s <= 0){
            this.stateChange = true;
            this.nextState = SOLAR.LEVEL_STATE_SUCCESS; // success
            SOLAR.theTimerPlaneText.text = String((0).toLocaleString('en-GB',{ minimumFractionDigits: 1 }));
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
                //console.log('+');
            }
            if(sum_gravity_force_for_i.length() < 0.02) {
                sum_gravity_force_for_i.normalize().scaleInPlace(0.02);
                //console.log('-');
            }

            this.planets[i].momentum.addInPlace( sum_gravity_force_for_i.scale(this.delta_time) );
            this.planets[i].position.addInPlace( this.planets[i].momentum.scale(this.delta_time / this.planets[i].masse));

            //this.planets[i].rotate(this.planets[i].axis,this.planets[i].angleSpeed, BABYLON.Space.WORLD);
            this.planets[i].rotate(BABYLON.Axis.Y,this.planets[i].angleSpeed);
        }

        /* ************************************************************* 
        Detection des collisions
        ************************************************************* */
        for(let i = 0; i < this.planets.length; i++) {
            for(let j = 0; j < i; j++) {
                //if((i != j)&&(this.planets[i].intersectsMesh(this.planets[j]))){
                if((i != j) && this.collide(this.planets[i],this.planets[j])) {
                    console.log(i+" "+j);
                    this.showCollision(this.planets[i],this.planets[j]);
                    this.stateChange = true;
                    this.nextState = LEVEL_STATE_FAIL; // fail
                }
            }
        }
    }

    showCollision(planet1,planet2){
        let material = new BABYLON.StandardMaterial("mat", theScene);

        material.ambiantColor = new BABYLON.Color3(1,0,0);
        material.diffuseColor = new BABYLON.Color3(1,0,0);
        material.specularColor = new BABYLON.Color3(1,0,0);
        planet1.material = material;
        planet2.material = material;
    }

    collide(planet1,planet2){
        var dist = Math.sqrt(
            Math.pow(planet1.position.x - planet2.position.x,2) +
            Math.pow(planet1.position.y - planet2.position.y,2) +
            Math.pow(planet1.position.z - planet2.position.z,2)
        );
        return ( dist < (planet1.radius + planet2.radius));
    }

    showExitPoint(planet)
    {
        var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : 0.25});
        d.material = new BABYLON.StandardMaterial("mat", theScene);
        d.material.ambiantColor = new BABYLON.Color3(1,0,0);
        d.material.diffuseColor = new BABYLON.Color3(1,0,0);
        d.material.specularColor = new BABYLON.Color3(1,0,0);
        
        d.position.x = planet.position.x;
        d.position.y = planet.position.y;
        d.position.z = planet.position.z;

        if(planet.position.x < SOLAR.xMin) {
            d.rotation = new BABYLON.Vector3(0,-Math.PI / 2,0);
            d.position.x = SOLAR.xMin;
        } else if(planet.position.x > SOLAR.xMax) {
            d.rotation = new BABYLON.Vector3(0,Math.PI / 2,0);
            d.position.x = SOLAR.xMax;
        } else if(planet.position.y < SOLAR.yMin) {
            d.rotation = new BABYLON.Vector3(-Math.PI / 2,0,0);
            d.position.y = SOLAR.yMin;
        } else if(planet.position.y > SOLAR.yMax) {
            d.rotation = new BABYLON.Vector3(Math.PI / 2,0,0);
            d.position.y = SOLAR.yMax;
        } else if(planet.position.z > SOLAR.zMax) {
            d.position.z = SOLAR.zMax;
        }  else if(planet.position.z < SOLAR.zMin) {
            d.position.z = SOLAR.zMin;
        } 

        this.discs.push(d);
           
    }

} // end class gameLevel


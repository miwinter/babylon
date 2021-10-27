
class Level4 extends gameLevel {

    delta_time = 0;
    dist_vector = null;
    gravity_force = null;
    G = 0;
    already_in = false;

    drawPlanetMomentum(planet){
        
        var arrowEndPoint = this.P1.position.clone().addInPlace(this.P1.momentum);
        var lg = this.P1.momentum.length();
        
        var arrowPoint1 = arrowTransform(this.P1.momentum, this.P1.position, new BABYLON.Vector3(lg-0.03,0.01,0));
        var arrowPoint2 = arrowTransform(this.P1.momentum, this.P1.position, new BABYLON.Vector3(lg-0.03,-0.01,0));
        var arrowPoint3 = arrowTransform(this.P1.momentum, this.P1.position, new BABYLON.Vector3(lg-0.03,0,0.01));
        var arrowPoint4 = arrowTransform(this.P1.momentum, this.P1.position, new BABYLON.Vector3(lg-0.03,0,-0.01));
        
        var returnedArrow = BABYLON.Mesh.CreateLines("P1_arrow", [ 
            this.P1.position, 
            arrowEndPoint 
            , arrowPoint1,
            arrowEndPoint, arrowPoint2,
            arrowEndPoint, arrowPoint3,
            arrowEndPoint, arrowPoint4 
            ], this.scene);
        returnedArrow.color = new BABYLON.Color3(0, 1, 0);

        return returnedArrow;
    }
    

    initLevel(){
        this.time = 0;
        this.delta_time = 0.1;
        this.dist_vector = BABYLON.Vector3.Zero();
        this.gravity_force = BABYLON.Vector3.Zero();
        this.G = 0.00001;

        // Création du soleil
        this.initSun();  
        this.sun.setEnabled(false);

        // création de la planete 1
        this.P1 = BABYLON.MeshBuilder.CreateSphere("P1", {diameter: 0.1, segments: 32}, theScene);
        this.P1.material = new BABYLON.StandardMaterial("earthMat", theScene);
        this.P1.material.diffuseTexture = new BABYLON.Texture("textures/earth2.jpg", theScene);
    
        this.P1.position = new BABYLON.Vector3(0,theHeight - 0.2,2); // à deux endroits
        this.P1.momentum = new BABYLON.Vector3(-0.1,-0.1,0.1);
        this.P1.masse = 1;

        this.P1.setEnabled(false);
        
        this.P1.arrow = this.drawPlanetMomentum(this.P1);
        this.P1.arrow.setEnabled(false);
    }

    initPlayground(){
        
        this.sun.setEnabled(true);
        this.sunlight.setEnabled(true);
        //this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition();
        this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition().clone();
        this.centralPoint = this.sun.position.clone();

        this.sunlight.position = this.sun.position;
        this.P1.position = new BABYLON.Vector3(0,theHeight - 0.2,2);  // à deux endroits
        this.P1.momentum = new BABYLON.Vector3(-0.1,-0.1,0.1);
        this.P1.setEnabled(true);

        this.P1.arrow.setEnabled(true);
    }

    launchGame(){
        this.P1.arrow.dispose();
    }


    gameLoop(){
        /* ************************************************************* 
        Mise à jour de la position du soleil et de LA planet
        ************************************************************* */
        this.computeSunPosition();
        this.manageDiscs(this.P1);

        /* ************************************************************* 
        Calcul spécifique du timer pour le gain de la partie
        ************************************************************* */

        var x = this.P1.position.x;
        var y = this.P1.position.y;
        var z = this.P1.position.z;
        var s = 0;

        if((x>xMin)&&(x<xMax)&&(z>zMin)&&(z<zMax)&&(y>yMin)&&(y<yMax)) {
            if(this.already_in){
                s = Math.ceil(100 - (Date.now() - this.timer)/100)/10;
                theTimerPlaneText.text = String(s.toLocaleString('en-GB',{ minimumFractionDigits: 1 }));
                if(s <= 0){
                    this.stateChange = true;
                    this.nextState = LEVEL_STATE_SUCCESS; // success
                }
            }
            else {
                this.timer = Date.now();
                this.already_in = true;
            }
        }
        else{
            if(this.already_in){
                this.already_in = false;
                theTimerPlaneText.text = String((10).toLocaleString('en-GB',{ minimumFractionDigits: 1 }));
            }
        }

        /* ************************************************************* 
        Calcul du déplacement de la planète
        ************************************************************* */
        
        this.dist_vector = this.P1.position.subtract(this.sun.position);

        var distance2 = Math.pow(this.dist_vector.length(),2);

        this.dist_vector.normalize();

        this.gravity_force = this.dist_vector.scale(- this.G * this.sun.masse * this.P1.masse /  distance2);
        //this.gravity_force = this.dist_vector.scale(- this.G * this.sun.masse * this.P1.masse /  this.dist_vector.length());
        
        //this.gravity_force.normalize().scaleInPlace(0.05);

        /*
        if(this.gravity_force.length() > 1) {
            this.gravity_force.normalize().scaleInPlace(1);
            // console.log('+');
        }
        */
        
        if(this.gravity_force.length() < 0.02) {
            this.gravity_force.normalize().scaleInPlace(0.02);
            // console.log('-');
        }

        this.P1.momentum.addInPlace(  this.gravity_force.scale(this.delta_time));
        this.P1.position.addInPlace(  this.P1.momentum.scale(this.delta_time / this.P1.masse));
        
        /* ************************************************************* 
        Detection des collisions
        ************************************************************* */

        if(this.sun.intersectsMesh(this.P1)){
            this.stateChange = true;
            this.nextState = LEVEL_STATE_FAIL; // fail
        }
    }

    cleanLevel(){
        super.cleanLevel();

        this.P1.dispose();
        this.sun.dispose();
    }

} // end class Level2

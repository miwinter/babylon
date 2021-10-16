
class Level3 extends gameLevel {

    delta_time = 0;
    dist_vector = null;
    gravity_force = null;
    G = 0;
    already_in = false;

    initLevel(){
        this.time = 0;
        this.delta_time = 0.1;
        this.dist_vector = BABYLON.Vector3.Zero();
        this.gravity_force = BABYLON.Vector3.Zero();
        this.G = 0.00001;// précédente : 0.000002

        // Création du soleil
        this.sun = BABYLON.MeshBuilder.CreateSphere("sun", {diameter: 0.1}, theScene);
        
        this.gl = new BABYLON.GlowLayer("glow", theScene);
        this.gl.intensity = 10;
        this.gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
            if (mesh.name === "sun") {
                result.set(0.6259, 0.3056, 0.0619, 0.5);
            } else {
                result.set(0, 0, 0, 0);
            }
        }
    
        // pour tester les éclairages
        //var test = BABYLON.MeshBuilder.CreateSphere("toto", {diameter: 0.2}, theScene);
        //test.position = new BABYLON.Vector3(0,1,1);

        this.sun.masse = 1000;
        this.sunlight = new BABYLON.PointLight("pointLight", this.sun.position, theScene);
        this.sunlight.intensity = 20;
        this.sunlight.setEnabled(false);
        this.sun.setEnabled(false);

        // création de la planete 1
        this.P1 = BABYLON.MeshBuilder.CreateSphere("P1", {diameter: 0.05, segments: 32}, theScene);
        this.P1.material = new BABYLON.StandardMaterial("earthMat", theScene);
        this.P1.material.diffuseTexture = new BABYLON.Texture("textures/earth.jpg", theScene);
        this.P1.material.specularColor = new BABYLON.Color3(0, 0, 0);
    
        this.P1.position = new BABYLON.Vector3(0,theHeight - 0.2,0.8);
        this.P1.momentum = new BABYLON.Vector3(0.1,-0.1,-0.1);
        this.P1.masse = 1;

        this.P1.setEnabled(false);

        var arrowEndPoint = this.P1.position.clone().addInPlace(this.P1.momentum);
        var lg = this.P1.momentum.length();
        
        var arrowPoint1 = arrowTransform(this.P1.momentum, this.P1.position, new BABYLON.Vector3(lg-0.03,0.01,0));
        var arrowPoint2 = arrowTransform(this.P1.momentum, this.P1.position, new BABYLON.Vector3(lg-0.03,-0.01,0));
        var arrowPoint3 = arrowTransform(this.P1.momentum, this.P1.position, new BABYLON.Vector3(lg-0.03,0,0.01));
        var arrowPoint4 = arrowTransform(this.P1.momentum, this.P1.position, new BABYLON.Vector3(lg-0.03,0,-0.01));
        
        this.P1.arrow = BABYLON.Mesh.CreateLines("P1_arrow", [ 
            this.P1.position, 
            arrowEndPoint 
            , arrowPoint1,
            arrowEndPoint, arrowPoint2,
            arrowEndPoint, arrowPoint3,
            arrowEndPoint, arrowPoint4 
            ], this.scene);
        this.P1.arrow.color = new BABYLON.Color3(0, 1, 0);

        this.P1.arrow.setEnabled(false);
    }

    initPlayground(){
        
        this.sun.setEnabled(true);
        this.sunlight.setEnabled(true);
        //this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition();
        this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition().clone();
        this.centralPoint = this.sun.position.clone();

        this.sunlight.position = this.sun.position;
        this.P1.position = new BABYLON.Vector3(0,theHeight - 0.2,0.8);
        this.P1.momentum = new BABYLON.Vector3(0.1,-0.1,-0.1);
        this.P1.setEnabled(true);

        this.P1.arrow.setEnabled(true);
    }

    launchGame(){
        this.P1.arrow.dispose();
    }

    gameLoop(){
        var x = this.P1.position.x;
        var y = this.P1.position.y;
        var z = this.P1.position.z;
        var s = 0;

        
        //this.sun.position = (theRightMotionController.rootMesh.getAbsolutePosition() - this.centralPoint)*2 +  this.centralPoint;
        var delta = this.centralPoint.clone();
        delta.scaleInPlace(-1);
        delta.addInPlace(theRightMotionController.rootMesh.getAbsolutePosition());
        delta.scaleInPlace(2);
        delta.addInPlace(this.centralPoint);
        this.sun.position = delta;

        if((x>-0.5)&&(x<0.5)&&(z>0)&&(z<1)&&(y>theHeight-1)&&(y<theHeight)) {
            if(this.already_in){
                s = Math.ceil(50 - (Date.now() - this.timer)/100)/10;
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
                theTimerPlaneText.text = String((5).toLocaleString('en-GB',{ minimumFractionDigits: 1 }));
            }
        }
        
        this.dist_vector = this.P1.position.subtract(this.sun.position);

        var distance2 = Math.pow(this.dist_vector.length(),2);

        this.dist_vector.normalize();

        this.gravity_force = this.dist_vector.scale(- this.G * this.sun.masse * this.P1.masse /  distance2);
        //this.gravity_force = this.dist_vector.scale(- this.G * this.sun.masse * this.P1.masse /  this.dist_vector.length());
        
        //this.gravity_force.normalize().scaleInPlace(0.05);

        /*
        if(this.gravity_force.length() > 0.07) {
            this.gravity_force.normalize().scaleInPlace(0.07)
        }
        */
        if(this.gravity_force.length() < 0.01) {
            this.gravity_force.normalize().scaleInPlace(0.01)
        }

        if(this.sun.intersectsMesh(this.P1)){
            this.stateChange = true;
            this.nextState = LEVEL_STATE_FAIL; // fail
        }
        else{
            this.P1.momentum.addInPlace(  this.gravity_force.scale(this.delta_time));
            this.P1.position.addInPlace(  this.P1.momentum.scale(this.delta_time / this.P1.masse));
        }
       
    }

    cleanLevel(){
        super.cleanLevel();

        this.P1.dispose();
        this.sun.dispose();
    }

} // end class Level2

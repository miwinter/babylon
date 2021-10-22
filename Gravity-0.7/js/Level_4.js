
class Level4 extends gameLevel {

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
        this.sun = BABYLON.MeshBuilder.CreateSphere("sun", {diameter: 0.2}, theScene);
        /*
        var material = new BABYLON.StandardMaterial(theScene);
        material.alpha = 1;
        material.diffuseColor = new BABYLON.Color3(1, 1, 0);
        this.sun.material = material;
        */
        /*
        this.gl = new BABYLON.GlowLayer("glow", theScene);
        this.gl.intensity = 10;
        this.gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
            if (mesh.name === "sun") {
                result.set(0.6259, 0.3056, 0.0619, 0.5);
            } else if (mesh.name === "P1") {
                result.set(0.1, 0.1, 0.2, 0.5);
            } else {
                result.set(0, 0, 0, 0);
            }
        }
        */
    
        // pour tester les éclairages
        //var test = BABYLON.MeshBuilder.CreateSphere("toto", {diameter: 0.2}, theScene);
        //test.position = new BABYLON.Vector3(0,1,1);

        this.sun.masse = 1000;
        /*
        this.sunlight = new BABYLON.PointLight("pointLight", this.sun.position, theScene);
        this.sunlight.diffuse = new BABYLON.Color3(1, 1, 0);
        this.sunlight.specular = new BABYLON.Color3(0.5, 0.5, 0);
        this.sunlight.groundColor = new BABYLON.Color3(1, 1,0);
        this.sunlight.intensity = 20;
        this.sunlight.setEnabled(false);
        */

        var sunMaterial = new BABYLON.StandardMaterial('sunMaterial', theScene);

        this.sunlight = new BABYLON.PointLight('sunLight', new BABYLON.Vector3.Zero(), theScene);
        sunMaterial.emissiveTexture = new BABYLON.Texture('textures/sun.jpg', theScene);
        sunMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sunMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.sun.material = sunMaterial;
        this.sunlight.intensity = 15;
        
        this.sun.setEnabled(false);

        // création de la planete 1
        this.P1 = BABYLON.MeshBuilder.CreateSphere("P1", {diameter: 0.1, segments: 32}, theScene);
        this.P1.material = new BABYLON.StandardMaterial("earthMat", theScene);
        this.P1.material.diffuseTexture = new BABYLON.Texture("textures/earth2.jpg", theScene);
        //this.P1.material.specularColor = new BABYLON.Color3(0, 0, 0);
        //this.P1.material.emissiveColor = new BABYLON.Color3.Blue;
    
        this.P1.position = new BABYLON.Vector3(0,theHeight - 0.2,2); // à deux endroits
        this.P1.momentum = new BABYLON.Vector3(-0.1,-0.1,0.1);
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
        this.P1.position = new BABYLON.Vector3(0,theHeight - 0.2,2);  // à deux endroits
        this.P1.momentum = new BABYLON.Vector3(-0.1,-0.1,0.1);
        this.P1.setEnabled(true);

        this.P1.arrow.setEnabled(true);
    }

    launchGame(){
        this.P1.arrow.dispose();
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
            y0 = theHeight - 0.3,
            z0 = 0;
       
        var xc = theRightMotionController.rootMesh.getAbsolutePosition().x; // c pour controller
        var yc = theRightMotionController.rootMesh.getAbsolutePosition().y;
        var zc = theRightMotionController.rootMesh.getAbsolutePosition().z;

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

        xs = (xs > xMax) ? xMax : xs;
        xs = (xs < xMin) ? xMin : xs;
        ys = (ys > yMax) ? yMax : ys;
        ys = (ys < yMin) ? yMin : ys;
        zs = (zs > zMax) ? zMax : zs;
        zs = (zs < zMin) ? zMin : zs;

        this.sun.position.x = xs;
        this.sun.position.y = ys;
        this.sun.position.z = zs;
        this.sunAngle += 0.01;
        this.sun.rotation = new BABYLON.Vector3(0,this.sunAngle,0);

    }

    d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : 0});
    drawLeftCircle() {
        this.d.dispose();
        this.d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(this.P1.position.x - xMin)/2});
        this.d.material = new BABYLON.StandardMaterial("MoonMaterial", theScene);
        this.d.material.ambiantColor = new BABYLON.Color3(1,0,0);
        this.d.material.diffuseColor = new BABYLON.Color3(1,0,0);
        this.d.material.specularColor = new BABYLON.Color3(1,0,0);
        //this.sun.material = sunMaterial;
        this.d.rotation = new BABYLON.Vector3(0,-Math.PI / 2,0);
        this.d.position.x = xMin;
        this.d.position.y = this.P1.position.y;
        this.d.position.z = this.P1.position.z;
        this.d.visibility = Math.max(0, (0.5 - Math.abs(this.P1.position.x - xMin))) ;
    }

    gameLoop(){
        var x = this.P1.position.x;
        var y = this.P1.position.y;
        var z = this.P1.position.z;
        var s = 0;

        this.computeSunPosition();

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

        if(((x-xMin)<0.5)&&((x-xMin)>0)&&(z>zMin)&&(z<zMax)&&(y>yMin)&&(y<yMax)) {
            this.drawLeftCircle();
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
        if(this.gravity_force.length() < 0.02) {
            this.gravity_force.normalize().scaleInPlace(0.02)
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

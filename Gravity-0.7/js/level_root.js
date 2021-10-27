
class gameLevel {

    /* décrit dans quelle partie du niveau on est : 
    0 : présentation
    1 : attente de démarrage
    2 : jeu, 
    3 : fin-gagné 
    4 : fin-perdu
    */
    state = LEVEL_STATE_UNDEFINED;

    stateChange = true;
    nextState = LEVEL_STATE_INTRO;

    timer = 0;

    // liste des disques qui signalent le rapprochement d'une paroi
    discs = [];

    // création des objets spécifiques au niveau
    // cube, panels et sun sont construit au niveau global
    initLevel(){

    }

    // setup et affichage des objets pendant le compte à rebours
    initPlayground(){}

    // effacement des fleches au démarrage de la phase de jeu
    launchGame(){}

    // nettoyage des meshs spécifiques au niveau
    cleanLevel(){
        theFailPlane.setEnabled(false);
        theSuccessPlane.setEnabled(false);
    }

    // configuration du level en fonction de son état (suite à un stateChange)
    initState(state){
        switch(state)
        {
            case LEVEL_STATE_INTRO : 
                console.log("LEVEL_STATE_INTRO");
                theExplanationPlaneText.text = "Let's go !";
                theExplanationPlaneButton.text = "Start";
                theExplanationPlaneTarget = LEVEL_STATE_WAIT;
                theExplanationPlane.setEnabled(true);
                break;
            case LEVEL_STATE_WAIT :
                console.log("LEVEL_STATE_WAIT");
                theHLight.intensity = 1;
                theFailPlane.setEnabled(false);
                theSuccessPlane.setEnabled(false);
                theExplanationPlane.setEnabled(false);
                hideControllers();
                theTimerPlane.setEnabled(true);
                theCubePlayground.setEnabled(true);
                this.initPlayground();
                this.timer = Date.now();
                break;
            case LEVEL_STATE_GAME :
                console.log("LEVEL_STATE_GAME");
                theExplanationPlaneTarget = LEVEL_STATE_WAIT;
                theExplanationPlane.setEnabled(false);
                theTimerPlane.setEnabled(true);
                this.launchGame();
                this.timer = Date.now();
                break;
            case LEVEL_STATE_SUCCESS : 
                console.log("LEVEL_STATE_SUCCESS");
                theHLight.intensity = 1;
                theTimerPlane.setEnabled(false);
                showControllers();
                //this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition().clone();
                //theHLight.position = this.sun.position;
                theSuccessPlane.setEnabled(true);
                break;
            case LEVEL_STATE_FAIL : 
                console.log("LEVEL_STATE_FAIL");
                theHLight.intensity = 1;
                theTimerPlane.setEnabled(false);
                //this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition().clone();
                //theHLight.position = this.sun.position;
                showControllers();
                theFailPlaneText = "You failed !";
                theFailPlane.setEnabled(true);
                break;
        }
    }


    levelRenderLoop() {
        if(this.stateChange)
        {
            //console.log(this.nextState);
            this.initState(this.nextState);
            this.state = this.nextState;
            this.nextState = LEVEL_STATE_UNDEFINED;
            this.stateChange = false;
        }

        switch(this.state)
        {
            case LEVEL_STATE_WAIT : 
                this.timerLoop();
                break;
            case LEVEL_STATE_GAME :
                this.gameLoop();
                break;
        }

    }

    initSun(){
        this.sun = BABYLON.MeshBuilder.CreateSphere("sun", {diameter: 0.2}, theScene);
        this.sun.masse = 1000;
        
        var sunMaterial = new BABYLON.StandardMaterial('sunMaterial', theScene);

        this.sunlight = new BABYLON.PointLight('sunLight', new BABYLON.Vector3.Zero(), theScene);
        sunMaterial.emissiveTexture = new BABYLON.Texture('textures/sun.jpg', theScene);
        sunMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sunMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.sun.material = sunMaterial;
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

    

    drawFrontCircle(planet) {
        var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.position.z - zMax)/2});
        /*
        d.material = new BABYLON.StandardMaterial("MoonMaterial", theScene);
        d.material.ambiantColor = new BABYLON.Color3(1,0,0);
        d.material.diffuseColor = new BABYLON.Color3(1,0,0);
        d.material.specularColor = new BABYLON.Color3(1,0,0);
        */

        d.position.x = planet.position.x;
        d.position.y = planet.position.y;
        d.position.z = zMax;
        d.visibility = Math.max(0, (DISC_DIST - Math.abs(planet.position.z - zMax))/DISC_DIST) ;
        this.discs.push(d);
    }

    drawTopCircle(planet) {
        var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.position.y - yMax)/2});
        
        d.rotation = new BABYLON.Vector3(-Math.PI / 2,0,0);
        d.position.x = planet.position.x;
        d.position.y = yMax;
        d.position.z = planet.position.z;
        d.visibility = Math.max(0, (DISC_DIST - Math.abs(planet.position.y - yMax))/DISC_DIST) ;
        this.discs.push(d);
    }

    drawBottomCircle(planet) {
        var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.position.y - yMin)/2});
        
        d.rotation = new BABYLON.Vector3(Math.PI / 2,0,0);
        d.position.x = planet.position.x;
        d.position.y = yMin;
        d.position.z = planet.position.z;
        d.visibility = Math.max(0, (DISC_DIST - Math.abs(planet.position.y - yMin))/DISC_DIST) ;
        this.discs.push(d);
    }

    drawLeftCircle(planet) {
        var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.position.x - xMin)/2});
        
        d.rotation = new BABYLON.Vector3(0,-Math.PI / 2,0);
        d.position.x = xMin;
        d.position.y = planet.position.y;
        d.position.z = planet.position.z;
        d.visibility = Math.max(0, (DISC_DIST - Math.abs(planet.position.x - xMin))/DISC_DIST) ;
        this.discs.push(d);
    }

    drawRightCircle(planet) {
        var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.position.x - xMax)/2});
        
        d.rotation = new BABYLON.Vector3(0,Math.PI / 2,0);
        d.position.x = xMax;
        d.position.y = planet.position.y;
        d.position.z = planet.position.z;
        d.visibility = Math.max(0, (DISC_DIST - Math.abs(planet.position.x - xMax))/DISC_DIST) ;
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

        if(this.discs.length > 0)
        this.cleanDiscs();

        if(((x-xMin)<DISC_DIST)&&((x-xMin)>0)&&(z>zMin)&&(z<zMax)&&(y>yMin)&&(y<yMax)) {
            this.drawLeftCircle(this.P1);
        }
        if(((xMax-x)<DISC_DIST)&&((xMax-x)>0)&&(z>zMin)&&(z<zMax)&&(y>yMin)&&(y<yMax)) {
            this.drawRightCircle(this.P1);
        }
        if(((yMax-y)<DISC_DIST)&&((yMax-y)>0)&&(z>zMin)&&(z<zMax)&&(x>xMin)&&(x<xMax)) {
            this.drawTopCircle(this.P1);
        }
        if(((y-yMin)<DISC_DIST)&&((y-yMin)>0)&&(z>zMin)&&(z<zMax)&&(x>xMin)&&(x<xMax)) {
            this.drawBottomCircle(this.P1);
        }
        if(((zMax-z)<DISC_DIST)&&((zMax-z)>0)&&(x>xMin)&&(x<xMax)&&(y>yMin)&&(y<yMax)) {
            this.drawFrontCircle(this.P1);
        }
        
    }

    // loop utilisée uniquement lors du compte à rebours
    timerLoop(){
        var s = Math.ceil(5 - (Date.now() - this.timer)/1000);
        if(s == 0){
            this.stateChange = true;
            this.nextState = LEVEL_STATE_GAME;
        }
        else {
            theTimerPlaneText.text = String(s);
            this.timer += 1;
        }
        this.computeSunPosition();
    }

    // loop utilisée pour la phase de jeu
    gameLoop(){}

} // end class gameLevel


const LEVEL_STATE_UNDEFINED = -1;
const LEVEL_STATE_INTRO = 0;
const LEVEL_STATE_WAIT = 1;
const LEVEL_STATE_GAME = 2;
const LEVEL_STATE_SUCCESS = 3;
const LEVEL_STATE_FAIL = 4;

const LEVELS_NUMBER = 2;

var theXRHelper = null;
var theHeight = 0;
var theScene = null;
var theMenuPlane = null;
var theExplanationPlane = null;
var theExplanationPlaneText = null;
var theExplanationPlaneButton = null;
var theExplanationPlaneTarget = LEVEL_STATE_UNDEFINED;
var theRightMotionController = null;
var theLeftMotionController = null;
var theTimerPlane = null;
var theTimerPlaneText = null;
var theCubePlayground = null;
var theCurrentLevel = null;
var theFailPlane = null;
var theFailPlaneText = null;
var theSuccessPlane = null;
var theSuccessPlaneText = null;

var xMin = -0.7; 
var xMax = 0.7;
var zMin = 0.05; 
var zMax = 1.05;

// yMin et yMax sont déterminés par la position du casque
var yMin = -1; 
var yMax = -1;
var yRange = 1.3;

function createMenuPlane(){
    var menuPlane = BABYLON.Mesh.CreatePlane("menu", 1, theScene);
    menuPlane.position = new BABYLON.Vector3(0, 1, 2);        
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(menuPlane);
    var menuStackPanel = new BABYLON.GUI.StackPanel();    
    advancedTexture.addControl(menuStackPanel);  
    var header = new BABYLON.GUI.TextBlock();
    header.text = "Start Menu";
    header.textWrapping= true;
    header.width = "500px";
    header.height = "100px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = "50"
    menuStackPanel.addControl(header);
   

    for (let i = 1; i <= LEVELS_NUMBER; i++) {

        var button = BABYLON.GUI.Button.CreateSimpleButton("L"+i, "Level "+i);
        button.width = "200px";
        button.height = "200px";
        button.color = "white";
        button.fontSize = 50;
        button.background = "green";
        button.paddingTop = "10px";
        button.cornerRadius = 50;
        
        
        button.onPointerUpObservable.add(function() {
            levelChange = LEVEL_CHANGE_FLAG.GOTO_LEVEL;
            targetLevelID = i;
        });
        menuStackPanel.addControl(button);
    }
    theMenuPlane = menuPlane;
    theMenuPlane.setEnabled(false);
    //return explanationPlane;
}

function createCubePlayground(){


    console.log("theHeight : " + theHeight);

    yMax = theHeight + 0.2;
    yMin = yMax - yRange;


    var cubePoints = [
        new BABYLON.Vector3(xMin, yMin, zMin),
        new BABYLON.Vector3(xMin, yMax, zMin),
        new BABYLON.Vector3(xMax, yMax, zMin),
        new BABYLON.Vector3(xMax, yMin, zMin),
        new BABYLON.Vector3(xMin, yMin, zMin),
        new BABYLON.Vector3(xMin, yMin, zMax),
        new BABYLON.Vector3(xMax,yMin, zMax),
        new BABYLON.Vector3(xMax,yMin, zMin),
        new BABYLON.Vector3(xMax,yMax, zMin),
        new BABYLON.Vector3(xMax,yMax, zMax),
        new BABYLON.Vector3(xMin,yMax, zMax),
        new BABYLON.Vector3(xMin,yMax, zMin),
        new BABYLON.Vector3(xMin,yMax, zMax),
        new BABYLON.Vector3(xMin,yMin, zMax),
        new BABYLON.Vector3(xMax,yMin, zMax),
        new BABYLON.Vector3(xMax,yMax, zMax),
    ]

    theCubePlayground = BABYLON.MeshBuilder.CreateLines("lines", {points: cubePoints});
    theCubePlayground.setEnabled(false);
}

function newRetryButton(){
    var button = BABYLON.GUI.Button.CreateSimpleButton("clickMeButton", "Retry");
    button.width = "200px";
    button.height = "200px";
    button.color = "white";
    button.fontSize = 50;
    button.cornerRadius = 50;
    button.background = "green";
    button.paddingRight = "10px";

    button.onPointerUpObservable.add(function() {
        theCurrentLevel.stateChange = true;
        theCurrentLevel.nextState = LEVEL_STATE_WAIT;
    });

    return button;
}

function newMenuButton(){
    var button = BABYLON.GUI.Button.CreateSimpleButton("clickMeButton", "Menu");
    button.width = "200px";
    button.height = "200px";
    button.color = "white";
    button.fontSize = 50;
    button.cornerRadius = 50;
    button.background = "green";
    button.paddingRight = "10px";

    button.onPointerUpObservable.add(function() {
        levelChange = LEVEL_CHANGE_FLAG.MENU;
    });

    return button;
}

function createFailPlane(){
    var failPlane = BABYLON.Mesh.CreatePlane("plane", 1, theScene);
    failPlane.position = new BABYLON.Vector3(0, 1, 2);        
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(failPlane);
    var failPanel = new BABYLON.GUI.StackPanel();
    failPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(failPanel);  
    var header = new BABYLON.GUI.TextBlock();
    header.text = "You Loose !!!";
    header.textWrapping= true;
    header.width = "1000px";
    header.height = "500px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = "50";

    failPanel.addControl(header);
    theFailPlaneText = header;

    var buttonPanel = new BABYLON.GUI.StackPanel();  
      
    buttonPanel.isVertical = false;
    buttonPanel.width = "450px";
    buttonPanel.height = "200px";
    buttonPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    failPanel.addControl(buttonPanel);  

    buttonPanel.addControl(newRetryButton());
    buttonPanel.addControl(newMenuButton());

    theFailPlane = failPlane;
    failPlane.setEnabled(false);
}

function createSuccessPlane(){
    var successPlane = BABYLON.Mesh.CreatePlane("plane", 1, theScene);
    successPlane.position = new BABYLON.Vector3(0, 1, 2);        
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(successPlane);
    var successPanel = new BABYLON.GUI.StackPanel();    
    advancedTexture.addControl(successPanel);  
    var header = new BABYLON.GUI.TextBlock();
    header.text = "fghj fg";
    header.textWrapping= true;
    header.width = "1000px";
    header.height = "500px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = "50"
    successPanel.addControl(header);
    theSuccessPlaneText = header;

    successPanel.addControl(newRetryButton());
    successPanel.addControl(newMenuButton());

    theSuccessPlane = successPlane;
    successPlane.setEnabled(false);
}

function createExplanationPlane(){
        var explanationPlane = BABYLON.Mesh.CreatePlane("plane", 1, theScene);
        explanationPlane.position = new BABYLON.Vector3(0, 1, 2);        
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(explanationPlane);
        var explanationPanel = new BABYLON.GUI.StackPanel();    
        advancedTexture.addControl(explanationPanel);  
        var header = new BABYLON.GUI.TextBlock();
        header.text = "gj gjh";
        header.textWrapping= true;
        header.width = "1000px";
        header.height = "500px";
        header.color = "white";
        header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        header.fontSize = "50"
        explanationPanel.addControl(header);
        theExplanationPlaneText = header;

        var button = BABYLON.GUI.Button.CreateSimpleButton("clickMeButton", "Start");
        button.width = "200px";
        button.height = "100px";
        button.color = "white";
        button.fontSize = 50;
        button.cornerRadius = 50;
        button.background = "green";
        theExplanationPlaneButton = button.children[0];
        
        button.onPointerUpObservable.add(function() {
            // if (xr) { xr.displayLaserPointer = !xr.displayLaserPointer; }
            // button.children[0].text = "C'est parti !!!";
            theCurrentLevel.nextState = theExplanationPlaneTarget;
            theCurrentLevel.stateChange = true;
        });
        explanationPanel.addControl(button);
        theExplanationPlane = explanationPlane;
        explanationPlane.setEnabled(false);
        //return explanationPlane;
}

function hideControllers(){
    var p = theRightMotionController.rootMesh;
    p.visibility = false; 
    for (var i = 0; i < p.getChildMeshes(false).length; i++){			
        p.getChildMeshes(false)[i].visibility = false; 
    }
    var p = theLeftMotionController.rootMesh;
    p.visibility = false; 
    for (var i = 0; i < p.getChildMeshes(false).length; i++){			
        p.getChildMeshes(false)[i].visibility = false; 
    }

    theXRHelper.pointerSelection.displayLaserPointer = false;
    theXRHelper.pointerSelection.disablePointerLighting = false;
    theXRHelper.pointerSelection.displaySelectionMesh = false;

}

function showControllers(){
    var p = theRightMotionController.rootMesh;
    p.visibility = true; 
    for (var i = 0; i < p.getChildMeshes(false).length; i++){			
        p.getChildMeshes(false)[i].visibility = true; 
    }
    var p = theLeftMotionController.rootMesh;
    p.visibility = true; 
    for (var i = 0; i < p.getChildMeshes(false).length; i++){			
        p.getChildMeshes(false)[i].visibility = true; 
    }

    theXRHelper.pointerSelection.displayLaserPointer = true;
    theXRHelper.pointerSelection.disablePointerLighting = true;
    theXRHelper.pointerSelection.displaySelectionMesh = true;
}

function createTimerPlane(){
    theTimerPlane = BABYLON.Mesh.CreatePlane("plane", 1, theScene);
    theTimerPlane.position = new BABYLON.Vector3(0, 1, 2);        
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(theTimerPlane);
    var panel = new BABYLON.GUI.StackPanel();    
    advancedTexture.addControl(panel);  
    theTimerPlaneText = new BABYLON.GUI.TextBlock();
    
    theTimerPlaneText.text = String("toto");
    theTimerPlaneText.height = "100px";
    theTimerPlaneText.color = "white";
    theTimerPlaneText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    theTimerPlaneText.fontSize = "120";
    panel.addControl(theTimerPlaneText);

    theTimerPlane.setEnabled(false);

}

function arrowTransform(VMomentum, VCenter, VATransformer){

    var alpha = Math.asin(VMomentum.y/VMomentum.length());
    var theta = Math.atan2(VMomentum.z,VMomentum.x);

    if((alpha > Math.PI/2)||(alpha < -Math.PI/2)) 
        theta = -(Math.PI - theta);
    
    
    var MZ = BABYLON.Matrix.RotationZ(alpha);
    var MY = BABYLON.Matrix.RotationY(-theta);
   
    var T1 = BABYLON.Vector3.TransformCoordinates(VATransformer,MZ);
    var T2 = BABYLON.Vector3.TransformCoordinates(T1,MY);

    return T2.addInPlace(VCenter);   
}

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

    // création des objets spécifiques au niveau
    // cube, panels et sun sont construit au niveau global
    initLevel(){}

    // setup et affichage des objets pendant le compte à rebours
    initPlayground(){}

    // effacement des fleches au démarrage de la phase de jeu
    launchGame(){}

    // nettoyage des meshs spécifiques au niveau
    cleanLevel(){
        theFailPlane.setEnabled(false);
    }

    // configuration du level en fonction de son état (suite à un stateChange)
    initState(state){
        switch(state)
        {
            case LEVEL_STATE_INTRO : 
                theExplanationPlaneText.text = "Let's go !";
                theExplanationPlaneButton.text = "Start";
                theExplanationPlaneTarget = LEVEL_STATE_WAIT;
                theExplanationPlane.setEnabled(true);
                break;
            case LEVEL_STATE_WAIT :
                theHLight.intensity = 0.5;
                theFailPlane.setEnabled(false);
                theExplanationPlane.setEnabled(false);
                hideControllers();
                theTimerPlane.setEnabled(true);
                theCubePlayground.setEnabled(true);
                this.initPlayground();
                this.timer = Date.now();
                break;
            case LEVEL_STATE_GAME :
                theExplanationPlaneTarget = LEVEL_STATE_WAIT;
                theExplanationPlane.setEnabled(false);
                theTimerPlane.setEnabled(false);
                this.launchGame();
                this.timer = Date.now();
                break;
            case LEVEL_STATE_SUCCESS : 
                theHLight.intensity = 1;
                theTimerPlane.setEnabled(false);
                showControllers();
                this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition().clone();
                theHLight.position = this.sun.position;
                theExplanationPlaneText.text = "You win !";
                theExplanationPlaneButton.text = "Start again";
                theExplanationPlaneTarget = LEVEL_STATE_WAIT;
                theExplanationPlane.setEnabled(true);
                break;
            case LEVEL_STATE_FAIL : 
                theHLight.intensity = 1;
                theTimerPlane.setEnabled(false);
                this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition().clone();
                theHLight.position = this.sun.position;
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
    }

    // loop utilisée pour la phase de jeu
    gameLoop(){}

} // end class gameLevel

// *******************************************************************
// *******************************************************************

class Level1 extends gameLevel {

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
    
        this.P1.momentum = new BABYLON.Vector3(-0.1,-0.1,-0.1); // également dans initPlayground
        this.P1.position = new BABYLON.Vector3(0.2,theHeight - 0.2,0.8);
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
        this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition();
        this.sunlight.position = this.sun.position;
        this.P1.position = new BABYLON.Vector3(0.2,theHeight - 0.2,0.8);
        this.P1.momentum = new BABYLON.Vector3(-0.1,-0.1,-0.1);
        this.P1.setEnabled(true);

        this.P1.arrow.setEnabled(true);
    }

    launchGame(){
        this.P1.arrow.setEnabled(false);
    }

    gameLoop(){
        var x = this.P1.position.x;
        var y = this.P1.position.y;
        var z = this.P1.position.z;
        var s = 0;

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


} // end class Level1


// *******************************************************************
// *******************************************************************

class Level2 extends gameLevel {

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
        this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition();
        this.sunlight.position = this.sun.position;
        this.P1.position = new BABYLON.Vector3(0,theHeight - 0.2,0.8);
        this.P1.momentum = new BABYLON.Vector3(0.1,-0.1,-0.1);
        this.P1.setEnabled(true);

        this.P1.arrow.setEnabled(true);
    }

    launchGame(){
        this.P1.arrow.setEnabled(false);
    }

    gameLoop(){
        var x = this.P1.position.x;
        var y = this.P1.position.y;
        var z = this.P1.position.z;
        var s = 0;

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


} // end class Level2

// *******************************************************************
// *******************************************************************

class Menu {
    initLevel(){
        theMenuPlane.setEnabled(true);
        theCubePlayground.setEnabled(false);
    }
    cleanLevel(){
        theMenuPlane.setEnabled(false);
        theCubePlayground.setEnabled(true);
    }

    levelRenderLoop() {}
} // end class Menu

// *******************************************************************
// *******************************************************************

var canvas = document.getElementById("renderCanvas");

var engine = null;
var sceneToRender = null;

var isWebXRInitialized = false;


const LEVEL_CHANGE_FLAG = {
    UNDEFINED : -1,
    NO_CHANGE : 0,
    MENU : 1,
    NEXT_LEVEL : 2,
    GOTO_LEVEL : 3,
}

const GAME_STATE_WAINTING_WEBXR = -1;
var currentLevelID = GAME_STATE_WAINTING_WEBXR;
var currentLevel = null;
var levelChange = LEVEL_CHANGE_FLAG.UNDEFINED;

var levels = null;
var targetLevelID = 0;

var theHLight = null;

var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

var createScene = async function () {

    theScene = new BABYLON.Scene(engine);
   
    theHLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 2, 0), theScene);

    var dome = new BABYLON.PhotoDome(
        "testdome",
        "./textures/8k_stars_milky_way.jpg",
        {
            resolution: 64,
            size: 1000
        },
        theScene
    );

    theXRHelper = await theScene.createDefaultXRExperienceAsync({});
    

    theXRHelper.input.onControllerAddedObservable.add((controller) => {
        controller.onMotionControllerInitObservable.add((motionController) => {
            isWebXRInitialized = true;
            if (motionController.handness === 'right') {
                    theRightMotionController = motionController;
            }
            else {
                    theLeftMotionController = motionController;
            }
        })
 
    });

    levels = new Array(2);
    levels[0] = new Menu();
    levels[1] = new Level1();
    levels[2] = new Level2();

    theScene.registerBeforeRender(() => {  
        if(! isWebXRInitialized) return;

        if(currentLevelID ==  GAME_STATE_WAINTING_WEBXR) {

            theHeight = theXRHelper.baseExperience.camera.realWorldHeight;
            createMenuPlane();
            createExplanationPlane();
            createTimerPlane();
            createCubePlayground();
            createFailPlane();

            currentLevelID = 0;
            theCurrentLevel = levels[0];
            levelChange = LEVEL_CHANGE_FLAG.MENU;
        }
        else
        {
            switch(levelChange){
                case LEVEL_CHANGE_FLAG.MENU :
                    theCurrentLevel.cleanLevel();
                    theCurrentLevel = levels[ 0 ];
                    theCurrentLevel.initLevel();
                    currentLevelID = 0;
                    levelChange = LEVEL_CHANGE_FLAG.NO_CHANGE;
                    break;
                case LEVEL_CHANGE_FLAG.NEXT_LEVEL :
                    targetLevelID = currentLevelID + 1;
                case LEVEL_CHANGE_FLAG.GOTO_LEVEL :
                    theCurrentLevel.cleanLevel();
                    theCurrentLevel = levels[ targetLevelID ];
                    console.log("in switch "+targetLevelID);
                    theCurrentLevel.initLevel();
                    currentLevelID = targetLevelID;
                    levelChange = LEVEL_CHANGE_FLAG.NO_CHANGE;
                    break;
                case LEVEL_CHANGE_FLAG.UNDEFINED : 
                console.log("levelChange value undefined");
                    break;
                case LEVEL_CHANGE_FLAG.NO_CHANGE :
                    theCurrentLevel.levelRenderLoop();
                    break;
                default:
                    console.log("levelChange value error");
            }            
        }
    })

    return theScene;
};

// *******************************************************************

window.initFunction = async function() {               
    var asyncEngineCreation = async function() {
        try {
        return createDefaultEngine();
        } catch(e) {
        console.log("the available createEngine function failed. Creating the default engine instead");
        return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    window.scene = createScene();};
    initFunction().then(() => {scene.then(returnedScene => { sceneToRender = returnedScene; });
            
        engine.runRenderLoop(function () {
            if (sceneToRender && sceneToRender.activeCamera) {
                sceneToRender.render();
            }
        });
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

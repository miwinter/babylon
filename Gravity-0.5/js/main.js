const LEVEL_STATE_UNDEFINED = -1;
const LEVEL_STATE_INTRO = 0;
const LEVEL_STATE_WAIT = 1;
const LEVEL_STATE_GAME = 2;
const LEVEL_STATE_SUCCESS = 3;
const LEVEL_STATE_FAIL = 4;

theXRHelper = null;
theHeight = 0;
theScene = null;
theExplanationPlane = null;
theExplanationPlaneText = null;
theExplanationPlaneButton = null;
theExplanationPlaneTarget = LEVEL_STATE_UNDEFINED;
theRightMotionController = null;
theLeftMotionController = null;
theTimerPlane = null;
theTimerPlaneText = null;
theCubePlayground = null;
theCurrentLevel = null;


function createCubePlayground(){

    const xSize = 1, ySize = 1, zSize = 1;

    console.log("theHeight : " + theHeight);

    var x = xSize / 2;
    var y = ySize / 2;

    var cubePoints = [
        new BABYLON.Vector3(-x, theHeight - ySize, 0),
        new BABYLON.Vector3(-x, theHeight, 0),
        new BABYLON.Vector3(x, theHeight, 0),
        new BABYLON.Vector3(x, theHeight - ySize, 0),
        new BABYLON.Vector3(-x, theHeight - ySize, 0),
        new BABYLON.Vector3(-x, theHeight - ySize, zSize),
        new BABYLON.Vector3(x,theHeight - ySize, zSize),
        new BABYLON.Vector3(x,theHeight - ySize, 0),
        new BABYLON.Vector3(x,theHeight, 0),
        new BABYLON.Vector3(x,theHeight, zSize),
        new BABYLON.Vector3(-x,theHeight, zSize),
        new BABYLON.Vector3(-x,theHeight, 0),
        new BABYLON.Vector3(-x,theHeight, zSize),
        new BABYLON.Vector3(-x,theHeight - ySize, zSize),
        new BABYLON.Vector3(x,theHeight - ySize, zSize),
        new BABYLON.Vector3(x,theHeight, zSize),
    ]

    return theCubePlayground = BABYLON.MeshBuilder.CreateLines("lines", {points: cubePoints});
}

function createExplanationPlane(){
        var explanationPlane = BABYLON.Mesh.CreatePlane("plane", 1, theScene);
        explanationPlane.position = new BABYLON.Vector3(0, 1, 1);        
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(explanationPlane);
        var explanationPanel = new BABYLON.GUI.StackPanel();    
        advancedTexture.addControl(explanationPanel);  
        var header = new BABYLON.GUI.TextBlock();
        header.text = "gh gh gh gh gh gh gh gh gh ghj kgh gh ghjk ghj gh gh kgh kgh gh gh ghjk gh kgh k";
        header.textWrapping= true;
        header.width = "1000px";
        header.height = "500px";
        header.color = "white";
        header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        header.fontSize = "50"
        explanationPanel.addControl(header);
        theExplanationPlaneText = header;

        var button = BABYLON.GUI.Button.CreateSimpleButton("clickMeButton", "Commencer");
        button.width = 1;
        button.height = "100px";
        button.color = "white";
        button.fontSize = 50;
        button.background = "green";
        theExplanationPlaneButton = button.children[0];
        
        button.onPointerUpObservable.add(function() {
            // if (xr) { xr.displayLaserPointer = !xr.displayLaserPointer; }
            button.children[0].text = "C'est parti !!!";
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
    cleanLevel(){}

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
                this.launchGame();
                this.timer = Date.now();
                break;
            case LEVEL_STATE_SUCCESS : 
                theTimerPlane.setEnabled(false);
                theExplanationPlaneText.text = "You win !";
                theExplanationPlaneButton.text = "Start again";
                theExplanationPlaneTarget = LEVEL_STATE_WAIT;
                theExplanationPlane.setEnabled(true);
                break;
            case LEVEL_STATE_FAIL : 
                theTimerPlane.setEnabled(false);
                theExplanationPlaneText.text = "You failed !";
                theExplanationPlaneButton.text = "Retry";
                theExplanationPlaneTarget = LEVEL_STATE_WAIT;
                theExplanationPlane.setEnabled(true);
                break;
        }
    }


    levelRenderLoop() {
        if(this.stateChange)
        {
            console.log(this.nextState);
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
        this.G = 0.000002;

        // Création du soleil
        this.sun = BABYLON.MeshBuilder.CreateSphere("sun", {diameter: 0.1}, theScene);
        //this.sun.material = new BABYLON.StandardMaterial("sunMat", theScene);

        //this.sun.material.diffuseTexture = new BABYLON.Texture("textures/2k_sun.jpg", theScene);

        //this.sun.material.diffuseTexture = new BABYLON.VideoTexture("video", ["textures/sun-texture.mp4"],theScene);
        //this.sun.material.diffuseTexture.vScale *= -2;

        //this.sun.material.diffusiveColor = new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5);
        //this.sun.material.emissiveColor = new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5);
        
        this.gl = new BABYLON.GlowLayer("glow", theScene);
        this.gl.intensity = 10;
        this.gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
            if (mesh.name === "sun") {
                result.set(0.6259, 0.3056, 0.0619, 0.5);
            } else {
                result.set(0, 0, 0, 0);
            }
        }
    
        this.sun.masse = 1000;
        this.sun.setEnabled(false);

        // création de la planete 1
        this.P1 = BABYLON.MeshBuilder.CreateSphere("P1", {diameter: 0.05, segments: 32}, theScene);
        this.P1.material = new BABYLON.StandardMaterial("earthMat", theScene);
        this.P1.material.diffuseTexture = new BABYLON.Texture("textures/earth.jpg", theScene);
    
        this.P1.momentum = new BABYLON.Vector3(-0,-0.001,-0.1);
        this.P1.position = new BABYLON.Vector3(0.2,theHeight - 0.2,0.8);
        this.P1.masse = 1;

        this.P1.setEnabled(false);

        this.P1.arrow = BABYLON.Mesh.CreateLines("P1_arrow", [ 
            this.P1.position.clone(), 
            this.P1.position.clone().addInPlace(this.P1.momentum)
            ], this.scene);
        this.P1.arrow.color = new BABYLON.Color3(0, 1, 0);

        this.P1.arrow.setEnabled(false);
    }

    initPlayground(){
        this.sun.setEnabled(true);
        this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition();

        // création de la planete 1
        this.P1.momentum = new BABYLON.Vector3(-0,-0.001,-0.1);
        this.P1.position = new BABYLON.Vector3(0.2,theHeight - 0.2,0.8);

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
                s = Math.ceil(500 - (Date.now() - this.timer)/10)/100;
                theTimerPlaneText.text = String(s.toLocaleString(undefined,{ minimumFractionDigits: 2 }));
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
                theTimerPlaneText.text = String((5).toLocaleString(undefined,{ minimumFractionDigits: 2 }));
            }
        }
        
        this.dist_vector = this.P1.position.subtract(this.sun.position);

        var distance2 = Math.pow(this.dist_vector.length(),2);

        this.dist_vector.normalize();

        this.gravity_force = this.dist_vector.scale(- this.G * this.sun.masse * this.P1.masse /  distance2);
        //this.gravity_force = this.dist_vector.scale(- this.G * this.sun.masse * this.P1.masse /  this.dist_vector.length());
        
        this.gravity_force.normalize().scaleInPlace(0.05);

        if(this.gravity_force.length() > 0.05) {
            this.gravity_force.normalize().scaleInPlace(0.05)
        }
        if(this.gravity_force.length() < 0.005) {
            this.gravity_force.normalize().scaleInPlace(0.005)
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


}


// *******************************************************************
// *******************************************************************


var canvas = document.getElementById("renderCanvas");

var engine = null;
var sceneToRender = null;

var isWebXRInitialized = false;

const GAME_STATE_WAINTING_WEBXR = -1;

var currentLevel = GAME_STATE_WAINTING_WEBXR;

var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

var createScene = async function () {

    theScene = new BABYLON.Scene(engine);
   

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 2, 0), theScene);

    var dome = new BABYLON.PhotoDome(
        "testdome",
        "./textures/8k_stars_milky_way.jpg",
        {
            resolution: 32,
            size: 10
        },
        theScene
    );

    theXRHelper = await theScene.createDefaultXRExperienceAsync({});
    //const theXRHelper = await BABYLON.WebXRExperienceHelper.CreateAsync(theScene);
    //const sessionManager = await theXRHelper.enterXRAsync("immersive-vr", "local-floor" /*, optionalRenderTarget */ );



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

    


    theScene.registerBeforeRender(() => {  
        if(! isWebXRInitialized) return;
        if(currentLevel ==  GAME_STATE_WAINTING_WEBXR) {

            theHeight = theXRHelper.baseExperience.camera.realWorldHeight;
            createExplanationPlane();
            createTimerPlane();
            createCubePlayground();

            theCurrentLevel = new Level1();
            theCurrentLevel.initLevel();
            currentLevel = 0;
        }
        else
        {
            theCurrentLevel.levelRenderLoop();
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

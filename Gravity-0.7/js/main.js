


var canvas = document.getElementById("renderCanvas");

var engine = null;
var sceneToRender = null;

var isWebXRInitialized = false;

var theHLight = null;

var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

var createScene = async function () {

    theScene = new BABYLON.Scene(engine);
    
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -0.15), theScene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    theHLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 5, 0), theScene);
    theHLight.diffuse = new BABYLON.Color3(1, 1, 1);
	theHLight.specular = new BABYLON.Color3(0, 0, 0);
	theHLight.groundColor = new BABYLON.Color3(0.5,0.5,0.5);

    var dome = new BABYLON.PhotoDome(
        "testdome",
        "./textures/8k_stars_milky_way.jpg",
        {
            resolution: 64,
            size: 1000
        },
        theScene
    );
    
    var btn = document.createElement("button");        // Create a <button> element
    btn.className = "enter-class";
    var t = document.createTextNode("ENTER VR");       // Create a text node
    btn.appendChild(t);                                // Append the text to <button>

    var xrButton = new BABYLON.WebXREnterExitUIButton(btn, "immersive-vr", "local-floor");

    // XR
    SOLAR.theXRHelper = await theScene.createDefaultXRExperienceAsync({
        // disableDefaultUI: true,
        uiOptions: {
            customButtons: [xrButton]
        }
    });

    // centering the "ENTER" button
    var x_center = Math.floor(document.getElementById("renderCanvas").width / 2 - 100);
    var y_center = Math.floor(document.getElementById("renderCanvas").height * 0.5);
    
    var d = document.getElementsByClassName('xr-button-overlay').item(0);
    //d.setAttribute("style", "background-color:darkblue;"); // border-radius: 8px;

    d.style.position = "absolute";
    d.style.left = x_center+'px';
    d.style.top = y_center+'px';

    var d = document.getElementsByClassName('title').item(0);
    d.style.left = Math.floor(document.getElementById("renderCanvas").width / 3 - 100)+'px';
    d.style.top = Math.floor(document.getElementById("renderCanvas").height * 0.25)+'px';

    

    SOLAR.theXRHelper.input.onControllerAddedObservable.add((controller) => {
        controller.onMotionControllerInitObservable.add((motionController) => {
            isWebXRInitialized = true;
            if (motionController.handness === 'right') {
                    SOLAR.theRightMotionController = motionController;
            }
            else {
                    SOLAR.theLeftMotionController = motionController;
            }
        })
 
    });

    levels = new Array(10);
    SOLAR.initSound();
    levels[0] = new Menu();
    levels[1] = new Level1();
    levels[2] = new Level2();
    levels[3] = new Level3();
    levels[4] = new Level4();
    levels[5] = new Level5();
    levels[6] = new Level6();
    levels[7] = new Level7();
    levels[8] = new Level8();
    theScene.registerBeforeRender(() => {  
    
        if(! isWebXRInitialized) return;

        if(SOLAR.currentLevelID ==  SOLAR.GAME_STATE_WAINTING_WEBXR) {

            SOLAR.theHeight = SOLAR.theXRHelper.baseExperience.camera.realWorldHeight;
            console.log(SOLAR.theXRHelper.baseExperience.camera);
            SOLAR.createMenuPlane();
            SOLAR.createExplanationPlane();
            SOLAR.createTimerPlane();
            SOLAR.createCubePlayground();
            SOLAR.createFailPlane();
            SOLAR.createSuccessPlane();
            SOLAR.createNewHighScorePlane();

            SOLAR.currentLevelID = 0;
            SOLAR.theCurrentLevel = levels[0];
            SOLAR.levelChange = SOLAR.LEVEL_CHANGE_FLAG.MENU;
        }
        else
        {
            switch(SOLAR.levelChange){
                case SOLAR.LEVEL_CHANGE_FLAG.MENU :
                    console.log("LEVEL_CHANGE_FLAG.MENU");
                    SOLAR.theCurrentLevel.cleanLevel();
                    SOLAR.theCurrentLevel = levels[ 0 ];
                    SOLAR.theCurrentLevel.initLevel();
                    SOLAR.currentLevelID = 0;
                    SOLAR.levelChange = SOLAR.LEVEL_CHANGE_FLAG.NO_CHANGE;
                    break;
                case SOLAR.LEVEL_CHANGE_FLAG.NEXT_LEVEL :
                    console.log("LEVEL_CHANGE_FLAG.NEXT_LEVEL");
                    SOLAR.targetLevelID = SOLAR.currentLevelID + 1;
                case SOLAR.LEVEL_CHANGE_FLAG.GOTO_LEVEL :
                    console.log("LEVEL_CHANGE_FLAG.GOTO_LEVEL");
                    SOLAR.theCurrentLevel.cleanLevel();
                    SOLAR.theCurrentLevel = levels[ SOLAR.targetLevelID ];
                    console.log("in switch "+SOLAR.targetLevelID);
                    SOLAR.theCurrentLevel.initSun();
                    SOLAR.theCurrentLevel.initLevel();
                    SOLAR.theCurrentLevel.stateChange = true;
                    SOLAR.theCurrentLevel.nextState = SOLAR.LEVEL_STATE_INTRO;
                    SOLAR.currentLevelID = SOLAR.targetLevelID;
                    SOLAR.levelChange = SOLAR.LEVEL_CHANGE_FLAG.NO_CHANGE;
                    break;
                case SOLAR.LEVEL_CHANGE_FLAG.UNDEFINED : 
                console.log("levelChange value undefined");
                    break;
                case SOLAR.LEVEL_CHANGE_FLAG.NO_CHANGE :
                    SOLAR.theCurrentLevel.levelRenderLoop();
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

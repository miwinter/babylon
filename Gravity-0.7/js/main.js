


var canvas = document.getElementById("renderCanvas");

var engine = null;
var sceneToRender = null;

var isWebXRInitialized = false;

var theHLight = null;

var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

var createScene = async function () {

    theScene = new BABYLON.Scene(engine);
   
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
    

    theXRHelper = await theScene.createDefaultXRExperienceAsync({});
    

    theXRHelper.input.onControllerAddedObservable.add((controller) => {
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

    levels = new Array(3);
    levels[0] = new Menu();
    levels[1] = new Level4();
    levels[2] = new Level4();
    levels[3] = new Level3();
    levels[4] = new Level4();

    theScene.registerBeforeRender(() => {  
        if(! isWebXRInitialized) return;

        if(SOLAR.currentLevelID ==  SOLAR.GAME_STATE_WAINTING_WEBXR) {

            SOLAR.theHeight = theXRHelper.baseExperience.camera.realWorldHeight;
            SOLAR.createMenuPlane();
            SOLAR.createExplanationPlane();
            SOLAR.createTimerPlane();
            SOLAR.createCubePlayground();
            SOLAR.createFailPlane();
            SOLAR.createSuccessPlane();

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

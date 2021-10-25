const LEVEL_STATE_UNDEFINED = -1;
const LEVEL_STATE_INTRO = 0;
const LEVEL_STATE_WAIT = 1;
const LEVEL_STATE_GAME = 2;
const LEVEL_STATE_SUCCESS = 3;
const LEVEL_STATE_FAIL = 4;

const LEVELS_NUMBER = 4;

const DISC_DIST = 1; // distance par rapport aux bords à partir de laquelle les disc apparaissent

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

/*
var xMin = -0.7; 
var xMax = 0.7;
var zMin = 0.05; 
var zMax = 1.05;

// yMin et yMax sont déterminés par la position du casque
var yMin = -1; 
var yMax = -1;
var yRange = 1.3;
*/


var xMin = -2; 
var xMax = 2;
var zMin = 0.05; 
var zMax = 5;

// yMin et yMax sont déterminés par la position du casque
var yMin = -1; 
var yMax = -1;
var yRange = 4;




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
                    theRightMotionController = motionController;
            }
            else {
                    theLeftMotionController = motionController;
            }
        })
 
    });

    levels = new Array(3);
    levels[0] = new Menu();
    levels[1] = new Level1();
    levels[2] = new Level2();
    levels[3] = new Level3();
    levels[4] = new Level4();

    theScene.registerBeforeRender(() => {  
        if(! isWebXRInitialized) return;

        if(currentLevelID ==  GAME_STATE_WAINTING_WEBXR) {

            theHeight = theXRHelper.baseExperience.camera.realWorldHeight;
            createMenuPlane();
            createExplanationPlane();
            createTimerPlane();
            createCubePlayground();
            createFailPlane();
            createSuccessPlane();

            currentLevelID = 0;
            theCurrentLevel = levels[0];
            levelChange = LEVEL_CHANGE_FLAG.MENU;
        }
        else
        {
            switch(levelChange){
                case LEVEL_CHANGE_FLAG.MENU :
                    console.log("LEVEL_CHANGE_FLAG.MENU");
                    theCurrentLevel.cleanLevel();
                    theCurrentLevel = levels[ 0 ];
                    theCurrentLevel.initLevel();
                    currentLevelID = 0;
                    levelChange = LEVEL_CHANGE_FLAG.NO_CHANGE;
                    break;
                case LEVEL_CHANGE_FLAG.NEXT_LEVEL :
                    console.log("LEVEL_CHANGE_FLAG.NEXT_LEVEL");
                    targetLevelID = currentLevelID + 1;
                case LEVEL_CHANGE_FLAG.GOTO_LEVEL :
                    console.log("LEVEL_CHANGE_FLAG.GOTO_LEVEL");
                    theCurrentLevel.cleanLevel();
                    theCurrentLevel = levels[ targetLevelID ];
                    console.log("in switch "+targetLevelID);
                    theCurrentLevel.initLevel();
                    theCurrentLevel.stateChange = true;
                    theCurrentLevel.nextState = LEVEL_STATE_INTRO;
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

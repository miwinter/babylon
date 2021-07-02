class gameScene extends BABYLON.Scene{
    xrHelper = null;
    sun = null;

    constructor(engine) {
        super(engine);      
    }

    async init() {
        this.xrHelper = await this.createDefaultXRExperienceAsync({  });
    }

    populate() {
        this.sun = BABYLON.MeshBuilder.CreateSphere("sun", {diameter: 0.1}, this);
        var material = new BABYLON.StandardMaterial("material", this);
        var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 386, this);
        noiseTexture.octaves = 7;
        noiseTexture.persistence = 2;
        noiseTexture.brightness = 0.1;
        noiseTexture.animationSpeedFactor = 5;
        material.emissiveTexture = noiseTexture;
        material.diffusiveColor = new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5);
        material.emissiveColor = new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5);
        this.sun.material = material;
        this.sun.position = new BABYLON.Vector3(0,2,0.2);
            
        var gl = new BABYLON.GlowLayer("glow", this);
        gl.intensity = Math.floor(Math.random()*8+6);
    }

    addRightTriggerPressedAction( pressAction, releaseAction = null ){
        this.xrHelper.input.onControllerAddedObservable.add((controller) => {
            controller.onMotionControllerInitObservable.add((motionController) => {
                if (motionController.handness === 'right') {
                    const xr_ids = motionController.getComponentIds();
                    let triggerComponent = motionController.getComponent(xr_ids[0]);//xr-standard-trigger
                    triggerComponent.onButtonStateChangedObservable.add(() => {
                        if (triggerComponent.pressed) {
                            pressAction(this,motionController);
                        }
                        else{
                            if(releaseAction) releaseAction(this,motionController);
                        }
                    });
                    
                }
    
            })
    
        });
    }

    static myLog(ptr,motionController) {
        console.log(ptr.xrHelper.baseExperience.camera.realWorldHeight);
        console.log(ptr.xrHelper.baseExperience.camera.getFrontPosition(2));
    }
    static bindStar(ptr,motionController) {
        ptr.sun.position = motionController.rootMesh.getAbsolutePosition();
    }
    static releaseStar(ptr,motionController) {
        ptr.sun.position = motionController.rootMesh.getAbsolutePosition().clone();
    }
}


var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };


var createScene = async function () {

    var scene = new gameScene(engine);
    await scene.init();

    scene.populate();

    //scene.addRightTriggerPressedAction( gameScene.myLog )
    scene.addRightTriggerPressedAction( gameScene.bindStar, gameScene.releaseStar )

    scene.registerBeforeRender(() => {  
    })

    return scene;
};


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

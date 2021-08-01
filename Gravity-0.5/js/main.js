theXRHelper = null;
theHeight = 0;
theScene = null;
theExplanationPlane = null;
theExplanationPlaneText = null;
theExplanationPlaneButton = null;
theRightMotionController = null;
theLeftMotionController = null;
theTimerPlane = null;
theTimerPlaneText = null;
theCubePlayground = null;

function createCubePlayground(){

    const xSize = 1, ySize = 1, zSize = 1;
    
    // l'environnement doit être correctement initialisé pour que la camera soit définie
    theHeight = theXRHelper.baseExperience.camera.realWorldHeight;

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

        var clickMeButton = BABYLON.GUI.Button.CreateSimpleButton("clickMeButton", "Commencer");
        clickMeButton.width = 1;
        clickMeButton.height = "100px";
        clickMeButton.color = "white";
        clickMeButton.fontSize = 50;
        clickMeButton.background = "green";
        theExplanationPlaneButton = clickMeButton.children[0];
        
        clickMeButton.onPointerUpObservable.add(function() {
            // if (xr) { xr.displayLaserPointer = !xr.displayLaserPointer; }
            clickMeButton.children[0].text = "C'est parti !!!";
            nextState = 1;
        });
        explanationPanel.addControl(clickMeButton);
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


class gameState {

    sun = null;

    async init() {}

    initState(prevState = null) {}

    cleanState() {}

    sceneRenderLoop() {}
}

// *******************************************************************

class intro1 extends gameState {

    plane = null;

    initState(prevState = null) {
        theExplanationPlane.setEnabled(true);
    }

    cleanState() {
        //this.scene.removeMesh(this.plane);
        theExplanationPlane.setEnabled(false);

    }
}

// *******************************************************************

class state1 extends gameState {

    sun = null;
    P1 = null;
    timer = 0;

    sunController() {
        var cpos = theRightMotionController.rootMesh.getAbsolutePosition().clone();
        
        return cpos;
    }

    initState(prevState = null) {

        // Création du soleil
        this.sun = BABYLON.MeshBuilder.CreateSphere("sun", {diameter: 0.1}, this.scene);  
        this.sun.masse = 1000;
        this.sun.position = this.sunController();

        // Création du cube
        createCubePlayground();
 
        // création de la planete 1
        this.P1 = BABYLON.MeshBuilder.CreateSphere("P1", {diameter: 0.05, segments: 32}, this.scene);
    
        this.P1.momentum = new BABYLON.Vector3(-0,-0.001,-0.1);
        this.P1.position = new BABYLON.Vector3(0.2,theHeight - 0.2,0.8);
        this.P1.masse = 1;

        this.P1.arrow = BABYLON.Mesh.CreateLines("P1_arrow", [ 
            this.P1.position.clone(), 
            this.P1.position.clone().addInPlace(this.P1.momentum)
            ], this.scene);
        this.P1.arrow.color = new BABYLON.Color3(0, 1, 0);

        // effacement des poignées
        hideControllers();

        // affichage du timer
        theTimerPlane.setEnabled(true);
        this.timer = Date.now();
    }

    cleanState() {
        theScene.removeMesh(this.P1.arrow);
        this.P1.arrow.dispose();
        theTimerPlane.setEnabled(false);
    }

    sceneRenderLoop() {

        this.sun.position = this.sunController();
        var s = Math.ceil(5 - (Date.now() - this.timer)/1000);
        if(s == 0){
            nextState = 2;
        }
        else {
            theTimerPlaneText.text = String(s);
            this.timer += 1;
        }
    }
}

// *******************************************************************


class state2 extends gameState {
    sun = null;
    P1 = null;
    timer = 0;
    delta_time = 0;
    dist_vector = null;
    gravity_force = null;
    G = 0;
    already_in = false;

    sunController() {
        var cpos = theRightMotionController.rootMesh.getAbsolutePosition().clone();
        
        return cpos;
    }

    initState(prevState = null){

        this.sun = prevState.sun;
        this.P1 = prevState.P1;

        this.time = 0;
        this.delta_time = 0.1;
        this.dist_vector = BABYLON.Vector3.Zero();
        this.gravity_force = BABYLON.Vector3.Zero();
        this.G = 0.000002;

        // affichage du timer
        theTimerPlane.setEnabled(true);
        this.timer = Date.now();
    }

    sceneRenderLoop() {

        var x = this.P1.position.x;
        var y = this.P1.position.y;
        var z = this.P1.position.z;
        var s = 0;

        this.sun.position = this.sunController();

        if((x>-0.5)&&(x<0.5)&&(z>0)&&(z<1)&&(y>theHeight-1)&&(y<theHeight)) {
            if(this.already_in){
                s = Math.ceil(500 - (Date.now() - this.timer)/10)/100;
                theTimerPlaneText.text = String(s.toLocaleString(undefined,{ minimumFractionDigits: 2 }));
                if(s <= 0){
                    nextState = 3; // success
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

            nextState = 4; // fail
        }
        else{
            this.P1.momentum.addInPlace(  this.gravity_force.scale(this.delta_time));
            this.P1.position.addInPlace(  this.P1.momentum.scale(this.delta_time / this.P1.masse));
        }
        
    }

    cleanState() {
        showControllers();
        theTimerPlane.setEnabled(false);
    }
}

// *******************************************************************



class success extends gameState {

    P1 = null;
    sun = null;

    initState(prevState = null) {
        this.sun = prevState.sun;
        this.P1 = prevState.P1;

        theExplanationPlaneText.text = "Bravo !";
        theExplanationPlaneButton.text = "On recommence !";
        theExplanationPlane.setEnabled(true);

    }

    cleanState() {
        this.P1.dispose();
        this.sun.dispose();

        theCubePlayground.setEnabled(false);
        theExplanationPlane.setEnabled(false);
    }

}
// *******************************************************************



class fail extends gameState {

    P1 = null;
    sun = null;

    initState(prevState = null) {

        this.sun = prevState.sun;
        this.P1 = prevState.P1;

        theExplanationPlaneText.text = "Perdu !";
        theExplanationPlaneButton.text = "On recommence !";
        theExplanationPlane.setEnabled(true);
    }

    cleanState() {
        this.P1.dispose();
        this.sun.dispose();

        theCubePlayground.setEnabled(false);
        theExplanationPlane.setEnabled(false);
    }

}

// *******************************************************************

var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var nextState = -1;
var crtState = 0;
var states = new Array( 3 );
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

var createScene = async function () {

    theScene = new BABYLON.Scene(engine);
    createExplanationPlane();
    createTimerPlane();


    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 2, 0), theScene);

    theXRHelper = await theScene.createDefaultXRExperienceAsync({  });
    


    states[ 0 ] = new intro1();
    states[ 1 ] = new state1();
    states[ 2 ] = new state2();
    states[ 3 ] = new success();
    states[ 4 ] = new fail();

    theXRHelper.input.onControllerAddedObservable.add((controller) => {
        controller.onMotionControllerInitObservable.add((motionController) => {
            if (motionController.handness === 'right') {
                for(var i = 0; i < states.length; i++)
                    //states[ i ].rightMotionController = motionController;
                    theRightMotionController = motionController;
            }
            else {
                for(var i = 0; i < states.length; i++)
                    //states[ i ].leftMotionController = motionController;
                    theLeftMotionController = motionController;
            }
        })
 
    });

    
    states[ 0 ].initState();

    theScene.registerBeforeRender(() => {  
        if( nextState !=  -1 ) {
		    states[ crtState ].cleanState();
            states[ nextState ].initState(states[ crtState ]);
		    crtState = nextState;
            nextState  = -1;
        }
        states[ crtState ].sceneRenderLoop()

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

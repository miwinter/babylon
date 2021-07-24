class gameState {
    xrHelper = null;
    sun = null;
    scene = null;
    rightMotionController = null;
    leftMotionController = null;   

    constructor(scene,xrHelper, rightMotionController, leftMotionController) {
        this.scene = scene;  
        this.xrHelper = xrHelper;
        this.rightMotionController = rightMotionController;
        this.leftMotionController = leftMotionController;
    }

    async init() {}

    initState(prevState = null) {}

    cleanState() {}

    sceneRenderLoop() {}
}

// *******************************************************************

class intro1 extends gameState {

    plane = null;

    initState(prevState = null) {
        // Stack panel
        this.plane = BABYLON.Mesh.CreatePlane("plane", 1, this.scene);
        this.plane.position = new BABYLON.Vector3(0, 1, 1);        
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(this.plane);
        var panel = new BABYLON.GUI.StackPanel();    
        advancedTexture.addControl(panel);  
        var header = new BABYLON.GUI.TextBlock();
        header.text = "Color GUI";
        header.height = "100px";
        header.color = "white";
        header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        header.fontSize = "120"
        panel.addControl(header); 

        var clickMeButton = BABYLON.GUI.Button.CreateSimpleButton("clickMeButton", "Commencer");
        clickMeButton.width = 1;
        clickMeButton.height = "100px";
        clickMeButton.color = "white";
        clickMeButton.fontSize = 50;
        clickMeButton.background = "green";
        clickMeButton.onPointerUpObservable.add(function() {
            // if (xr) { xr.displayLaserPointer = !xr.displayLaserPointer; }
            console.log(clickMeButton.children[0].text);
            clickMeButton.children[0].text = "C'est parti !!!";
            nextState = 1;
        });
        panel.addControl(clickMeButton);
    }

    cleanState() {
        this.scene.removeMesh(this.plane);
    }

}

// *******************************************************************

class state1 extends gameState {

    cube = null;
    plane = null;
    header = null;
    sun = null;
    P1 = null;
    timer = 0;

    initState(prevState = null) {

        // *********************
        // Création du soleil
        this.sun = BABYLON.MeshBuilder.CreateSphere("sun", {diameter: 0.1}, this.scene);
        var material = new BABYLON.StandardMaterial("material", this.scene);
        var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 386, this.scene);
        
        noiseTexture.octaves = 7;
        noiseTexture.persistence = 2;
        noiseTexture.brightness = 0.1;
        noiseTexture.animationSpeedFactor = 5;
        material.emissiveTexture = noiseTexture;
        material.diffusiveColor = new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5);
        material.emissiveColor = new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5);
        this.sun.material = material;
        this.sun.position = new BABYLON.Vector3(0,2,0.2);
        this.sun.masse = 1000;
        
        var gl = new BABYLON.GlowLayer("glow", this.scene);
        gl.intensity = Math.floor(Math.random()*8+6);

        // Liaison du soleil à la manette droite
        this.sun.position = this.rightMotionController.rootMesh.getAbsolutePosition().clone().scaleInPlace(10);

        // *********************
        // Création du cube
        height = this.xrHelper.baseExperience.camera.realWorldHeight;
       
        const myPoints = [
            new BABYLON.Vector3(-0.5, -1+height, 0),
            new BABYLON.Vector3(-0.5, height, 0),
            new BABYLON.Vector3(0.5, height, 0),
            new BABYLON.Vector3(0.5, -1+height, 0),
            new BABYLON.Vector3(-0.5, -1+height, 0),
            new BABYLON.Vector3(-0.5, -1+height, 1),
            new BABYLON.Vector3(0.5,-1+height, 1),
            new BABYLON.Vector3(0.5,-1+height, 0),
            new BABYLON.Vector3(0.5,height, 0),
            new BABYLON.Vector3(0.5,height, 1),
            new BABYLON.Vector3(-0.5,height, 1),
            new BABYLON.Vector3(-0.5,height, 0),
            new BABYLON.Vector3(-0.5,height, 1),
            new BABYLON.Vector3(-0.5,-1+height, 1),
            new BABYLON.Vector3(0.5,-1+height, 1),
            new BABYLON.Vector3(0.5,height, 1),
        ]

        // création de la planete 1
        this.P1 = BABYLON.MeshBuilder.CreateSphere("P1", {diameter: 0.05, segments: 32}, this.scene);
        //this.P1.material = new BABYLON.StandardMaterial("P1_Material", this.scene);
        //this.P1.material.ambiantColor = new BABYLON.Color3(0, 0.5, 5);
        //this.P1.material.diffuseColor = new BABYLON.Color3(5, 5, 0);
        //this.P1.material.specularColor = new BABYLON.Color3(1, 1, 1);

        var earthMaterial = new BABYLON.StandardMaterial("ground", this.scene);
        earthMaterial.diffuseTexture = new BABYLON.Texture("textures/earth.jpg", this.scene);
        earthMaterial.diffuseTexture.vScale = -1;

        this.P1.material = earthMaterial;
    
        this.P1.momentum = new BABYLON.Vector3(0.1,0,0.1);
        this.P1.position = new BABYLON.Vector3(0.2,height - 0.8,0);
        this.P1.masse = 1;

        this.P1.arrow = BABYLON.Mesh.CreateLines("P1_arrow", [ 
            this.P1.position.clone(), 
            this.P1.position.clone().addInPlace(this.P1.momentum)
            ], this.scene);
        this.P1.arrow.color = new BABYLON.Color3(0, 1, 0);

        this.cube = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints});

        // *********************
        // effacement des poignées
        var p = this.rightMotionController.rootMesh;
        p.visibility = false; 
        for (var i = 0; i < p.getChildMeshes(false).length; i++){			
            p.getChildMeshes(false)[i].visibility = false; 
        }
        var p = this.leftMotionController.rootMesh;
        p.visibility = false; 
        for (var i = 0; i < p.getChildMeshes(false).length; i++){			
            p.getChildMeshes(false)[i].visibility = false; 
        }

        // *********************
        // affichage du timer
        this.plane = BABYLON.Mesh.CreatePlane("plane", 1, this.scene);
        this.plane.position = new BABYLON.Vector3(0, height-0.5, 1);        
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(this.plane);
        var panel = new BABYLON.GUI.StackPanel();    
        advancedTexture.addControl(panel);  
        this.header = new BABYLON.GUI.TextBlock();
        this.timer = Date.now();
        this.header.text = String();
        this.header.height = "100px";
        this.header.color = "white";
        this.header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.header.fontSize = "120"
        panel.addControl(this.header); 
    }

    cleanState() {
        this.scene.removeMesh(this.header);
        this.scene.removeMesh(this.plane);
        this.scene.removeMesh(this.P1.arrow);
    }

    sceneRenderLoop() {
        this.sun.position = this.rightMotionController.rootMesh.getAbsolutePosition().clone().scaleInPlace(10);
        var s = Math.ceil(5 - (Date.now() - this.timer)/1000);
        if(s == 0){
            nextState = 2;
        }
        else {
            this.header.text = String(s);
            this.timer += 1;
        }
    }
}

// *******************************************************************


class state2 extends gameState {
    cube = null;
    sun = null;
    P1 = null;
    time = 0;
    delta_time = 0;
    dist_vector = null;
    gravity_force = null;
    G = 0;
    plane = null;
    header = null;
    counter = 0;

    debug_count = 0;

    initState(prevState = null){
        
        this.cube = prevState.cube;
        this.sun = prevState.sun;
        this.P1 = prevState.P1;

        this.time = 0;
        this.delta_time = 0.1;
        this.dist_vector = BABYLON.Vector3.Zero();
        this.gravity_force = BABYLON.Vector3.Zero();
        this.G = 0.000002;


        // *********************
        // affichage du timer
        this.plane = BABYLON.Mesh.CreatePlane("plane", 1, this.scene);
        this.plane.position = new BABYLON.Vector3(0, height-0.5, 2);        
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(this.plane);
        var panel = new BABYLON.GUI.StackPanel();    
        advancedTexture.addControl(panel);  
        this.header = new BABYLON.GUI.TextBlock();
        this.timer = Date.now();
        this.header.text = String(this.counter);
        this.header.height = "100px";
        this.header.color = "white";
        this.header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.header.fontSize = "120"
        panel.addControl(this.header); 
    }

    sceneRenderLoop() {

        var x = this.P1.position.x;
        var y = this.P1.position.y;
        var z = this.P1.position.z;

        if((x>-0.5)&&(x<0.5)&&(z>0)&&(z<1)&&(y>height-1)&&(y<height)) {
            this.counter += 1;
            this.header.text = String(this.counter);
        }
        
        this.dist_vector = this.P1.position.subtract(this.sun.position);

        var distance2 = Math.pow(this.dist_vector.length(),2);

        this.dist_vector.normalize();

        this.gravity_force = this.dist_vector.scale(- this.G * this.sun.masse * this.P1.masse /  distance2);
        
        if(this.gravity_force.length() > 0.05) {
            this.gravity_force.normalize().scaleInPlace(0.05)
        }
        if(this.gravity_force.length() < 0.005) {
            this.gravity_force.normalize().scaleInPlace(0.005)
        }

        if(this.debug_count < 5){
            console.log("before");
            console.log(this.dist_vector);
            console.log(this.G * this.sun.masse * this.P1.masse /  distance2);

        }

        this.P1.momentum.addInPlace(  this.gravity_force.scale(this.delta_time));
        //console.log(gravity_force.scale(delta_time));
        //Earth.momentum.addInPlace( gravity_force.scale(-delta_time) );
        this.P1.position.addInPlace(  this.P1.momentum.scale(this.delta_time / this.P1.masse));
        //Earth.position.addInPlace( Earth.momentum.scale(delta_time / Earth.masse));

        if(this.debug_count < 5){
            console.log("after");
            console.log(this.P1.momentum);
            console.log(this.P1.position);
            this.debug_count += 1;
        }
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

var height = 0;


var createScene = async function () {

    var scene = new BABYLON.Scene(engine);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 2, 0), this.scene);

    var xrHelper = await scene.createDefaultXRExperienceAsync({  });
    var rightMotionController = null;
    var leftMotionController = null;

    states[ 0 ] = new intro1(scene, xrHelper, rightMotionController, leftMotionController);
    states[ 1 ] = new state1(scene, xrHelper, rightMotionController, leftMotionController);
    states[ 2 ] = new state2(scene, xrHelper, rightMotionController, leftMotionController);

    xrHelper.input.onControllerAddedObservable.add((controller) => {
        controller.onMotionControllerInitObservable.add((motionController) => {
            if (motionController.handness === 'right') {
                for(var i = 0; i < states.length; i++)
                    states[ i ].rightMotionController = motionController;
            }
            else {
                for(var i = 0; i < states.length; i++)
                    states[ i ].leftMotionController = motionController;
            }
        })
 
    });

    
    states[ 0 ].initState();

    scene.registerBeforeRender(() => {  
        if( nextState !=  -1 ) {
		    states[ crtState ].cleanState();
            states[ nextState ].initState(states[ crtState ]);
		    crtState = nextState;
            nextState  = -1;
        }
        states[ crtState ].sceneRenderLoop()

    })

    return scene;
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

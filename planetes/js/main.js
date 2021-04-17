let canvas;
let engine;
let scene;

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);

    scene = createScene();

    // Pour autoriser la VR
    // var VRHelper = scene.createDefaultVRExperience();

    engine.runRenderLoop(() => {
    
        scene.render();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    
    // ambiant color of the scene = green (like a green sun!)
    scene.ambiantColor = new BABYLON.Color3(0, 1, 0);

    Earth = BABYLON.MeshBuilder.CreateSphere("earth", {diameter: 5, segments: 32}, scene);
    Earth.material = new BABYLON.StandardMaterial("EarthMaterial", scene);
    Earth.material.ambiantColor = new BABYLON.Color3(0, 0.5, 0);
    Earth.material.diffuseColor = new BABYLON.Color3(5, 0, 0);
    Earth.material.specularColor = new BABYLON.Color3(0, 0, 0);

    Earth.momentum = new BABYLON.Vector3(0,0,0);
    Earth.position = new BABYLON.Vector3(0,0,0);
    Earth.masse = 1000;
    
   
    Earth.position = new BABYLON.Vector3(0,0,0);

    Moon = BABYLON.MeshBuilder.CreateSphere("Moon", {diameter: 3, segments: 32}, scene);
    Moon.material = new BABYLON.StandardMaterial("MoonMaterial", scene);
    Moon.material.ambiantColor = new BABYLON.Color3(0, 0.5, 5);
    Moon.material.diffuseColor = new BABYLON.Color3(5, 5, 0);
    Moon.material.specularColor = new BABYLON.Color3(0, 0, 0);

    Moon.momentum = new BABYLON.Vector3(0,1,0);
    Moon.position = new BABYLON.Vector3(10,0,0);
    Moon.masse = 1;

    // Cette Camera pour la VR
    // var camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(1, 1, -10), scene);
    
    // Cette pour le debug
    var camera = new BABYLON.ArcRotateCamera('MainCamera1', -1, 1, 20, BABYLON.Vector3(0, 0, 0), scene, true);
    // This targets the camera to scene origin
    //camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas,true);
    

    // lights
    var light = new BABYLON.PointLight("myPointLight", new BABYLON.Vector3(0, 200, 0), scene);
    light.intensity = .5;
    light.diffuse = new BABYLON.Color3(1, .5, .5);

    showWorldAxis(10)
    
    let counter = 0;
    time = 0;
    delta_time = 0.1;
    var dist_vector = BABYLON.Vector3.Zero();
    var gravity_force = BABYLON.Vector3.Zero();
    G = 0.01;

    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                switch(kbInfo.event.key){
                    case 'o':
                        G = G*1.1;
                        console.log("G = "+G);
                        break;
                    case 'p':
                        G = G*0.9;
                        console.log("G = "+G);
                        break; 
                }          
                console.log("KEY DOWN: ", kbInfo.event.key);
                break;
            case BABYLON.KeyboardEventTypes.KEYUP:
                console.log("KEY UP: ", kbInfo.event.keyCode);
                break;
        }
    });
    

    scene.registerBeforeRender(() => {
        /* for(let i = 0; i < spheres.length; i++) {
            spheres[i].position.z = 20+ 2*i + Math.sin((i*counter)/2);
            counter += 0.005;

            //sphereMaterials[i].wireframe = true

        }*/
        //alert(typeof Moon.position);
        dist_vector = Moon.position.subtract(Earth.position);
        //console.log(dist_vector);
        distance2 = Math.pow(dist_vector.length(),2);
        //console.log(distance);
        //console.log(dist_vector);alert()
        dist_vector.normalize();
        //console.log(dist_vector);
        gravity_force = dist_vector.scale(- G * Moon.masse * Earth.masse /  distance2);
        
        Moon.momentum.addInPlace(  gravity_force.scale(delta_time));
        Earth.momentum.addInPlace( gravity_force.scale(-delta_time) );
        Moon.position.addInPlace(  Moon.momentum.scale(delta_time / Moon.masse));
        Earth.position.addInPlace( Earth.momentum.scale(delta_time / Earth.masse));

        //console.log(Moon.momentum);

    })

    return scene;
}

window.addEventListener("resize", () => {
    engine.resize()
})

function showWorldAxis(size) {
    var makeTextPlane = function(text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
        var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
    return plane;
     };
    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};
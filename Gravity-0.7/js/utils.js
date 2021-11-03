var SOLAR = {

    LEVEL_STATE_UNDEFINED : -1,
    LEVEL_STATE_INTRO : 0,
    LEVEL_STATE_WAIT : 1,
    LEVEL_STATE_GAME : 2,
    LEVEL_STATE_SUCCESS : 3,
    LEVEL_STATE_FAIL : 4,

    LEVELS_NUMBER : 4,

    DISC_DIST : 1, // distance par rapport aux bords à partir de laquelle les disc apparaissent

    theXRHelper : null,
    theHeight : 0,
    theScene : null,
    theMenuPlane : null,
    theExplanationPlane : null,
    theExplanationPlaneText : null,
    theRightMotionController : null,
    theLeftMotionController : null,
    theTimerPlane : null,
    theTimerPlaneText : null,
    theCubePlayground : null,
    theCurrentLevel : null,
    theFailPlane : null,
    theFailPlaneText : null,
    theSuccessPlane : null,
    theSuccessPlaneText : null,

    xMin : -2, 
    xMax : 2,
    zMin : 0.05, 
    zMax : 5,

    // SOLAR.yMin et SOLAR.yMax sont déterminés par la position du casque
    yMin : -1, 
    yMax : -1,
    yRange : 4,

    LEVEL_CHANGE_FLAG : {
        UNDEFINED : -1,
        NO_CHANGE : 0,
        MENU : 1,
        NEXT_LEVEL : 2,
        GOTO_LEVEL : 3,
    },

    GAME_STATE_WAINTING_WEBXR : -1,
    
    currentLevel : null,
    levels : null,
    targetLevelID : 0,
}

SOLAR.currentLevelID = SOLAR.GAME_STATE_WAINTING_WEBXR;
SOLAR.levelChange = SOLAR.LEVEL_CHANGE_FLAG.UNDEFINED;


SOLAR.createMenuPlane = function (){
    var menuPlane = BABYLON.Mesh.CreatePlane("menu", 1, theScene);
    menuPlane.position = new BABYLON.Vector3(0, SOLAR.theHeight, 2);        
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(menuPlane);
    advancedTexture.idealHeight = 1600;
    var menuStackPanel = new BABYLON.GUI.StackPanel();
    advancedTexture.addControl(menuStackPanel); 
    menuStackPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

    var header = new BABYLON.GUI.TextBlock();
    header.text = "Start Menu";
    header.textWrapping= true;
    header.width = "1200px";
    header.height = "500px";
    header.color = "white";
    header.fontFamily = 'Righteous';
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = 200;
    menuStackPanel.addControl(header);
   
    var buttonPanel = new BABYLON.GUI.StackPanel();  
      
    buttonPanel.isVertical = false;
    //buttonPanel.width = "450px";
    buttonPanel.height = "200px";
    buttonPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    menuStackPanel.addControl(buttonPanel);  

    for (let i = 1; i <= SOLAR.LEVELS_NUMBER; i++) {

        var button = BABYLON.GUI.Button.CreateSimpleButton("L"+i, i);
        button.width = "200px";
        button.height = "200px";
        button.color = "yellow";
        button.thickness = 8;
        button.fontSize = 100;
        button.background = "green";
        button.paddingTop = "10px";
        button.cornerRadius = 50;
        button.paddingRight = "10px";
        button.fontFamily = 'Righteous';
        
        button.onPointerUpObservable.add(function() {
            SOLAR.levelChange = SOLAR.LEVEL_CHANGE_FLAG.GOTO_LEVEL;
            SOLAR.targetLevelID = i;
        });
        buttonPanel.addControl(button);
    }
    SOLAR.theMenuPlane = menuPlane;
    SOLAR.theMenuPlane.setEnabled(false);
    //return explanationPlane;
}

SOLAR.createCubePlayground = function (){

    console.log("theHeight : " + SOLAR.theHeight);

    //SOLAR.yMax = theHeight + 0.2;
    SOLAR.yMin = -0.5;
    SOLAR.yMax = SOLAR.yMin + SOLAR.yRange;


    var cubePoints = [
        new BABYLON.Vector3(SOLAR.xMin, SOLAR.yMin, SOLAR.zMin),
        new BABYLON.Vector3(SOLAR.xMin, SOLAR.yMax, SOLAR.zMin),
        new BABYLON.Vector3(SOLAR.xMax, SOLAR.yMax, SOLAR.zMin),
        new BABYLON.Vector3(SOLAR.xMax, SOLAR.yMin, SOLAR.zMin),
        new BABYLON.Vector3(SOLAR.xMin, SOLAR.yMin, SOLAR.zMin),
        new BABYLON.Vector3(SOLAR.xMin, SOLAR.yMin, SOLAR.zMax),
        new BABYLON.Vector3(SOLAR.xMax,SOLAR.yMin, SOLAR.zMax),
        new BABYLON.Vector3(SOLAR.xMax,SOLAR.yMin, SOLAR.zMin),
        new BABYLON.Vector3(SOLAR.xMax,SOLAR.yMax, SOLAR.zMin),
        new BABYLON.Vector3(SOLAR.xMax,SOLAR.yMax, SOLAR.zMax),
        new BABYLON.Vector3(SOLAR.xMin,SOLAR.yMax, SOLAR.zMax),
        new BABYLON.Vector3(SOLAR.xMin,SOLAR.yMax, SOLAR.zMin),
        new BABYLON.Vector3(SOLAR.xMin,SOLAR.yMax, SOLAR.zMax),
        new BABYLON.Vector3(SOLAR.xMin,SOLAR.yMin, SOLAR.zMax),
        new BABYLON.Vector3(SOLAR.xMax,SOLAR.yMin, SOLAR.zMax),
        new BABYLON.Vector3(SOLAR.xMax,SOLAR.yMax, SOLAR.zMax),
    ]

    SOLAR.theCubePlayground = BABYLON.MeshBuilder.CreateLines("lines", {points: cubePoints});
    SOLAR.theCubePlayground.setEnabled(false);
}

SOLAR.newRetryButton = function (){
    var button = BABYLON.GUI.Button.CreateSimpleButton("clickMeButton", "Retry");
        button.width = "400px";
        button.height = "200px";
        button.color = "yellow";
        button.thickness = 8;
        button.fontSize = 100;
        button.background = "green";
        button.paddingTop = "10px";
        button.cornerRadius = 50;
        button.paddingRight = "20px";
        button.fontFamily = 'Righteous';

    button.onPointerUpObservable.add(function() {
        SOLAR.theCurrentLevel.stateChange = true;
        SOLAR.theCurrentLevel.nextState = SOLAR.LEVEL_STATE_WAIT;
    });

    return button;
}

SOLAR.newMenuButton = function (){
    var button = BABYLON.GUI.Button.CreateSimpleButton("clickMeButton", "Menu");
    button.width = "400px";
    button.height = "200px";
    button.color = "yellow";
    button.thickness = 8;
    button.fontSize = 100;
    button.background = "green";
    button.paddingTop = "10px";
    button.cornerRadius = 50;
    button.paddingRight = "20px";
    button.fontFamily = 'Righteous';

    button.onPointerUpObservable.add(function() {
        SOLAR.levelChange = SOLAR.LEVEL_CHANGE_FLAG.MENU;
    });

    return button;
}

SOLAR.newNextLevelButton = function (){
    button = BABYLON.GUI.Button.CreateSimpleButton("clickMeButton", "Next");
    button.width = "400px";
    button.height = "200px";
    button.color = "yellow";
    button.thickness = 8;
    button.fontSize = 100;
    button.background = "green";
    button.paddingTop = "10px";
    button.cornerRadius = 50;
    button.paddingRight = "20px";
    button.fontFamily = 'Righteous';

    button.onPointerUpObservable.add(function() {
        SOLAR.levelChange = SOLAR.LEVEL_CHANGE_FLAG.NEXT_LEVEL;
    });

    return button;
}

SOLAR.createFailPlane = function (){
    var failPlane = BABYLON.Mesh.CreatePlane("plane", 2, theScene);
    failPlane.position.z = SOLAR.zMax;
    failPlane.position.y = SOLAR.theHeight;
    
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(failPlane);
    advancedTexture.idealHeight = 2000;
    advancedTexture.idealWidth = 2000;
    
    var failPanel = new BABYLON.GUI.StackPanel();
    failPanel.isVertical = true; 
    failPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    advancedTexture.addControl(failPanel);  
    var header = new BABYLON.GUI.TextBlock();
    header.text = "Too bad !!!";
    header.textWrapping= true;
    header.height = "500px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = 200;

    failPanel.addControl(header);
    SOLAR.theFailPlaneText = header;

    var buttonPanel = new BABYLON.GUI.StackPanel();  
    buttonPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    buttonPanel.isVertical = false;
    buttonPanel.height = "500px";

    buttonPanel.addControl(SOLAR.newRetryButton());
    buttonPanel.addControl(SOLAR.newMenuButton());
    failPanel.addControl(buttonPanel);  

    SOLAR.theFailPlane = failPlane;
    SOLAR.theFailPlane.setEnabled(false);
}

SOLAR.createSuccessPlane = function (){
    var successPlane = BABYLON.Mesh.CreatePlane("plane", 2, theScene);
    successPlane.position.z = SOLAR.zMax;
    successPlane.position.y = SOLAR.theHeight;
    
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(successPlane);
    advancedTexture.idealHeight = 2000;
    advancedTexture.idealWidth = 2000;
    
    var successPanel = new BABYLON.GUI.StackPanel();
    successPanel.isVertical = true; 
    successPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    advancedTexture.addControl(successPanel);  
    var header = new BABYLON.GUI.TextBlock();
    header.text = "You did it !!!";
    header.textWrapping= true;
    header.height = "500px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = 200;

    successPanel.addControl(header);
    SOLAR.theSuccessPlaneText = header;

    var buttonPanel = new BABYLON.GUI.StackPanel();  
    buttonPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    buttonPanel.isVertical = false;
    buttonPanel.height = "500px";

    buttonPanel.addControl(SOLAR.newRetryButton());
    if(SOLAR.currentLevelID < SOLAR.LEVELS_NUMBER) {
        buttonPanel.addControl(SOLAR.newNextLevelButton());
    }
    buttonPanel.addControl(SOLAR.newMenuButton());
    
    successPanel.addControl(buttonPanel);  

    SOLAR.theSuccessPlane = successPlane;
    successPlane.setEnabled(false);
}

SOLAR.createExplanationPlane = function (){
        var explanationPlane = BABYLON.Mesh.CreatePlane("plane", 1, theScene);
        explanationPlane.position = new BABYLON.Vector3(0, 1.5, 2);        
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(explanationPlane);
        var explanationPanel = new BABYLON.GUI.StackPanel();    
        advancedTexture.addControl(explanationPanel);  
        var header = new BABYLON.GUI.TextBlock();
        header.text = "<Level explanation text>";
        header.textWrapping= true;
        header.width = "1000px";
        header.height = "500px";
        header.fontFamily = 'Righteous';
        header.color = "white";
        header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        header.fontSize = "50"
        explanationPanel.addControl(header);
        SOLAR.theExplanationPlaneText = header;

        var button = BABYLON.GUI.Button.CreateSimpleButton("clickMeButton", "Start");
        button.width = "400px";
        button.height = "200px";
        button.color = "yellow";
        button.thickness = 8;
        button.fontSize = 100;
        button.background = "green";
        button.paddingTop = "10px";
        button.cornerRadius = 50;
        button.paddingRight = "20px";
        button.fontFamily = 'Righteous';
        
        button.onPointerUpObservable.add(function() {
            // if (xr) { xr.displayLaserPointer = !xr.displayLaserPointer; }
            // button.children[0].text = "C'est parti !!!";
            SOLAR.theCurrentLevel.nextState = SOLAR.LEVEL_STATE_WAIT;
            SOLAR.theCurrentLevel.stateChange = true;
        });
        explanationPanel.addControl(button);
        SOLAR.theExplanationPlane = explanationPlane;
        SOLAR.theExplanationPlane.setEnabled(false);
}

SOLAR.hideControllers = function (){
    var p = SOLAR.theRightMotionController.rootMesh;
    p.visibility = false; 
    for (var i = 0; i < p.getChildMeshes(false).length; i++){			
        p.getChildMeshes(false)[i].visibility = false; 
    }
    var p = SOLAR.theLeftMotionController.rootMesh;
    p.visibility = false; 
    for (var i = 0; i < p.getChildMeshes(false).length; i++){			
        p.getChildMeshes(false)[i].visibility = false; 
    }

    theXRHelper.pointerSelection.displayLaserPointer = false;
    theXRHelper.pointerSelection.disablePointerLighting = false;
    theXRHelper.pointerSelection.displaySelectionMesh = false;
}

SOLAR.showControllers = function (){
    var p = SOLAR.theRightMotionController.rootMesh;
    p.visibility = true; 
    for (var i = 0; i < p.getChildMeshes(false).length; i++){			
        p.getChildMeshes(false)[i].visibility = true; 
    }
    var p = SOLAR.theLeftMotionController.rootMesh;
    p.visibility = true; 
    for (var i = 0; i < p.getChildMeshes(false).length; i++){			
        p.getChildMeshes(false)[i].visibility = true; 
    }

    theXRHelper.pointerSelection.displayLaserPointer = true;
    theXRHelper.pointerSelection.disablePointerLighting = true;
    theXRHelper.pointerSelection.displaySelectionMesh = true;
}

SOLAR.createTimerPlane = function (){
    SOLAR.theTimerPlane = BABYLON.Mesh.CreatePlane("plane", 1, theScene);
    SOLAR.theTimerPlane.position = new BABYLON.Vector3(0, 1.5, SOLAR.zMax);        
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(SOLAR.theTimerPlane);
    var panel = new BABYLON.GUI.StackPanel();    
    advancedTexture.addControl(panel);  
    SOLAR.theTimerPlaneText = new BABYLON.GUI.TextBlock();
    
    SOLAR.theTimerPlaneText.text = String("toto");
    SOLAR.theTimerPlaneText.height = "300px";
    SOLAR.theTimerPlaneText.color = "white";
    SOLAR.theTimerPlaneText.fontFamily = 'Righteous';
    SOLAR.theTimerPlaneText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    SOLAR.theTimerPlaneText.fontSize = 300;
    panel.addControl(SOLAR.theTimerPlaneText);

    SOLAR.theTimerPlane.setEnabled(false);
}

SOLAR.arrowTransform = function (VMomentum, VCenter, VATransformer){

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

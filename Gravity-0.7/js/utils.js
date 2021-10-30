

function createMenuPlane(){
    var menuPlane = BABYLON.Mesh.CreatePlane("menu", 1, theScene);
    menuPlane.position = new BABYLON.Vector3(0, 2, 1);        
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(menuPlane);
    advancedTexture.idealHeight = 1600;
    var menuStackPanel = new BABYLON.GUI.StackPanel();
    advancedTexture.addControl(menuStackPanel); 
    menuStackPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

    

    var header = new BABYLON.GUI.TextBlock();
    header.text = "Start Menu";
    header.textWrapping= true;
    header.width = "1000px";
    header.height = "500px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = "200"
    menuStackPanel.addControl(header);
   
    var buttonPanel = new BABYLON.GUI.StackPanel();  
      
    buttonPanel.isVertical = false;
    //buttonPanel.width = "450px";
    buttonPanel.height = "200px";
    buttonPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    menuStackPanel.addControl(buttonPanel);  

    for (let i = 1; i <= LEVELS_NUMBER; i++) {

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
        
        button.onPointerUpObservable.add(function() {
            levelChange = LEVEL_CHANGE_FLAG.GOTO_LEVEL;
            targetLevelID = i;
        });
        buttonPanel.addControl(button);
    }
    theMenuPlane = menuPlane;
    theMenuPlane.setEnabled(false);
    //return explanationPlane;
}

function createCubePlayground(){


    console.log("theHeight : " + theHeight);

    //yMax = theHeight + 0.2;
    yMin = -0.5;
    yMax = yMin + yRange;


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
        button.width = "400px";
        button.height = "200px";
        button.color = "yellow";
        button.thickness = 8;
        button.fontSize = 100;
        button.background = "green";
        button.paddingTop = "10px";
        button.cornerRadius = 50;
        button.paddingRight = "20px";

    button.onPointerUpObservable.add(function() {
        theCurrentLevel.stateChange = true;
        theCurrentLevel.nextState = LEVEL_STATE_WAIT;
    });

    return button;
}

function newMenuButton(){
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

    button.onPointerUpObservable.add(function() {
        levelChange = LEVEL_CHANGE_FLAG.MENU;
    });

    return button;
}

function newNextLevelButton(){
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

    button.onPointerUpObservable.add(function() {
        levelChange = LEVEL_CHANGE_FLAG.NEXT_LEVEL;
    });

    return button;
}

function createFailPlane(){
    var failPlane = BABYLON.Mesh.CreatePlane("plane", 1, theScene);
    failPlane.position = new BABYLON.Vector3(0, 1.5, zMax);        
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(failPlane);
    advancedTexture.idealHeight = 1600;
    var failPanel = new BABYLON.GUI.StackPanel();
    failPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(failPanel);  
    var header = new BABYLON.GUI.TextBlock();
    header.text = "You Loose !!!";
    header.textWrapping= true;
    header.width = "1000px";
    header.height = "500px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = "50";
    header.background = "cyan";

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
    successPlane.position.z = zMax;
    successPlane.position.y = 2;
    
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(successPlane);
    //advancedTexture.idealHeight = 2000;
    //advancedTexture.idealWidth = 2000;
    //advancedTexture.background = "green";  
    
    var successPanel = new BABYLON.GUI.StackPanel();
    successPanel.isVertical = true; 
    successPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    //successPanel.background = "red"; 

    advancedTexture.addControl(successPanel);  
    var header = new BABYLON.GUI.TextBlock();
    header.text = "You Won !!!";
    header.textWrapping= true;
    header.width = "1000px";
    header.height = "500px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = "100";
    //header.background = "cyan";

    successPanel.addControl(header);
    theSuccessPlaneText = header;

    var buttonPanel = new BABYLON.GUI.StackPanel();  
    buttonPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    //buttonPanel.background = "pink";
    buttonPanel.isVertical = false;
    //buttonPanel.width = "2000px";
    buttonPanel.height = "500px";


    buttonPanel.addControl(newRetryButton());
    if(currentLevelID < LEVELS_NUMBER) {
        buttonPanel.addControl(newNextLevelButton());
    }
    buttonPanel.addControl(newMenuButton());
    
    successPanel.addControl(buttonPanel);  

    theSuccessPlane = successPlane;
    successPlane.setEnabled(false);
}

function createExplanationPlane(){
        var explanationPlane = BABYLON.Mesh.CreatePlane("plane", 1, theScene);
        explanationPlane.position = new BABYLON.Vector3(0, 1.5, 2);        
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(explanationPlane);
        var explanationPanel = new BABYLON.GUI.StackPanel();    
        advancedTexture.addControl(explanationPanel);  
        var header = new BABYLON.GUI.TextBlock();
        header.text = "YES !!!";
        header.textWrapping= true;
        header.width = "1000px";
        header.height = "500px";
        header.color = "white";
        header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        header.fontSize = "50"
        explanationPanel.addControl(header);
        theExplanationPlaneText = header;

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
    theTimerPlane.position = new BABYLON.Vector3(0, 1.5, zMax);        
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(theTimerPlane);
    var panel = new BABYLON.GUI.StackPanel();    
    advancedTexture.addControl(panel);  
    theTimerPlaneText = new BABYLON.GUI.TextBlock();
    
    theTimerPlaneText.text = String("toto");
    theTimerPlaneText.height = "100px";
    theTimerPlaneText.color = "white";
    theTimerPlaneText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    theTimerPlaneText.fontSize = 200;
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

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
    theNextButton : null,
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

    // liste des disques qui signalent le rapprochement d'une paroi
    discs : []
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
    header.text = "Babylon Sun";
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

    buttonPanel = new BABYLON.GUI.StackPanel();  
    buttonPanel.isVertical = false;
    buttonPanel.height = "400px";
    buttonPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    buttonPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    buttonPanel.addControl(SOLAR.newExitButton());

    menuStackPanel.addControl(buttonPanel); 
    

    SOLAR.theMenuPlane = menuPlane;
    SOLAR.theMenuPlane.setEnabled(false);

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

SOLAR.newExitButton = function (){
    var button = BABYLON.GUI.Button.CreateSimpleButton("clickMeButton", "Exit");
    button.width = "400px";
    button.height = "200px";
    button.color = "white";
    button.thickness = 8;
    button.fontSize = 100;
    button.paddingTop = "10px";
    button.cornerRadius = 50;
    button.paddingRight = "20px";
    button.fontFamily = 'Righteous';

    button.onPointerUpObservable.add(function() {
        //SOLAR.theXRHelper.baseExperience.exitXRAsync();
        location.reload();
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
    buttonPanel.addControl(SOLAR.newExitButton());
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
    header.height = "1200px";
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
        SOLAR.theNextButton = SOLAR.newNextLevelButton();
        buttonPanel.addControl(SOLAR.theNextButton);
    }
    
    buttonPanel.addControl(SOLAR.newMenuButton());
    buttonPanel.addControl(SOLAR.newExitButton());
    
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

    SOLAR.theXRHelper.pointerSelection.displayLaserPointer = false;
    SOLAR.theXRHelper.pointerSelection.disablePointerLighting = false;
    SOLAR.theXRHelper.pointerSelection.displaySelectionMesh = false;
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

    SOLAR.theXRHelper.pointerSelection.displayLaserPointer = true;
    SOLAR.theXRHelper.pointerSelection.disablePointerLighting = true;
    SOLAR.theXRHelper.pointerSelection.displaySelectionMesh = true;
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

SOLAR.showExitPoint = function (planet)
{
    var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : 0.25});
    d.material = new BABYLON.StandardMaterial("mat", theScene);
    d.material.ambiantColor = new BABYLON.Color3(1,0,0);
    d.material.diffuseColor = new BABYLON.Color3(1,0,0);
    d.material.specularColor = new BABYLON.Color3(1,0,0);
    
    d.position.x = planet.mesh.position.x;
    d.position.y = planet.mesh.position.y;
    d.position.z = planet.mesh.position.z;

    if(planet.mesh.position.x < SOLAR.xMin) {
        d.rotation = new BABYLON.Vector3(0,-Math.PI / 2,0);
        d.position.x = SOLAR.xMin;
        planet.mesh.position.x = SOLAR.xMin;
    } else if(planet.mesh.position.x > SOLAR.xMax) {
        d.rotation = new BABYLON.Vector3(0,Math.PI / 2,0);
        d.position.x = SOLAR.xMax;
        planet.mesh.position.x = SOLAR.xMax;
    } else if(planet.mesh.position.y < SOLAR.yMin) {
        d.rotation = new BABYLON.Vector3(-Math.PI / 2,0,0);
        d.position.y = SOLAR.yMin;
        planet.mesh.position.y = SOLAR.yMin;
    } else if(planet.mesh.position.y > SOLAR.yMax) {
        d.rotation = new BABYLON.Vector3(Math.PI / 2,0,0);
        d.position.y = SOLAR.yMax;
        planet.mesh.position.y = SOLAR.yMax;
    } else if(planet.mesh.position.z > SOLAR.zMax) {
        d.position.z = SOLAR.zMax;
        planet.mesh.position.z = SOLAR.yMax;
    }  else if(planet.mesh.position.z < SOLAR.zMin) {
        d.position.z = SOLAR.zMin;
    } 

    SOLAR.discs.push(d);   
}

SOLAR.drawFrontCircle = function(planet) { 
    var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.mesh.position.z - SOLAR.zMax)/2});
    
    d.position.x = planet.mesh.position.x;
    d.position.y = planet.mesh.position.y;
    d.position.z = SOLAR.zMax;
    d.visibility = Math.pow((SOLAR.DISC_DIST - Math.abs(planet.mesh.position.z - SOLAR.zMax))/SOLAR.DISC_DIST,2) ;
    SOLAR.discs.push(d);
}

SOLAR.drawTopCircle = function(planet)  {
    var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.mesh.position.y - SOLAR.yMax)/2});
    
    d.rotation = new BABYLON.Vector3(-Math.PI / 2,0,0);
    d.position.x = planet.mesh.position.x;
    d.position.y = SOLAR.yMax;
    d.position.z = planet.mesh.position.z;
    d.visibility = Math.pow((SOLAR.DISC_DIST - Math.abs(planet.mesh.position.y - SOLAR.yMax))/SOLAR.DISC_DIST,2) ;
    SOLAR.discs.push(d);
}

SOLAR.drawBottomCircle = function(planet){
    var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.mesh.position.y - SOLAR.yMin)/2});
    
    d.rotation = new BABYLON.Vector3(Math.PI / 2,0,0);
    d.position.x = planet.mesh.position.x;
    d.position.y = SOLAR.yMin;
    d.position.z = planet.mesh.position.z;
    d.visibility = Math.pow((SOLAR.DISC_DIST - Math.abs(planet.mesh.position.y - SOLAR.yMin))/SOLAR.DISC_DIST,2) ;
    SOLAR.discs.push(d);
}

SOLAR.drawLeftCircle = function(planet){
    var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.mesh.position.x - SOLAR.xMin)/2});
    
    d.rotation = new BABYLON.Vector3(0,-Math.PI / 2,0);
    d.position.x = SOLAR.xMin;
    d.position.y = planet.mesh.position.y;
    d.position.z = planet.mesh.position.z;
    d.visibility = Math.pow((SOLAR.DISC_DIST - Math.abs(planet.mesh.position.x - SOLAR.xMin))/SOLAR.DISC_DIST,2) ;
    SOLAR.discs.push(d);
}

SOLAR.drawRightCircle = function(planet){
    var d = BABYLON.MeshBuilder.CreateDisc("disc", {radius : Math.abs(planet.mesh.position.x - SOLAR.xMax)/2});
    
    d.rotation = new BABYLON.Vector3(0,Math.PI / 2,0);
    d.position.x = SOLAR.xMax;
    d.position.y = planet.mesh.position.y;
    d.position.z = planet.mesh.position.z;
    d.visibility = Math.pow((SOLAR.DISC_DIST - Math.abs(planet.mesh.position.x - SOLAR.xMax))/SOLAR.DISC_DIST,2) ;
    SOLAR.discs.push(d);
}

SOLAR.cleanDiscs = function(){
    var d;
    while(SOLAR.discs.length > 0){
        d = SOLAR.discs.pop();
        d.dispose();
    }
}

SOLAR.manageDiscs = function(planet)
{
    var x = planet.mesh.position.x;
    var y = planet.mesh.position.y;
    var z = planet.mesh.position.z;

    if(((x-SOLAR.xMin)<SOLAR.DISC_DIST)&&((x-SOLAR.xMin)>0)&&(z>SOLAR.zMin)&&(z<SOLAR.zMax)&&(y>SOLAR.yMin)&&(y<SOLAR.yMax)) {
        this.drawLeftCircle(planet);
    }
    if(((SOLAR.xMax-x)<SOLAR.DISC_DIST)&&((SOLAR.xMax-x)>0)&&(z>SOLAR.zMin)&&(z<SOLAR.zMax)&&(y>SOLAR.yMin)&&(y<SOLAR.yMax)) {
        this.drawRightCircle(planet);
    }
    if(((SOLAR.yMax-y)<SOLAR.DISC_DIST)&&((SOLAR.yMax-y)>0)&&(z>SOLAR.zMin)&&(z<SOLAR.zMax)&&(x>SOLAR.xMin)&&(x<SOLAR.xMax)) {
        this.drawTopCircle(planet);
    }
    if(((y-SOLAR.yMin)<SOLAR.DISC_DIST)&&((y-SOLAR.yMin)>0)&&(z>SOLAR.zMin)&&(z<SOLAR.zMax)&&(x>SOLAR.xMin)&&(x<SOLAR.xMax)) {
        this.drawBottomCircle(planet);
    }
    if(((SOLAR.zMax-z)<SOLAR.DISC_DIST)&&((SOLAR.zMax-z)>0)&&(x>SOLAR.xMin)&&(x<SOLAR.xMax)&&(y>SOLAR.yMin)&&(y<SOLAR.yMax)) {
        this.drawFrontCircle(planet);
    }
}


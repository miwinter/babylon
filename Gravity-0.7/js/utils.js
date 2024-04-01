var SOLAR = {

    LEVEL_STATE_UNDEFINED : -1,
    LEVEL_STATE_INTRO : 0,
    LEVEL_STATE_WAIT : 1,
    LEVEL_STATE_GAME : 2,
    LEVEL_STATE_SUCCESS : 3,
    LEVEL_STATE_HIGHSCORE : 4,
    LEVEL_STATE_FAIL : 5,

    LEVELS_NUMBER : 6,

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
    theNewHighScorePlane : null,

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
    currentScore : 0,

    // liste des disques qui signalent le rapprochement d'une paroi
    discs : [],

    highScoreTableInformation : null,
    highScoreTableContainer : null,

    // sounds section
    intro_sound : null,
    level_sound : null,
    fail_sound : null,
    win_sound : null
}

SOLAR.currentLevelID = SOLAR.GAME_STATE_WAINTING_WEBXR;
SOLAR.levelChange = SOLAR.LEVEL_CHANGE_FLAG.UNDEFINED;

SOLAR.initSound = function (){

    var music = new BABYLON.Sound("music", "sounds/intro.mp3",
    theScene, function() {music.setVolume(0,0);music.play();music.setVolume(0.2,20);}, {
    loop: true, autoplay: false
    });
    SOLAR.intro_sound = music;

    SOLAR.level_sound = new BABYLON.Sound("music", "sounds/level.mp3",
    theScene, null, {
    loop: false, autoplay: false
    });

    SOLAR.win_sound = new BABYLON.Sound("music", "sounds/won.mp3",
    theScene, null, {
    loop: false, autoplay: false
    });

    SOLAR.fail_sound = new BABYLON.Sound("music", "sounds/fail.mp3",
    theScene, null, {
    loop: false, autoplay: false
    });
}

SOLAR.startLevelSound = function (){
    SOLAR.level_sound.setVolume(0,0);
    SOLAR.level_sound.play();
    SOLAR.level_sound.setVolume(0.4,5);

    SOLAR.intro_sound.setVolume(0.1,3);
}

SOLAR.playWinSound = function (){
    SOLAR.win_sound.play();
    SOLAR.intro_sound.setVolume(0.2,5);
    SOLAR.level_sound.stop();
}

SOLAR.playFailSound = function (){
    SOLAR.fail_sound.play();
    SOLAR.intro_sound.setVolume(0.2,5);
    SOLAR.level_sound.stop();
}




SOLAR.isHighScore = function (score){
    if(SOLAR.highScoreTableInformation == null)
    {
        return true;
    }
    else{
        return SOLAR.highScoreTableInformation[10]['score'] < score;
    }
}

SOLAR.getHighScore = async (level) => {
    SOLAR.highScoreTableInformation = null;
  
    const response = await fetch('server/high-scores.php?level='+level, {
       
       // Adding method type
       method: "GET",
       
       // Adding headers to the request
       headers: {
           "Content-type": "application/json; charset=UTF-8"
       }
      });
  
    console.log(response);
    SOLAR.highScoreTableInformation = await response.json(); //extract JSON from the http response
    console.log(SOLAR.highScoreTableInformation);
    // do something with myJson
}

SOLAR.setHighScoreTable = function (newScore,newName) {

    if(SOLAR.highScoreTableInformation != null)
    {
        var current_rank = 9;

        while((SOLAR.highScoreTableInformation[current_rank+1]['score'] < newScore) && (current_rank >= 1))
        {
            SOLAR.highScoreTableInformation[current_rank+1]['score'] = SOLAR.highScoreTableInformation[current_rank]['score'];
            SOLAR.highScoreTableInformation[current_rank+1]['name'] = SOLAR.highScoreTableInformation[current_rank]['name'];
            current_rank -= 1;
        }
    
        SOLAR.highScoreTableInformation[current_rank+1]['score'] = newScore;
        SOLAR.highScoreTableInformation[current_rank+1]['name'] = newName;
    }
}

SOLAR.setHighScore = async (level,newScore,newName) => {

    newHighScoreTable = null;
    console.log("in setHighScore:" + level + ":" + newScore + ":" + newName);
  
    const response = await fetch('server/high-scores.php', {
       
       // Adding method type
       method: "POST",
        
       // Adding body or contents to send
       body: JSON.stringify({
           level: level,
           new_score: newScore,
           name:newName
       }),
        
       // Adding headers to the request
       headers: {
           "Content-type": "application/json; charset=UTF-8"
       }
      });
  
    console.log(response);
    SOLAR.highScoreTableInformation = await response.json(); //extract JSON from the http response
    console.log(newHighScoreTable);
    // do something with myJson
}
  
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
        SOLAR.theXRHelper.baseExperience.exitXRAsync();
        location.reload();
    });

    return button;
}

SOLAR.createFailPlane = function (){
    var failPlane = BABYLON.Mesh.CreatePlane("plane", 1, theScene);
    failPlane.position.z = 2;
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

SOLAR.fillHighScore = function (){
    if(SOLAR.highScoreTableInformation == null)
    {
        for(let i = 1; i<11; i++){
            SOLAR.highScoreTableContainer[i]['score'].text = "-----";
            SOLAR.highScoreTableContainer[i]['name'].text = "-----";
        }
    }
    else {
        for(let i = 1; i<11; i++){
            SOLAR.highScoreTableContainer[i]['score'].text = 
             String((SOLAR.highScoreTableInformation[i]['score']).toLocaleString('fr-FR'));
                
            SOLAR.highScoreTableContainer[i]['name'].text = SOLAR.highScoreTableInformation[i]['name'];
        }
    }
}

SOLAR.newHighScoreLine = function (i){
    SOLAR.highScoreTableContainer[i] = [];
    var linePanel = new BABYLON.GUI.StackPanel();  
    linePanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    linePanel.isVertical = false;
    linePanel.height = "120px";

    var textLine = new BABYLON.GUI.TextBlock();
    textLine.fontFamily = 'Cousine';
    textLine.text = String(i+".");
    textLine.width = "440px";
    textLine.color = "white";
    textLine.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    textLine.fontSize = 120;
    linePanel.addControl(textLine);  

    textLine = new BABYLON.GUI.TextBlock();
    textLine.fontFamily = 'Cousine';
    textLine.text = '---'; //SOLAR.highScoreTable[i]['score'];
    textLine.width = "700px";
    textLine.color = "white";
    textLine.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    textLine.fontSize = 120;
    SOLAR.highScoreTableContainer[i]['score'] = textLine;
    linePanel.addControl(textLine);  

    textLine = new BABYLON.GUI.TextBlock();
    textLine.fontFamily = 'Cousine';
    textLine.text = '--------'; //SOLAR.highScoreTable[i]['name'];
    textLine.width = "600px";
    textLine.color = "white";
    textLine.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    textLine.fontSize = 110;
    SOLAR.highScoreTableContainer[i]['name'] = textLine;
    linePanel.addControl(textLine);  

    return linePanel;
}

SOLAR.newVSpacer = function (){
    var textLine = new BABYLON.GUI.TextBlock();
    textLine.height = "100px";
    return textLine;
}

SOLAR.createNewHighScorePlane = function (){

    var newHighScorePlane = BABYLON.MeshBuilder.CreatePlane("leftWall", {width: 3,height: 3}, theScene);
    newHighScorePlane.position.z = 2;
    newHighScorePlane.position.y = SOLAR.theHeight;
       
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(newHighScorePlane);
    advancedTexture.idealHeight = 3000;
    advancedTexture.idealWidth = 2000;
    var newHighScoreStackPanel = new BABYLON.GUI.StackPanel();
    advancedTexture.addControl(newHighScoreStackPanel); 

    var header = new BABYLON.GUI.TextBlock();
    header.text = "You reached a new highscore. ";
    header.fontFamily = 'Righteous';
    header.height = "120px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = 120;
    newHighScoreStackPanel.addControl(header);

    header = new BABYLON.GUI.TextBlock();
    header.text = "Enter your name:";
    header.fontFamily = 'Righteous';
    header.height = "120px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = 120;
    newHighScoreStackPanel.addControl(header);

    newHighScoreStackPanel.addControl(SOLAR.newVSpacer());

    var input = new BABYLON.GUI.TextBlock();
    input.height = "120px";
    input.fontFamily = 'Righteous';
    input.fontSize = 120;
    input.text = "--------";
    input.color = "white";
    input.background = "green";
    newHighScoreStackPanel.addControl(input);    
            
    var keyboard = BABYLON.GUI.VirtualKeyboard.CreateDefaultLayout();

    var lg = 8;
    keyboard.onKeyPressObservable.add(function (key) {
            if(key==="\u21B5")
            {
                while(input.text.charAt(0) == "-") {
                    input.text = input.text.substring(1,input.text.length);
                }
                SOLAR.theCurrentLevel.nextState = SOLAR.LEVEL_STATE_SUCCESS;
                SOLAR.theCurrentLevel.stateChange = true;
                SOLAR.setHighScoreTable(SOLAR.currentScore,input.text);
                SOLAR.setHighScore(SOLAR.currentLevelID,SOLAR.currentScore,input.text);
                input.text = "--------";
                lg = 8;
            }
            else if(key==="\u2190")
            {
                if(lg < 9) {
                    input.text = "-" + input.text.slice(0,7);
                    lg += 1; 
                }
            }
            else {
                if(lg > 0) {
                    input.text = input.text.slice(1,8) + key;
                    lg -= 1; 
                }
            }
        })

    keyboard.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    keyboard.clearControls();
    //keyboard.fontSize = 120;
    //keyboard.scaleX = 2;
    //keyboard.scaleY = 2;
    keyboard.defaultButtonBackground = "#333333";
    keyboard.highlightLineWidth = 5;
    keyboard.addKeysRow(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "\u2190"]);
    keyboard.addKeysRow(["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]);
    keyboard.addKeysRow(["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "\u21B5"]);
    keyboard.addKeysRow(["Z", "X", "C", "V", "B", "N", "M", "_", ".", "/", "-"]);
    keyboard.addKeysRow([" "], [{ width: "200px" }]);
    newHighScoreStackPanel.addControl(keyboard);

    SOLAR.theNewHighScorePlane = newHighScorePlane;
    SOLAR.theNewHighScorePlane.setEnabled(false);
}

SOLAR.createSuccessPlane = function (){
    //var successPlane = BABYLON.Mesh.CreatePlane("plane", 1, theScene);
    SOLAR.highScoreTableContainer = [];

    var successPlane = BABYLON.MeshBuilder.CreatePlane("leftWall", {width: 3,height: 3}, theScene);
    successPlane.position.z = 2;
    successPlane.position.y = SOLAR.theHeight;
    
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(successPlane);
    advancedTexture.idealHeight = 3000;
    advancedTexture.idealWidth = 2000;
    
    var successPanel = new BABYLON.GUI.StackPanel();
    successPanel.isVertical = true; 
    successPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    advancedTexture.addControl(successPanel);  

    successPanel.addControl(SOLAR.newVSpacer());

    var header = new BABYLON.GUI.TextBlock();
    header.text = "High Scores";
    header.fontFamily = 'Righteous';
    header.height = "150px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = 150;
    successPanel.addControl(header);

    successPanel.addControl(SOLAR.newVSpacer());

    var textLine = null;
    for(let i = 1; i<11; i++){
        successPanel.addControl(SOLAR.newHighScoreLine(i));
    }

    successPanel.addControl(SOLAR.newVSpacer());

    var userScore = new BABYLON.GUI.TextBlock();
    userScore.text = "<User Score>";
    userScore.fontFamily = 'Righteous';
    userScore.height = "140px";
    userScore.color = "white";
    userScore.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    userScore.fontSize = 140;
    successPanel.addControl(userScore);
    SOLAR.theSuccessPlaneText = userScore;

    var buttonPanel = new BABYLON.GUI.StackPanel();  
    buttonPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    buttonPanel.isVertical = false;
    buttonPanel.height = "300px";

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
        explanationPanel.isVertical = true;
        //explanationPanel.width = "5000px";  
        //explanationPanel.background = "green"; 
        advancedTexture.addControl(explanationPanel);  
        var header = new BABYLON.GUI.TextBlock();
        header.text = "<Level explanation text>";
        header.textWrapping= true;
        header.width = "1000px";
        header.height = "500px";
        header.fontFamily = 'Righteous';
        header.color = "white";
        header.background = "red";
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


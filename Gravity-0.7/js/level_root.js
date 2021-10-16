
class gameLevel {

    /* décrit dans quelle partie du niveau on est : 
    0 : présentation
    1 : attente de démarrage
    2 : jeu, 
    3 : fin-gagné 
    4 : fin-perdu
    */
    state = LEVEL_STATE_UNDEFINED;

    stateChange = true;
    nextState = LEVEL_STATE_INTRO;

    timer = 0;

    // création des objets spécifiques au niveau
    // cube, panels et sun sont construit au niveau global
    initLevel(){

    }

    // setup et affichage des objets pendant le compte à rebours
    initPlayground(){}

    // effacement des fleches au démarrage de la phase de jeu
    launchGame(){}

    // nettoyage des meshs spécifiques au niveau
    cleanLevel(){
        theFailPlane.setEnabled(false);
        theSuccessPlane.setEnabled(false);
    }

    // configuration du level en fonction de son état (suite à un stateChange)
    initState(state){
        switch(state)
        {
            case LEVEL_STATE_INTRO : 
                console.log("LEVEL_STATE_INTRO");
                theExplanationPlaneText.text = "Let's go !";
                theExplanationPlaneButton.text = "Start";
                theExplanationPlaneTarget = LEVEL_STATE_WAIT;
                theExplanationPlane.setEnabled(true);
                break;
            case LEVEL_STATE_WAIT :
                console.log("LEVEL_STATE_WAIT");
                theHLight.intensity = 0.5;
                theFailPlane.setEnabled(false);
                theSuccessPlane.setEnabled(false);
                theExplanationPlane.setEnabled(false);
                hideControllers();
                theTimerPlane.setEnabled(true);
                theCubePlayground.setEnabled(true);
                this.initPlayground();
                this.timer = Date.now();
                break;
            case LEVEL_STATE_GAME :
                console.log("LEVEL_STATE_GAME");
                theExplanationPlaneTarget = LEVEL_STATE_WAIT;
                theExplanationPlane.setEnabled(false);
                theTimerPlane.setEnabled(true);
                this.launchGame();
                this.timer = Date.now();
                break;
            case LEVEL_STATE_SUCCESS : 
                console.log("LEVEL_STATE_SUCCESS");
                theHLight.intensity = 1;
                theTimerPlane.setEnabled(false);
                showControllers();
                this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition().clone();
                theHLight.position = this.sun.position;
                theSuccessPlane.setEnabled(true);
                break;
            case LEVEL_STATE_FAIL : 
                console.log("LEVEL_STATE_FAIL");
                theHLight.intensity = 1;
                theTimerPlane.setEnabled(false);
                this.sun.position = theRightMotionController.rootMesh.getAbsolutePosition().clone();
                theHLight.position = this.sun.position;
                showControllers();
                theFailPlaneText = "You failed !";
                theFailPlane.setEnabled(true);
                break;
        }
    }


    levelRenderLoop() {
        if(this.stateChange)
        {
            //console.log(this.nextState);
            this.initState(this.nextState);
            this.state = this.nextState;
            this.nextState = LEVEL_STATE_UNDEFINED;
            this.stateChange = false;
        }

        switch(this.state)
        {
            case LEVEL_STATE_WAIT : 
                this.timerLoop();
                break;
            case LEVEL_STATE_GAME :
                this.gameLoop();
                break;
        }

    }

    // loop utilisée uniquement lors du compte à rebours
    timerLoop(){
        var s = Math.ceil(5 - (Date.now() - this.timer)/1000);
        if(s == 0){
            this.stateChange = true;
            this.nextState = LEVEL_STATE_GAME;
        }
        else {
            theTimerPlaneText.text = String(s);
            this.timer += 1;
        }
    }

    // loop utilisée pour la phase de jeu
    gameLoop(){}

} // end class gameLevel


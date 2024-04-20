var SOLAR = SOLAR || {};

class gameLevel {

    /* décrit dans quelle partie du niveau on est : 
    0 : présentation
    1 : attente de démarrage
    2 : jeu, 
    3 : fin-gagné 
    4 : fin-perdu
    */
    state = SOLAR.LEVEL_STATE_UNDEFINED;

    dist_vector = [];
    gravity_force = [];
    planets = [];

    stateChange = true;
    nextState = SOLAR.LEVEL_STATE_INTRO;

    timer = 0;
    delta_time = 0.1;
    G = 0.00001;
    levelDuration = 10;

    // for Score calculation
    sunPosPrec = [];
    score = 0;
    sunSpeedPrec = 0;
    timePrec = 0;

    intro_sound = null;
    level_sound = null;

    // création des objets spécifiques au niveau
    // cube, panels et sun sont construit au niveau global
    initLevel(){
    }

    // fonction qui calcule la position d'une mesh après une rotation autour d'un point
   // qui n'est pas le centre du repère
   rotateVectorAroundPoint(startVector, endVector, rotationVector, pointOfRotation) {
    // Déplacer le système de coordonnées pour que le point de rotation soit l'origine
    var translatedStart = startVector.subtract(pointOfRotation);
    var translatedEnd = endVector.subtract(pointOfRotation);

    // Créer une matrice de rotation à partir du vecteur de rotation
    var rotationMatrix = BABYLON.Matrix.RotationYawPitchRoll(
    rotationVector.y, // Rotation autour de l'axe Y
    rotationVector.x, // Rotation autour de l'axe X
    rotationVector.z  // Rotation autour de l'axe Z
    );

    // Appliquer la rotation aux vecteurs déplacés
    var rotatedTranslatedStart = BABYLON.Vector3.TransformCoordinates(translatedStart, rotationMatrix);
    var rotatedTranslatedEnd = BABYLON.Vector3.TransformCoordinates(translatedEnd, rotationMatrix);

    // Remettre les vecteurs dans le système de coordonnées d'origine
    var rotatedStart = rotatedTranslatedStart.add(pointOfRotation);
    var rotatedEnd = rotatedTranslatedEnd.add(pointOfRotation);

    // Renvoyer les vecteurs de début et de fin après rotation
    return { start: rotatedStart, end: rotatedEnd };
}

    // setup et affichage des objets pendant le compte à rebours
    initPlayground(){
        this.sun.mesh.setEnabled(true);
        this.sunlight.setEnabled(true);

        this.sunlight.position = this.sun.mesh.position;
        this.sun.mesh.material = this.sun.initialMaterial;

        // i=0 -> sun   
        for(let i = 1; i < this.planets.length; i++) {
            this.planets[i].reset();
            // used to know if a planet starts outside the playground
            // false by default
            this.planets[i].alreadyIn = false;
        }

        // il peut rester un ou plusieurs disque de à cause de la sortie d'une planete
        if(SOLAR.discs.length > 0)
            SOLAR.cleanDiscs();
    }

    launchGame(){
        // i=0 -> sun
        for(let i = 1; i < this.planets.length; i++) {
            this.planets[ i ].arrow.setEnabled(false);
        }

        this.timer = Date.now();
        SOLAR.theTimerPlaneText.text = String((this.levelDuration).toLocaleString('en-GB',{ minimumFractionDigits: 1 }));

        // for Score experiment
        this.score = 0;
        this.timePrec = 0;
        this.sunSpeedPrec = 0;
    }

    // nettoyage des meshs spécifiques au niveau
    cleanLevel(){
        SOLAR.theFailPlane.setEnabled(false);
        SOLAR.theSuccessPlane.setEnabled(false);
        SOLAR.theTimerPlane.setEnabled(false);

        this.sunlight.dispose();

        var p;
        while(this.planets.length > 0){
            p = this.planets.pop();
            p.dispose();
        }

        if(SOLAR.discs.length > 0)
            SOLAR.cleanDiscs();

        if(this.level_sound) this.level_sound.stop();
        if(this.intro_sound) this.level_sound.stop();
    }

    // configuration du level en fonction de son état (suite à un stateChange)
    initState(state){
        switch(state)
        {
            case SOLAR.LEVEL_STATE_INTRO : 
                console.log("LEVEL_STATE_INTRO");
                SOLAR.theExplanationPlane.setEnabled(true);
                SOLAR.getHighScore(1);
                break;

            case SOLAR.LEVEL_STATE_WAIT :
                console.log("LEVEL_STATE_WAIT");
                SOLAR.theFailPlane.setEnabled(false);
                SOLAR.theSuccessPlane.setEnabled(false);
                SOLAR.theExplanationPlane.setEnabled(false);
                SOLAR.hideControllers();
                SOLAR.theTimerPlane.setEnabled(true);
                SOLAR.theCubePlayground.setEnabled(true);
                this.initPlayground();
                this.timer = Date.now();
                SOLAR.startLevelSound();
                break;

            case SOLAR.LEVEL_STATE_GAME :
                console.log("LEVEL_STATE_GAME");
                SOLAR.theExplanationPlane.setEnabled(false);
                SOLAR.theTimerPlane.setEnabled(true);
                this.launchGame();
                this.timer = Date.now();
                break;

            case SOLAR.LEVEL_STATE_SUCCESS : 
                console.log("LEVEL_STATE_SUCCESS");
                if(SOLAR.theNewHighScorePlane.isEnabled())
                {
                    SOLAR.theNewHighScorePlane.setEnabled(false);
                }
                else {
                    SOLAR.theTimerPlane.setEnabled(false);
                    SOLAR.showControllers();
                    SOLAR.playWinSound();                    
                }                
                if(SOLAR.currentLevelID  < SOLAR.LEVELS_NUMBER)
                    SOLAR.theNextButton.isEnabled = true;
                else
                    SOLAR.theNextButton.isEnabled = false;

                SOLAR.fillHighScore();
                SOLAR.theSuccessPlane.setEnabled(true);
                break;

            case SOLAR.LEVEL_STATE_HIGHSCORE :
                console.log("LEVEL_STATE_HIGHSCORE");
                SOLAR.theTimerPlane.setEnabled(false);
                SOLAR.theNewHighScorePlane.setEnabled(true);
                SOLAR.showControllers();
                SOLAR.playWinSound();
                break;

            case SOLAR.LEVEL_STATE_FAIL : 
                console.log("LEVEL_STATE_FAIL");
                SOLAR.showControllers();
                SOLAR.theFailPlane.setEnabled(true);
                SOLAR.playFailSound();
                break;
        }
    }


    levelRenderLoop() {
        if(this.stateChange)
        {
            //console.log(this.nextState);
            this.initState(this.nextState);
            this.state = this.nextState;
            this.nextState = SOLAR.LEVEL_STATE_UNDEFINED;
            this.stateChange = false;
        }

        switch(this.state)
        {
            case SOLAR.LEVEL_STATE_WAIT : 
                this.timerLoop();
                break;
            case SOLAR.LEVEL_STATE_GAME :
                this.gameLoop();
                break;
        }

        // nothing done in other states

    }


    initSun(){
        // création de la planete 1
        this.sun = new planet(0.12, // radius
            1000, // mass
            "sun.jpg", // texture file
            new BABYLON.Vector3.Zero(), // initial position
            new BABYLON.Vector3.Zero()); // initial momentum

        // ****************** Juste pour le glow
        // ATTENTION le glow fait s'effondrer le framerate
        /*
        
        var material = new BABYLON.StandardMaterial("material", theScene);
        var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 386, theScene);
        noiseTexture.octaves = 7;
        noiseTexture.persistence = 2;
        noiseTexture.brightness = 0.1;

        noiseTexture.animationSpeedFactor = 1;
        material.emissiveTexture = noiseTexture;
        material.diffusiveColor = new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5);
        material.emissiveColor = new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5);
        this.sun.mesh.material = material;
        this.sun.initialMaterial = material;
            
        var gl = new BABYLON.GlowLayer("glow", theScene);
        gl.intensity = 0.1;
        gl.addIncludedOnlyMesh(this.sun.mesh);
        */
        // ****************** fin du glow
        
        this.sunlight = new BABYLON.PointLight('sunLight', new BABYLON.Vector3.Zero(), theScene);
        this.sunlight.intensity = 15;      

        this.planets.push(this.sun);
    }

    sunAngle = 0;
    computeSunPosition(){
        
        var x0 = 0.1 ,
            y0 = SOLAR.theHeight - 0.3,
            z0 = 0;
       
        var xc = SOLAR.theRightMotionController.rootMesh.getAbsolutePosition().x; // c pour controller
        var yc = SOLAR.theRightMotionController.rootMesh.getAbsolutePosition().y;
        var zc = SOLAR.theRightMotionController.rootMesh.getAbsolutePosition().z;

        var xs, ys, zs; // S pour sun

        var x,y,z;
        x = (xc - x0);
        y = (yc - y0);
        z = (zc - z0);

        var ro, theta, alpha;
        ro = Math.sqrt(x*x + y*y + z*z);
        theta = Math.acos(z/ro);
        alpha = Math.atan2(y,x);

        //x*(1+abs((3*x)^4))
        ro = ro * (1 + Math.pow(3*ro,4));

        xs = ro * Math.sin(theta) * Math.cos(alpha) + x0;
        ys = ro * Math.sin(theta) * Math.sin(alpha) + y0;
        zs = ro * Math.cos(theta) + z0;

        xs = (xs > SOLAR.xMax) ? SOLAR.xMax : xs;
        xs = (xs < SOLAR.xMin) ? SOLAR.xMin : xs;
        ys = (ys > SOLAR.yMax) ? SOLAR.yMax : ys;
        ys = (ys < SOLAR.yMin) ? SOLAR.yMin : ys;
        zs = (zs > SOLAR.zMax) ? SOLAR.zMax : zs;
        zs = (zs < SOLAR.zMin) ? SOLAR.zMin : zs;

        this.sun.mesh.position.x = xs;
        this.sun.mesh.position.y = ys;
        this.sun.mesh.position.z = zs;
        
        this.sunAngle += 0.02;
        this.sun.mesh.rotation = new BABYLON.Vector3(0,this.sunAngle,0);
    }

    // loop utilisée uniquement lors du compte à rebours
    timerLoop(){
        var s = Math.ceil(3 - (Date.now() - this.timer)/1000);
        if(s == 0){
            this.stateChange = true;
            this.nextState = SOLAR.LEVEL_STATE_GAME;
        }
        else {
            SOLAR.theTimerPlaneText.text = String(s);
            this.timer += 1;
        }
        this.computeSunPosition();

        for(let i = 1; i < this.planets.length; i++) {
            this.planets[i].mesh.rotate(BABYLON.Axis.Y,this.planets[i].angleSpeed);
         }
    }

    computeScore(){
        var speed = 0;
        var timeNow = Date.now() / 1000;
        if(this.timePrec != 0)
        {   
            var deltaTime = timeNow - this.timePrec; 
            speed = this.sun.mesh.position.subtract(this.sunPosPrec).length() / deltaTime; // speed in m/s
            var acc = Math.abs(speed - this.sunSpeedPrec) / deltaTime; // acc in m / s2 
            this.score += 100*Math.exp(-acc/50);

            var index = Math.trunc(acc/100);
            index = ((index <= 10) ? index : 10);
            console.log(index);
        } 
        
        this.sunPosPrec = this.sun.mesh.position.clone();
        this.sunSpeedPrec = speed;
        this.timePrec = timeNow;
    }

    // loop utilisée pour la phase de jeu
    gameLoop(){
        /* ************************************************************* 
        Mise à jour de la position du soleil et des disques de proximité
        ************************************************************* */
        this.computeSunPosition();

        // for Score experiment
        this.computeScore();

        if(SOLAR.discs.length > 0)
            SOLAR.cleanDiscs();

        for(let i = 1; i < this.planets.length; i++) {
            SOLAR.manageDiscs(this.planets[i]);
        }

        /* ************************************************************* 
        Calcul de la sortie d'une planete
        ************************************************************* */

        // i=0 -> sun
        for(let i = 1; i < this.planets.length; i++) {
            let x = this.planets[i].mesh.position.x;
            let y = this.planets[i].mesh.position.y;
            let z = this.planets[i].mesh.position.z;

            if (!((x>SOLAR.xMin)&&(x<SOLAR.xMax)&&(z>SOLAR.zMin)&&(z<SOLAR.zMax)&&(y>SOLAR.yMin)&&y<SOLAR.yMax)) {
                if(this.planets[i].alreadyIn){
                    this.stateChange = true;
                    this.nextState = SOLAR.LEVEL_STATE_FAIL; // fail
                    console.log("Fail #1");
                    SOLAR.showExitPoint(this.planets[i]);
                    return;
                }
            } else {
                this.planets[i].alreadyIn = true;
            }
        }

        /* ************************************************************* 
        Calcul spécifique du timer pour le gain de la partie
        ************************************************************* */

        let s = Math.ceil(10*this.levelDuration - (Date.now() - this.timer)/100)/10;
        SOLAR.theTimerPlaneText.text = String(s.toLocaleString('en-GB',{ minimumFractionDigits: 1 }));
        if(s <= 0){
            this.stateChange = true;
            SOLAR.theTimerPlaneText.text = String((0).toLocaleString('en-GB',{ minimumFractionDigits: 1 }));
            var score = 10 * Math.round(this.score / this.levelDuration * 10 );

            if((SOLAR.highScoreTableInformation != null) && SOLAR.isHighScore(score)) {
                // notinvoked if the highscore table has not been retreived
                this.nextState = SOLAR.LEVEL_STATE_HIGHSCORE; 
                SOLAR.currentScore = score;
                SOLAR.theSuccessPlaneText.text = "";
            }
            else {
                this.nextState = SOLAR.LEVEL_STATE_SUCCESS; 
                SOLAR.theSuccessPlaneText.text = "Your score : " + String((score).toLocaleString('fr-FR'));
            }
        }

        /* ************************************************************* 
        Calcul du déplacement de la planète
        ************************************************************* */
        
        let gravity_force = new Array(this.planets.length).fill(0).map(() => new Array(this.planets.length).fill(0));

        var dist_vector = new BABYLON.Vector3.Zero();
        var distance2 = 0;

        for(let i = 0; i < this.planets.length; i++) {
            for(let j = 0; j < i; j++) {
                dist_vector = this.planets[j].mesh.position.subtract(this.planets[i].mesh.position);
                distance2 = Math.pow(dist_vector.length(),2);
                gravity_force[i][j] = dist_vector.scale( this.G * this.planets[i].masse * this.planets[j].masse /  distance2);
                gravity_force[j][i] = gravity_force[i][j].scale( - 1);
                //console.log(gravity_force[i][j]);alert("*****")
            }

        }
        // console.table(gravity_force[0][1]);alert("ici");

        let sum_gravity_force_for_i = new BABYLON.Vector3.Zero();
        // i=0 -> sun
        for(let i = 1; i < this.planets.length; i++) {
            if(! this.planets[i].static) {
                sum_gravity_force_for_i = BABYLON.Vector3.Zero();

                for(let j = 0; j < this.planets.length; j++) {

                    if(i != j) {
                        sum_gravity_force_for_i.addInPlace( gravity_force[i][j]);
                    }
                }
                /*
                if(sum_gravity_force_for_i.length() > 1) {
                    sum_gravity_force_for_i.normalize().scaleInPlace(1);
                    //console.log('+');
                }
                if(sum_gravity_force_for_i.length() < 0.02) {
                    sum_gravity_force_for_i.normalize().scaleInPlace(0.02);
                    //console.log('-');
                }
                */

                this.planets[i].momentum.addInPlace( sum_gravity_force_for_i.scale(this.delta_time) );
                this.planets[i].mesh.position.addInPlace( this.planets[i].momentum.scale(this.delta_time / Math.abs(this.planets[i].masse)));
            }
            this.planets[i].mesh.rotate(BABYLON.Axis.Y,this.planets[i].angleSpeed);
        }

        /* ************************************************************* 
        Detection des collisions
        ************************************************************* */
        for(let i = 0; i < this.planets.length; i++) {
            for(let j = 0; j < i; j++) {
                //if((i != j)&&(this.planets[i].intersectsMesh(this.planets[j]))){
                if((i != j) && this.collide(this.planets[i],this.planets[j])) {
                    this.showCollision(this.planets[i],this.planets[j]);
                    this.stateChange = true;
                    this.nextState = SOLAR.LEVEL_STATE_FAIL; // fail
                }
            }
        }
    }

    showCollision(planet1,planet2){
        let material = new BABYLON.StandardMaterial("mat", theScene);

        material.ambiantColor = new BABYLON.Color3(1,0,0);
        material.diffuseColor = new BABYLON.Color3(1,0,0);
        material.specularColor = new BABYLON.Color3(1,0,0);
        planet1.mesh.material = material;
        planet2.mesh.material = material;
    }

    collide(planet1,planet2){
        var dist = Math.sqrt(
            Math.pow(planet1.mesh.position.x - planet2.mesh.position.x,2) +
            Math.pow(planet1.mesh.position.y - planet2.mesh.position.y,2) +
            Math.pow(planet1.mesh.position.z - planet2.mesh.position.z,2)
        );

        return ( dist < (planet1.radius + planet2.radius));
    }


} // end class gameLevel



class Level4 extends gameLevel {

    intro_sound = null;
    level_sound = null;

    initLevel(){
        this.delta_time = 0.1;
        this.G = 0.00001;

        SOLAR.theExplanationPlaneText.text = "Welcome to Level 4 !!!\n2 planets to mange.";

        this.levelDuration = 30;

        // création de la planete 1
        var P1 = new planet(0.075, // radius
                1, // mass
                "earth2.jpg", // texture file
                new BABYLON.Vector3(0,SOLAR.theHeight - 0.2,2), // initial position
                new BABYLON.Vector3(-0.1,-0.1,0.1)); // initial momentum

        P1.angleSpeed = -0.01;
        P1.mesh.rotate(new BABYLON.Vector3(0, 0, 1),-Math.PI/10);

        this.planets.push(P1);

        // création de la planete 2
        var P2 = new planet(0.05, // radius
            1, // mass
            "neptune.jpg", // texture file
            new BABYLON.Vector3(1,SOLAR.theHeight - 0.2,2.5), // initial position
            //new BABYLON.Vector3(1,-2,2.5), // initial position
            new BABYLON.Vector3(-0.01,0.01,-0.1)); // initial momentum

        P2.angleSpeed = 0.1;
        P2.mesh.rotate(new BABYLON.Vector3(0, 0, 1),-Math.PI/10);
        P2.mesh.rotate(new BABYLON.Vector3(1, 0, 0),Math.PI/10);

        this.planets.push(P2);
    /*
        this.intro_sound = new BABYLON.Sound("music", "sounds/intro-1.mp3",
            theScene, null, {
            loop: true, autoplay: true
        });
        
        this.level_sound = new BABYLON.Sound("music", "sounds/level-1.mp3",
            theScene, null, {
            loop: false, autoplay: false
        });
        */
        
    }

} // end class

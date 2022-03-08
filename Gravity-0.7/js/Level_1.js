
class Level1 extends gameLevel {

    initLevel(){
        this.delta_time = 0.1;
        this.G = 0.0000;

        SOLAR.theExplanationPlaneText.text = "Welcome to Level 1 !!!\n Score testing";

        // création de la planete 1
        var P1 = new planet(0.075, // radius
                0.1, // mass
                "earth2.jpg", // texture file
                new BABYLON.Vector3(0,SOLAR.theHeight - 0.2,2), // initial position
                new BABYLON.Vector3(0,0,0)); // initial momentum

        P1.angleSpeed = -0.01;
        P1.mesh.rotate(new BABYLON.Vector3(0, 0, 1),-Math.PI/10);

        this.planets.push(P1);

        
        var music = new BABYLON.Sound("music", "sounds/intro.mp3",
            theScene, function() {music.setVolume(0,0);music.play();music.setVolume(0.5,20);}, {
            loop: true, autoplay: false
        });
        this.intro_sound = music;
        
        this.level_sound = new BABYLON.Sound("music", "sounds/level.mp3",
            theScene, null, {
            loop: false, autoplay: false
        });
        this.won_sound = new BABYLON.Sound("music", "sounds/won.mp3",
            theScene, null, {
            loop: false, autoplay: false
        });
        this.fail_sound = new BABYLON.Sound("music", "sounds/fail.mp3",
            theScene, null, {
            loop: false, autoplay: false
        });
    }

} // end class

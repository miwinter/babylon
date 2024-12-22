
class Level15 extends gameLevel {

    intro_sound = null;
    level_sound = null;

    initLevel(){
        this.delta_time = 0.01;
        this.G = 0.001;
        this.sun.masse = 200;

            SOLAR.theExplanationPlaneText.text = `Welcome to level 15 !!!
            \n Negative & Positive...
            \n Keep 2 planets in the frame for ${this.levelDuration} seconds.`;


        this.levelDuration = 30;

        var P = new planet(0.12, // radius
                        100, // mass
                        "pluton.jpg", // texture file
                        new BABYLON.Vector3(-1,1,3), // initial position
                        new BABYLON.Vector3(0,0,0)); // initial momentum

        P.angleSpeed = 0.01;
        P.mesh.rotate(new BABYLON.Vector3(1,2,3),-Math.PI/10);
        this.planets.push(P);

        P = new planet(0.12, // radius
                        -100, // mass
                        "", // inutilisé qd la masse est < 0
                        new BABYLON.Vector3(0,1,3), // initial position
                        new BABYLON.Vector3(0,0,0)); // initial momentum
        
        P.angleSpeed = -0.02;
        P.mesh.rotate(new BABYLON.Vector3(2,2,3),-Math.PI/10);
        this.planets.push(P);
        
        }
} // end class

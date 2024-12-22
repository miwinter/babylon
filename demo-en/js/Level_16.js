
class Level16 extends gameLevel {

    intro_sound = null;
    level_sound = null;

    initLevel(){
        this.delta_time = 0.008;
        this.G = 0.001;
        this.sun.masse = 200;
        SOLAR.theExplanationPlaneText.text = `Welcome to level 16!!!
        \n Prevent the 2 large positive planets from ejecting the small negative planet.
        \n For ${this.levelDuration} seconds.`;

        this.levelDuration = 30;

        var P = new planet(0.18, // radius
                        100, // mass
                        "pluton.jpg", // texture file
                        new BABYLON.Vector3(0,2,3), // initial position
                        new BABYLON.Vector3(20,0,0)); // initial momentum

        P.angleSpeed = 0.01;
        P.mesh.rotate(new BABYLON.Vector3(1,2,3),-Math.PI/10);
        this.planets.push(P);

        P = new planet(0.18, // radius
                        100, // mass
                        "venus.jpg", // inutilisé qd la masse est < 0
                        new BABYLON.Vector3(0,1,3), // initial position
                        new BABYLON.Vector3(-20,0,0)); // initial momentum
        
        P.angleSpeed = -0.02;
        P.mesh.rotate(new BABYLON.Vector3(2,2,3),-Math.PI/10);
        this.planets.push(P);

        P = new planet(0.07, // radius
                        -100, // mass
                        "", // inutilisé qd la masse est < 0
                        new BABYLON.Vector3(0,1.5,3), // initial position
                        new BABYLON.Vector3(0,0,0)); // initial momentum
        
        P.angleSpeed = -0.02;
        P.mesh.rotate(new BABYLON.Vector3(2,2,3),-Math.PI/10);
        this.planets.push(P);
        
        }
} // end class

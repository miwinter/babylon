
class Level18 extends gameLevel {

    intro_sound = null;
    level_sound = null;

    initLevel(){
        this.delta_time = 0.01;
        this.G = 0.001;
        this.sun.masse = 200;

            SOLAR.theExplanationPlaneText.text = `Welcome to level 18 !!!
            \n For ${this.levelDuration} seconds.`;


        this.levelDuration = 30;

        var P = new planet(2, // radius
                        -2000, // mass
                        "", // texture file
                        new BABYLON.Vector3(-4,2,3), // initial position
                        new BABYLON.Vector3(0,2200,0)); // initial momentum

        P.angleSpeed = 0.01;
        P.mesh.rotate(new BABYLON.Vector3(1,2,3),-Math.PI/10);
        this.planets.push(P);

        P = new planet(2, // radius
                        -2000, // mass
                        "", // texture file
                        new BABYLON.Vector3(4,2,3), // initial position
                        new BABYLON.Vector3(0,-2200,0)); // initial momentum

        P.angleSpeed = 0.01;
        P.mesh.rotate(new BABYLON.Vector3(1,2,3),-Math.PI/10);
        this.planets.push(P);

        P = new planet(0.2, // radius
                        100, // mass
                        "venus.jpg", // inutilisé qd la masse est < 0
                        new BABYLON.Vector3(0,1,3), // initial position
                        new BABYLON.Vector3(0,0,0)); // initial momentum
        
        P.angleSpeed = -0.02;
        //P.static = true;
        P.mesh.rotate(new BABYLON.Vector3(2,2,3),-Math.PI/10);
        this.planets.push(P);
        
        }
} // end class

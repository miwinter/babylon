
class Level2 extends gameLevel {

    initLevel(){
        this.delta_time = 0.1;
        this.G = 0.001;
        this.levelDuration = 40;

            SOLAR.theExplanationPlaneText.text = `Welcome to level 2!!!
            \n Keep the twin planets in the frame for ${this.levelDuration} seconds. `;


        // création de la planete 1
        var P1 = new planet(0.05, // radius
                10, // mass
                "mars.jpg", // texture file
                new BABYLON.Vector3(SOLAR.xMin+0.2,SOLAR.theHeight,2), // initial position
                new BABYLON.Vector3(0.5,0,0.5)); // initial momentum

        P1.angleSpeed = -0.01;
        P1.mesh.rotate(new BABYLON.Vector3(0, 0, 1),-Math.PI/10);

        this.planets.push(P1);

        // création de la planete 2
        var P2 = new planet(0.05, // radius
            10, // mass
            "venus.jpg", // texture file
            new BABYLON.Vector3(SOLAR.xMin+0.2,SOLAR.theHeight - 0.3,2), // initial position
            new BABYLON.Vector3(-0.5,0,-0.5)); // initial momentum

        P2.angleSpeed = 0.02;
        P2.mesh.rotate(new BABYLON.Vector3(0, 0, 1),-Math.PI/10);
        P2.mesh.rotate(new BABYLON.Vector3(1, 0, 0),Math.PI/10);

        this.planets.push(P2);

        this.sun.masse = 10;
    }

} // end class

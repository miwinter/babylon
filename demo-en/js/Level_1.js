
class Level1 extends gameLevel {

    initLevel(){
        this.delta_time = 0.1;
        this.G = 0.001;
        this.sun.masse = 5;
        this.levelDuration = 15;
        SOLAR.theExplanationPlaneText.text = `Welcome to level 1!!!
        \n Learn to modify the trajectory of the planet.
        \n Keep the planet in the frame for ${this.levelDuration} seconds. `;

        // création de la planete 1
        var P1 = new planet(0.075, // radius
                5, // mass
                "earth2.jpg", // texture file
                new BABYLON.Vector3(0,SOLAR.theHeight - 0.2,2), // initial position
                new BABYLON.Vector3(0,0,0)); // initial momentum

        P1.angleSpeed = -0.01;
        P1.mesh.rotate(new BABYLON.Vector3(0, 0, 1),-Math.PI/10);

        this.planets.push(P1);
    }

} // end class
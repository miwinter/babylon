
class Level8 extends gameLevel {

    intro_sound = null;
    level_sound = null;

    initLevel(){
        this.delta_time = 0.008;
        this.G = 0.001;
        this.sun.masse = 200;

        this.levelDuration = 60;
        SOLAR.theExplanationPlaneText.text = `Welcome to level 8!!!
        \n The 4-body problem... for ${this.levelDuration} seconds. `;

        // création de la planete 1
        var P1 = new planet(0.05, // radius
                15, // mass
                "Arid_01.png", // texture file
                new BABYLON.Vector3(-1.5,2,4), // initial position
                new BABYLON.Vector3(0,-2,-2)); // initial momentum

        P1.angleSpeed = -0.001;
        P1.mesh.rotate(new BABYLON.Vector3(0,1,0),-Math.PI/10);
        P1.mesh.rotate(new BABYLON.Vector3(1, 0, 0),Math.PI/10);

        this.planets.push(P1);

        // création de la planete 2
        var P2 = new planet(0.06, // radius
                15, // mass
                "Barren_01.png", // texture file
                new BABYLON.Vector3(-0.5,2,4), // initial position
                new BABYLON.Vector3(0,-2,-2)); // initial momentum

        P2.angleSpeed = -0.001;
        P2.mesh.rotate(new BABYLON.Vector3(0,1,0),-Math.PI/10);
        P2.mesh.rotate(new BABYLON.Vector3(1, 0, 0),Math.PI/10);

        this.planets.push(P2);

        // création de la planete 3
        var P3 = new planet(0.08, // radius
                15, // mass
                "Dusty_01.png", // texture file
                new BABYLON.Vector3(0.5,2,4), // initial position
                new BABYLON.Vector3(0,-2,-2)); // initial momentum

        P3.angleSpeed = -0.001;
        P3.mesh.rotate(new BABYLON.Vector3(0,1,0),-Math.PI/10);
        P3.mesh.rotate(new BABYLON.Vector3(1, 0, 0),Math.PI/10);

        this.planets.push(P3);
        
        // création de la planete 4
        var P4 = new planet(0.06, // radius
                15, // mass
                "Gaseous_01.png", // texture file
                new BABYLON.Vector3(1.5,2,4), // initial position
                new BABYLON.Vector3(0,-2,-2)); // initial momentum

        P4.angleSpeed = -0.001;
        P4.mesh.rotate(new BABYLON.Vector3(0,1,0),-Math.PI/10);
        P4.mesh.rotate(new BABYLON.Vector3(1, 0, 0),Math.PI/10);

        this.planets.push(P4);
    }

} // end class


class Level5 extends gameLevel {

    intro_sound = null;
    level_sound = null;

    initLevel(){
        this.delta_time = 0.03;
        this.G = 0.0001;
        this.sun.masse = 1000;

        SOLAR.theExplanationPlaneText.text = `Bienvenue au niveau 5 !!!
        \n 3 planètes à garder dans le cadre pendant ${this.levelDuration} secondes.`;

        this.levelDuration = 30;

        // création de la planete 1
        var P1 = new planet(0.05, // radius
                100, // mass
                "planet-4.png", // texture file
                new BABYLON.Vector3(-0.5,-0.5,1), // initial position
                new BABYLON.Vector3(0,0,0)); // initial momentum

        P1.angleSpeed = -0.01;
        P1.mesh.rotate(new BABYLON.Vector3(0,0,0),-Math.PI/10);

        this.planets.push(P1);

        // création de la planete 2
        var P2 = new planet(0.05, // radius
            100, // mass
            "planet-6.png", // texture file
            new BABYLON.Vector3(0.5,-0,5,1), // initial position
            new BABYLON.Vector3(0,0,0)); // initial momentum

        P2.angleSpeed = 0.1;
        P2.mesh.rotate(new BABYLON.Vector3(0, 0, 1),-Math.PI/10);
        P2.mesh.rotate(new BABYLON.Vector3(1, 0, 0),Math.PI/10);
        this.planets.push(P2);

        // création de la planete 3
        var P3 = new planet(0.05, // radius
            100, // mass
            "planet-2.jpeg", // texture file
            new BABYLON.Vector3(0.5,0.5,1), // initial position
            new BABYLON.Vector3(0,0,0)); // initial momentum

        P3.angleSpeed = 0.2;
        P3.mesh.rotate(new BABYLON.Vector3(0, 0, 1),-Math.PI/10);
        P3.mesh.rotate(new BABYLON.Vector3(1, 0, 0),Math.PI/10);

        this.planets.push(P3);
/*
        // création de la planete 4
        var P4 = new planet(0.05, // radius
            100, // mass
            "planet-5.png", // texture file
            new BABYLON.Vector3(-0.5,0.5,1), // initial position
            new BABYLON.Vector3(0,0,0)); // initial momentum

        P4.angleSpeed = 0.1;
        P4.mesh.rotate(new BABYLON.Vector3(0, 0, 1),-Math.PI/10);
        P4.mesh.rotate(new BABYLON.Vector3(1, 0, 0),Math.PI/10);
        this.planets.push(P4);
      */  
    }

} // end class

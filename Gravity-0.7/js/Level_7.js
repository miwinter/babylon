
class Level7 extends gameLevel {

    intro_sound = null;
    level_sound = null;

    initLevel(){
        this.delta_time = 0.01;
        this.G = 0.001;
        this.sun.masse = 3000;

        SOLAR.theExplanationPlaneText.text = `Bienvenue au niveau 7 !!!
        \n Résistez à la géante bleue pendant ${this.levelDuration} secondes. `;

        this.levelDuration = 30;

        // création de la planete 1
        var P1 = new planet(2, // radius
                20000, // mass
                "neptune.jpg", // texture file
                new BABYLON.Vector3(-10,0,50), // initial position
                new BABYLON.Vector3(-5000,0,-25000)); // initial momentum

        
        P1.angleSpeed = -0.001;
        P1.mesh.rotate(new BABYLON.Vector3(0,1,0),-Math.PI/10);
        P1.mesh.rotate(new BABYLON.Vector3(1, 0, 0),Math.PI/10);

        this.planets.push(P1);

        // création de la planete 2
        var P2 = new planet(0.05, // radius
            200, // mass
            "mercury.png", // texture file
            new BABYLON.Vector3(-0.1,1.5,2), // initial position
            new BABYLON.Vector3(0,0,0)); // initial momentum

        P2.angleSpeed = 0.1;
        P2.mesh.rotate(new BABYLON.Vector3(0, 0, 1),-Math.PI/10);
        P2.mesh.rotate(new BABYLON.Vector3(1, 0, 0),Math.PI/10);

        this.planets.push(P2);

        

    }

} // end class

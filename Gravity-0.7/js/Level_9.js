
class Level9 extends gameLevel {

    intro_sound = null;
    level_sound = null;

    initLevel(){
        this.delta_time = 0.004;
        this.G = 0.001;
        this.sun.masse = 4000;
        

        this.levelDuration = 30;

        SOLAR.theExplanationPlaneText.text = `Bienvenue au niveau 9 !!!
        \n Le problème à 4 corps... pendant ${this.levelDuration} secondes. `;


        var x=0, y=1.8, z=3;
        // création de la planete 0
        /*
        this.sun.masse = 0;

        
        var P0 = new planet(0.1, // radius
                3000, // mass
                "sun.jpg", // texture file
                new BABYLON.Vector3(x,y,z), // initial position
                new BABYLON.Vector3(0,0,0)); // initial momentum

        P0.static = true;
        P0.angleSpeed = -0;

        this.planets.push(P0);
        */

        // création de la planete 1.1
        var P11 = new planet(0.05, // radius
                15, // mass
                "Barren_01.png", // texture file
                new BABYLON.Vector3(x,y+0.7,z), // initial position
                new BABYLON.Vector3(25,0,0)); // initial momentum

        P11.angleSpeed = 0;
        this.planets.push(P11);

        // création de la planete 1.2
        var P12 = new planet(0.05, // radius
                15, // mass
                "Barren_02.png", // texture file
                new BABYLON.Vector3(x+0.7,y,z), // initial position
                new BABYLON.Vector3(0,-25,0)); // initial momentum

        P12.angleSpeed = 0;
        this.planets.push(P12);

        // création de la planete 1.3
        var P13 = new planet(0.05, // radius
                15, // mass
                "Barren_03.png", // texture file
                new BABYLON.Vector3(x,y-0.7,z), // initial position
                new BABYLON.Vector3(-25,0,0)); // initial momentum

        P13.angleSpeed = 0;
        this.planets.push(P13);

        // création de la planete 1.4
        var P14 = new planet(0.05, // radius
                15, // mass
                "Barren_04.png", // texture file
                new BABYLON.Vector3(x-0.7,y,z), // initial position
                new BABYLON.Vector3(0,25,0)); // initial momentum

        P14.angleSpeed = 0;
        this.planets.push(P14);



    }

} // end class

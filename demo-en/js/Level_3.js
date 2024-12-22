
class Level3 extends gameLevel {

    initLevel(){
        this.delta_time = 0.1;
        this.G = 0.00001;

        SOLAR.theExplanationPlaneText.text = `Bienvenue au niveau 3 !!!
        \n Une planète rapide arrive de la gauche, freinez-la puis gardez-la dans le cadre pendant ${this.levelDuration} secondes. `;


        // création de la planete 1
        var P1 = new planet(0.05, // radius
                1, // mass
                "mercury.png", // texture file
                new BABYLON.Vector3(SOLAR.xMin-1,SOLAR.theHeight+1,2), // initial position
                new BABYLON.Vector3(0.25,-0.1,-0.01)); // initial momentum

        P1.angleSpeed = -0.2;
        P1.mesh.rotate(new BABYLON.Vector3(0, 0, 1),-Math.PI/10);

        this.planets.push(P1);
    }

} // end class

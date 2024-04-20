
class Level19 extends gameLevel {

    intro_sound = null;
    level_sound = null;

    initLevel(){
        this.delta_time = 0.001;
        this.G = 0.01;
        this.sun.masse = 1000;
        this.levelDuration = 40;

        SOLAR.theExplanationPlaneText.text = `Bienvenue au niveau 18 !!!
        \n Pendant ${this.levelDuration} secondes.`;

        for(var x = -0.5; x <= 0.5; x+=1)
        {
            for(var y = 1; y <= 2; y+=1) 
            {
                for(var z = 2; z <= 3; z+=1)
                {
                    var P = new planet(0.1, // radius
                    -40, // mass
                    "", // texture file
                    new BABYLON.Vector3(x,y,z), // initial position
                    new BABYLON.Vector3(0,0,0)); // initial momentum

                P.angleSpeed = 0.01;
                P.mesh.rotate(new BABYLON.Vector3(1,2,3),-Math.PI/10);
                this.planets.push(P);
                }

            }     
        }
    }
} // end class

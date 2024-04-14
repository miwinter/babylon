
class Level12 extends gameLevel {

    intro_sound = null;
    level_sound = null;

    initLevel(){
        this.delta_time = 0.01;
        this.G = 0.003;
        this.sun.masse = 200;

        this.levelDuration = 30;

        SOLAR.theExplanationPlaneText.text = `Bienvenue au niveau 12 !!!
        \n Evitez la catastrophe... pendant ${this.levelDuration} secondes. `;

        // on fait tourner l'axe des 2 planetes suivant une rotation aléatoire
        // de sorte qu'elle continue de se rencontrer
        
        var rotationVector = new BABYLON.Vector3(
                BABYLON.Tools.ToRadians(Math.random()*360), 
                BABYLON.Tools.ToRadians(Math.random()*360), 
                BABYLON.Tools.ToRadians(Math.random()*360)  
        );

        var center = new BABYLON.Vector3(0,(SOLAR.yMax-SOLAR.yMin)/2+SOLAR.yMin,2);
        var startVector = new BABYLON.Vector3(center.x-2,center.y,center.z);
        var momentum = new BABYLON.Vector3(140,0,0);                     

        var rotated = this.rotateVectorAroundPoint(startVector, startVector.add(momentum), rotationVector, center);
        var p0_momentum = rotated.end.subtract(rotated.start);
        
        // nouvelles psotions de P0
        var P0 = new planet(0.1, // radius
                100, // mass
                "Gaseous_02.png", // texture file
                rotated.start, // initial position
                p0_momentum); // initial momentum
        
        //P0.static = true;
        P0.angleSpeed = -0.01;
        P0.mesh.rotate(new BABYLON.Vector3(0, 0, 1),-Math.PI/10);
        P0.mesh.rotate(new BABYLON.Vector3(1, 0, 0),Math.PI/10);
        this.planets.push(P0);

        // création de la planete 1
        
        // nouvelles psotions de P0
        var startVector = new BABYLON.Vector3(center.x+2,center.y,center.z);
        var momentum = new BABYLON.Vector3(-50,0,0);                     

        var rotated = this.rotateVectorAroundPoint(startVector, startVector.add(momentum), rotationVector, center);
        var p1_momentum = rotated.end.subtract(rotated.start);
        

        var P1 = new planet(0.1, // radius
                100, // mass
                "planet-6.png", // texture file
                rotated.start, // initial position
                p1_momentum); // initial momentum

        //P0.static = true;
        P1.angleSpeed = 0.01;
        P1.mesh.rotate(new BABYLON.Vector3(0, 1, 0),Math.PI/10);
        P1.mesh.rotate(new BABYLON.Vector3(1, 0, 0),-Math.PI/10);
        this.planets.push(P1);
        

    }

} // end class

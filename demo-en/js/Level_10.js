
class Level10 extends gameLevel {

    intro_sound = null;
    level_sound = null;

    initLevel(){
        this.delta_time = 0.008;
        this.G = 0.001;
        this.sun.masse = 100;

        this.levelDuration = 30;

        SOLAR.theExplanationPlaneText.text = `Bienvenue au niveau 10 !!!
        \n Le problème à (...) corps... pendant ${this.levelDuration} secondes. `;

        // création de la planete 0
        var center = new BABYLON.Vector3(0,1.8,2);
/*
        this.sun.masse = 0;
        var P0 = new planet(0.1, // radius
                100, // mass
                "sun.jpg", // texture file
                center, // initial position
                new BABYLON.Vector3(0,0,0)); // initial momentum

        P0.static = true;
        P0.angleSpeed = -0;
        this.planets.push(P0);
*/

        // Anneau 1
        var rx = Math.random()*360;
        var ry = Math.random()*360;
        var rz = Math.random()*360;
        var rotationVector = new BABYLON.Vector3(
                BABYLON.Tools.ToRadians(rx), 
                BABYLON.Tools.ToRadians(ry), 
                BABYLON.Tools.ToRadians(rz)  
        );
        var sens = Math.random() > 0.5 ? 1 : -1;

        var nb_planets = 7;

        var startVector = new BABYLON.Vector3(center.x,center.y+0.7,center.z);
        var momentum = new BABYLON.Vector3(sens*4,0,0);

        for (var i=0; i<nb_planets; i++) {
                
                rotationVector.z = BABYLON.Tools.ToRadians(360/nb_planets*i);                        

                var rotated = this.rotateVectorAroundPoint(startVector, startVector.add(momentum), rotationVector, center);
                var P11 = new planet(0.05, // radius
                10, // mass
                "Barren_01.png", // texture file
                rotated.start, // initial position
                rotated.end.subtract(rotated.start)); // initial momentum
        
                P11.angleSpeed = 0;
                this.planets.push(P11);
        }

        // Anneau 2
        rx = rx + 90;
        var rotationVector = new BABYLON.Vector3(
                BABYLON.Tools.ToRadians(rx), 
                BABYLON.Tools.ToRadians(ry), 
                BABYLON.Tools.ToRadians(rz)  
        );
        sens = - sens;

        var nb_planets = 5;

        var startVector = new BABYLON.Vector3(center.x,center.y+0.4,center.z);
        var momentum = new BABYLON.Vector3(sens*3.5,0,0);

        for (var i=0; i<nb_planets; i++) {
                
                rotationVector.z = BABYLON.Tools.ToRadians(360/nb_planets*i);             

                var rotated = this.rotateVectorAroundPoint(startVector, startVector.add(momentum), rotationVector, center);
                var P11 = new planet(0.05, // radius
                10, // mass
                "Gaseous_01.png", // texture file
                rotated.start, // initial position
                rotated.end.subtract(rotated.start)); // initial momentum
        
                P11.angleSpeed = 0;
                this.planets.push(P11);
        }





    }

} // end class

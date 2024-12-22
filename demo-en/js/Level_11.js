
class Level11 extends gameLevel {

    intro_sound = null;
    level_sound = null;

    initLevel(){
        this.delta_time = 0.02;
        this.G = 0.0005;
        this.sun.masse = 200;

        this.levelDuration = 30;

                SOLAR.theExplanationPlaneText.text = `Welcome to level 11!!!
                \n Keep the planet and its satellites in the frame for ${this.levelDuration} seconds. `;


        // création de la planete 0
        var center = new BABYLON.Vector3(-1,1,2);
        
        var P0 = new planet(0.1, // radius
                100, // mass
                "Grassland_01.png", // texture file
                center, // initial position
                new BABYLON.Vector3(8,8,8))//new BABYLON.Vector3(6,6,6)); // initial momentum

        //P0.static = true;
        P0.angleSpeed = -0;
        this.planets.push(P0);
        

        // Anneau 1
        
        var nb_planets = 2;

        var rx = Math.random()*45;
        var ry = Math.random()*45;
        var rz = Math.random()*360;
        var rotationVector = new BABYLON.Vector3(
                BABYLON.Tools.ToRadians(rx), 
                BABYLON.Tools.ToRadians(ry), 
                BABYLON.Tools.ToRadians(rz)  
        );
        var sens = Math.random() > 0.5 ? 1 : -1;

        for (var i=0; i<nb_planets; i++) {
                
                var startVector = new BABYLON.Vector3(center.x,center.y+0.2,center.z);
                var momentum = new BABYLON.Vector3(sens*1.5,0,0);

                rotationVector.z = BABYLON.Tools.ToRadians(360/nb_planets*i);                        

                var rotated = this.rotateVectorAroundPoint(startVector, startVector.add(momentum), rotationVector, center);
                var im = rotated.end.subtract(rotated.start);
                
                im.x += 0.4;
                im.y += 0.4;
                im.z += 0.4;

                var P11 = new planet(0.03, // radius
                        5, // mass
                        "planet-"+(i+5)+".png", // texture file
                        rotated.start, // initial position
                        im); // initial momentum
        
                P11.angleSpeed = 0;
                this.planets.push(P11);
        }

        // Anneau 2
        /*
        nb_planets = 1;

        rx = Math.random()*45;
        ry = Math.random()*360;
        rz = Math.random()*45;
        rotationVector = new BABYLON.Vector3(
                BABYLON.Tools.ToRadians(rx), 
                BABYLON.Tools.ToRadians(ry), 
                BABYLON.Tools.ToRadians(rz)  
        );
        sens = Math.random() > 0.5 ? 1 : -1;

        for (var i=0; i<nb_planets; i++) {
                
                var startVector = new BABYLON.Vector3(center.x,center.y+0.4,center.z);
                var momentum = new BABYLON.Vector3(sens*3,0,0);

                rotationVector.z = BABYLON.Tools.ToRadians(360/nb_planets*i);                        

                var rotated = this.rotateVectorAroundPoint(startVector, startVector.add(momentum), rotationVector, center);
                var im = rotated.end.subtract(rotated.start);
                
                im.x += 0.3;
                im.y += 0.3;
                im.z += 0.3;

                P11 = new planet(0.03, // radius
                        10, // mass
                        "planet-5.png", // texture file
                        rotated.start, // initial position
                        im); // initial momentum
        
                P11.angleSpeed = 0;
                this.planets.push(P11);
        }*/

    }

} // end class


class Level4 extends gameLevel {

    initLevel(){
        this.delta_time = 0.1;
        this.G = 0.00001;

        // Création du soleil
        this.initSun();  
        this.sun.setEnabled(false);
        this.planets.push(this.sun);

        // création de la planete 1
        var P1 = BABYLON.MeshBuilder.CreateSphere("P1", {diameter: 0.15, segments: 32}, theScene);
        P1.material = new BABYLON.StandardMaterial("earthMat", theScene);
        P1.material.diffuseTexture = new BABYLON.Texture("textures/earth2.jpg", theScene);
        P1.initialMaterial = P1.material;
    
        
        P1.initialPosition = new BABYLON.Vector3(0,theHeight - 0.2,2); // à deux endroits
        P1.position = P1.initialPosition.clone();
        P1.initialMomentum = new BABYLON.Vector3(-0.1,-0.1,0.1);
        P1.momentum = P1.initialMomentum.clone();
        P1.masse = 1;

        P1.setEnabled(false);
        
        P1.arrow = this.drawPlanetMomentum(P1);
        P1.arrow.setEnabled(false);

        this.planets.push(P1);

        // création de la planete 2
        var P2 = BABYLON.MeshBuilder.CreateSphere("P2", {diameter: 0.1, segments: 32}, theScene);
        P2.material = new BABYLON.StandardMaterial("mercure", theScene);
        P2.material.diffuseTexture = new BABYLON.Texture("textures/neptune.jpg", theScene);
        P2.initialMaterial = P2.material;
    
        P2.initialPosition = new BABYLON.Vector3(1,theHeight - 0.2,2.5);
        P2.position =  P2.initialPosition.clone();
        P2.initialMomentum = new BABYLON.Vector3(-0.01,0.01,-0.1);
        P2.momentum = P2.initialMomentum.clone();
        P2.masse = 1;

        P2.setEnabled(false);
        
        P2.arrow = this.drawPlanetMomentum(P2);
        P2.arrow.setEnabled(false);

        this.planets.push(P2);
    }

    

    

    


    

} // end class Level2

class planet {
    mesh = null;
    initialMaterial = null;
    initialMomentum = null;
    initialPosition = null;
    momentum = null;
    // position = null; stored in the mesh
    masse = 0;
    radius = 0;
    rotation1 = null;
    rotation2 = null;
    angleSpeed = 0;
    arrow = null;
    static = false;

    constructor(radius, masse, texture, initialPosition, initialMomentum, arrowRatio = 1) {
        this.mesh = BABYLON.MeshBuilder.CreateSphere("planet", {diameter: 2*radius, segments: 32}, theScene);
        
        if(masse > 0){
        
            this.mesh.material = new BABYLON.StandardMaterial("planetMat", theScene);
            this.mesh.material.specularColor = new BABYLON.Color3(0.05,0.03,0);
            this.mesh.material.diffuseTexture = new BABYLON.Texture("textures/"+texture, theScene);
        }
        else{
            var fireMaterial = new BABYLON.StandardMaterial("fontainSculptur2", theScene);
            var fireTexture = new BABYLON.FireProceduralTexture("fire", 256, theScene);
            fireTexture.speed = new BABYLON.Vector2(0.5, 0.5);
            fireTexture.fireColors = BABYLON.FireProceduralTexture.BlueFireColors;
            fireMaterial.diffuseTexture = fireTexture;
            fireMaterial.opacityTexture = fireTexture;
            this.mesh.material = fireMaterial;
            this.mesh.material.specularColor = new BABYLON.Color3(0, 0, 0);
            //this.mesh.material.alpha = 0.5;
        }
        this.initialMaterial = this.mesh.material;
        
        this.initialPosition = initialPosition; // à deux endroits
        this.mesh.position = this.initialPosition.clone();
        this.initialMomentum = initialMomentum;
        this.momentum = this.initialMomentum.clone();
        this.masse = masse;
        this.radius = radius; // necessaire pour la collision parfaite

        this.mesh.setEnabled(false);
        this.drawPlanetMomentum(arrowRatio);
        this.arrowSetEnabled(false);

    }

    arrowTransform(VMomentum, VCenter, VATransformer){

        var alpha = Math.asin(VMomentum.y/VMomentum.length());
        var theta = Math.atan2(VMomentum.z,VMomentum.x);
    
        if((alpha > Math.PI/2)||(alpha < -Math.PI/2)) 
            theta = -(Math.PI - theta);

        var MZ = BABYLON.Matrix.RotationZ(alpha);
        var MY = BABYLON.Matrix.RotationY(-theta);
       
        var T1 = BABYLON.Vector3.TransformCoordinates(VATransformer,MZ);
        var T2 = BABYLON.Vector3.TransformCoordinates(T1,MY);
    
        return T2.addInPlace(VCenter);   
    }
/*
    drawPlanetMomentum(size = 1){
        
        // var arrowEndPoint = this.initialPosition.clone().addInPlace(this.initialMomentum);
        // var lg = this.initialMomentum.length();
        var lg = this.radius + 0.1 * size;
        var arrowEndPoint = this.initialPosition.clone().addInPlace(this.initialMomentum.clone().normalize().scaleInPlace(lg));
        console.log(this.radius + " : " + 0.15*size)
        
        var arrowPoint1 = this.arrowTransform(this.initialMomentum, this.initialPosition, new BABYLON.Vector3(lg-0.03,0.01,0));
        var arrowPoint2 = this.arrowTransform(this.initialMomentum, this.initialPosition, new BABYLON.Vector3(lg-0.03,-0.01,0));
        var arrowPoint3 = this.arrowTransform(this.initialMomentum, this.initialPosition, new BABYLON.Vector3(lg-0.03,0,0.01));
        var arrowPoint4 = this.arrowTransform(this.initialMomentum, this.initialPosition, new BABYLON.Vector3(lg-0.03,0,-0.01));
        
        
        this.arrow = BABYLON.Mesh.CreateLines("planet_arrow", [ 
            this.initialPosition, arrowEndPoint,
            arrowPoint1, arrowEndPoint, 
            arrowPoint2, arrowEndPoint, 
            arrowPoint3, arrowEndPoint, 
            arrowPoint4, ], 
            this.scene);
        this.arrow.color = new BABYLON.Color3(0, 1, 0);
    }
    */
    // function qui dessine un cylinder entre deux points qui representent
    // le centre de la base du cylinder et le centre du sommet du cylinder

    drawCylinderBetweenTwoPoints(point1, point2){
        var direction = point2.subtract(point1).normalize();
        var distance = BABYLON.Vector3.Distance(point1, point2);
        var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {
            height: distance,
            diameter: 0.02, // Adjust the diameter to change the thickness of the line
            tessellation: 32
        }, this.scene);
        cylinder.position = point1.add(point2).scale(0.5);
        var up = new BABYLON.Vector3(0, 1, 0);
        var angle = Math.acos(BABYLON.Vector3.Dot(up, direction));
        var axis = BABYLON.Vector3.Cross(up, direction).normalize();
        cylinder.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
        cylinder.material = new BABYLON.StandardMaterial("material", this.scene);
        cylinder.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
        return cylinder;
    }


    drawPlanetMomentum(size = 1){

        this.arrows = [];

        // calcul de la norme du vecteur momentum
        if(this.initialMomentum.length() > 0){
            var lg = this.radius + 0.1 * size;
            var arrowEndPoint = this.initialPosition.clone().addInPlace(this.initialMomentum.clone().normalize().scaleInPlace(lg));
            
            var arrowPoint1 = this.arrowTransform(this.initialMomentum, this.initialPosition, new BABYLON.Vector3(lg-0.05,0.02,0));
            var arrowPoint2 = this.arrowTransform(this.initialMomentum, this.initialPosition, new BABYLON.Vector3(lg-0.05,-0.02,0));
            var arrowPoint3 = this.arrowTransform(this.initialMomentum, this.initialPosition, new BABYLON.Vector3(lg-0.05,0,0.02));
            var arrowPoint4 = this.arrowTransform(this.initialMomentum, this.initialPosition, new BABYLON.Vector3(lg-0.05,0,-0.02));

            this.arrows.push(this.drawCylinderBetweenTwoPoints(this.initialPosition, arrowEndPoint));
            this.arrows.push(this.drawCylinderBetweenTwoPoints(arrowEndPoint, arrowPoint1));
            this.arrows.push(this.drawCylinderBetweenTwoPoints(arrowEndPoint, arrowPoint2));
            this.arrows.push(this.drawCylinderBetweenTwoPoints(arrowEndPoint, arrowPoint3));
            this.arrows.push(this.drawCylinderBetweenTwoPoints(arrowEndPoint, arrowPoint4));
        }
    }

// function arrowSetEnabled qui permet de rendre visible ou invisible la fleche de momentum
// de la planete
arrowSetEnabled(enabled){
    for (var i = 0; i < this.arrows.length; i++){
        this.arrows[i].setEnabled(enabled);
    }
}

reset(){
    this.mesh.position = this.initialPosition.clone();
    this.momentum = this.initialMomentum.clone();
    this.mesh.material = this.initialMaterial;

    this.mesh.setEnabled(true);
    this.arrowSetEnabled(true);
}

dispose(){
    this.mesh.dispose();
    // suppression des cylindres
    for (var i = 0; i < this.arrows.length; i++){
        this.arrows[i].dispose();
    }
}

}
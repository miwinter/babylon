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

    constructor(radius, masse, texture, initialPosition, initialMomentum, arrowRatio = 1) {
        this.mesh = BABYLON.MeshBuilder.CreateSphere("planet", {diameter: 2*radius, segments: 32}, theScene);
        this.mesh.material = new BABYLON.StandardMaterial("planetMat", theScene);
        this.mesh.material.specularColor = new BABYLON.Color3(0.05,0.03,0);
        this.mesh.material.diffuseTexture = new BABYLON.Texture("textures/"+texture, theScene);

        this.initialMaterial = this.mesh.material;
        
        this.initialPosition = initialPosition; // à deux endroits
        this.mesh.position = this.initialPosition.clone();
        this.initialMomentum = initialMomentum;
        this.momentum = this.initialMomentum.clone();
        this.masse = masse;
        this.radius = radius; // necessaire pour la collision parfaite

        this.mesh.setEnabled(false);
        this.drawPlanetMomentum(arrowRatio);
        this.arrow.setEnabled(false);

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

    drawPlanetMomentum(size = 1){
        
        // var arrowEndPoint = this.initialPosition.clone().addInPlace(this.initialMomentum);
        // var lg = this.initialMomentum.length();
        var lg = this.radius + 0.05 * size;
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

reset(){
    this.mesh.position = this.initialPosition.clone();
    this.momentum = this.initialMomentum.clone();
    this.mesh.material = this.initialMaterial;

    this.mesh.setEnabled(true);
    this.arrow.setEnabled(true);
}

dispose(){
    this.mesh.dispose();
    this.arrow.dispose();
}

}
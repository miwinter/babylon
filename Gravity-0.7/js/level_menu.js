
class Menu {
    initLevel(){
        theMenuPlane.setEnabled(true);
        theCubePlayground.setEnabled(false);
    }
    cleanLevel(){
        theMenuPlane.setEnabled(false);
        theCubePlayground.setEnabled(true);
    }

    levelRenderLoop() {}
} // end class Menu


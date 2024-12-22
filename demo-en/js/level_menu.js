
class Menu {
    initLevel(){
        SOLAR.theMenuPlane.setEnabled(true);
        SOLAR.theCubePlayground.setEnabled(false);
    }
    cleanLevel(){
        SOLAR.theMenuPlane.setEnabled(false);
        SOLAR.theCubePlayground.setEnabled(true);
    }

    levelRenderLoop() {}
} // end class Menu


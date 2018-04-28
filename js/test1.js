/**
  * Application Layout
  * by Jozef Sakalos, aka Saki
  * http://extjs.com/learn/Tutorial:Application_Layout_for_Beginners
  */
 
// reference local blank image
Ext.BLANK_IMAGE_URL = '../extjs/resources/images/default/s.gif';
 
// create namespace
Ext.namespace('myNameSpace');
 
// create application
myNameSpace.app = function() {
    // do NOT access DOM from here; elements don't exist yet
 
    // private variables
 
    // private functions
 
    // public space
    return {
        // public properties, e.g. strings to translate
 
        // public methods
        init: function() {
            alert('Application successfully initialized');
        }
    };
}(); // end of app
 
// end of file

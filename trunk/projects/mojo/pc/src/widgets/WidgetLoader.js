
Ext.define('Vitra.WidgetLoader', {
    
    // it is library class
    singleton: true, 
    
    statics: {
        // The factory to create Widget container
        loadingItem:[],
        isloading: false,
        
        load:function(array, callback) {
            loadingItem.push(array);
        },
        
        start:function() {
            
        }
    },
    
    todo: null
    
});
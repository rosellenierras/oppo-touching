/****
 * The controller of widget set. It will handle the widget item layout and data population.
 * It is mapping to a page.
 *
 */
Vitria.WidgetSetDelegate = Ext.extend(Vitria.WidgetDelegate, {
    
    children: [],
    
    links: [],
    
    eventsPending:[],
    
    /***
     * The layout manager for widget layout
     */
    layout: null,
    
    constructor: function(cfg) {
        Vitria.WidgetSetDelegate.superclass.constructor.apply(this, arguments);
    },
    
    /****
     * Override the method of super class to get more detail info.
     * A widget set will contain widget children, and their relationships (link info)
     */
    initSignature:function(cfg) {
        Vitria.WidgetSetDelegate.superclass.initSignature.apply(this, arguments);
        var me = this;
        if(me.model == null) return;
        // analyze widget children
        var b = me.model.getElementsByTagName('widgets');
        if(b.length == 1) {
            var widgets = b[0].getElementsByTagName('widget');
            var unloaded = [];
            var i = 0, length = widgets.length;
            
            /** fuck!! Ext.each can't work here, it will increment at each iterator
             *Ext.each(widgets, function(widget) {
             */
            // why needs this line code? 
            me.children = [];
            for(;i<length;i++) {
                var widget = widgets[i];
                var name = widget.getAttribute('name');
                var lib = Vitria.WidgetLib;
                var type = lib.getWidgetType(name);
                //if(lib.hasWidgetFactory(type) == false) {
                //    unloaded[i] = type;
                //    i ++;
                //} else {
                    me.initWidgetChild(widget, type); 
                //}
            }
            if(unloaded.length > 0) {
                Vitria.WidgetLoader.self.load(unloaded, function() {
                    // start to create
                });
            }
        } else {
            console.log('wrong XML for widget.xml, two nodes of "widgets"...');
        }
        // analyze widget links
        var links = me.model.getElementsByTagName('link');
        var i = 0, length = links.length;
        for(;i<length; i++) {
            var link = links[i];
            var source = link.getElementsByTagName('source')[0];
            var target = link.getElementsByTagName('target')[0];
            var sourceId = source.getAttribute('uuid');
            var sourcePort = source.getAttribute('port');
            if(sourcePort.indexOf('$') == 0) 
                sourcePort = sourcePort.substring(1, sourcePort.length);
            var targetId = target.getAttribute('uuid');
            var targetPort = target.getAttribute('port');
            if(targetPort.indexOf('$') == 0) 
                targetPort = targetPort.substring(1, targetPort.length);
            me.links.push({sourceId: sourceId, sourcePort:sourcePort,
                          targetId:targetId, targetPort:targetPort});
        }
    },
    
    /***
     * create widget instance
     *@param wi widget XML definition
     *@param type widget.@type value
     *
     */
    initWidgetChild:function(wi, type) {
        var me = this;
        var ele = document.createElement('widget');
        ele.setAttribute('type', type);
        var m = ele;
        var child = new Vitria.WidgetDelegate({model: m, param:wi});
        me.children.push(child);
    },
    
    /***
     * render itself
     */
    render: function(parent) {
        var me = this;
        me.widget = parent;
        if(! (parent instanceof Ext.Component)){
            console.log("Can't identify the parent of widget: " + parent);
            return;
        }
        // me.parent = {widget:parent};
        // me.initSize();
        //parent.add(me.widget);
        //parent.doLayout();
        
        var i, length = me.children.length;
        for(i=0; i<length; i++) {
            var child = me.children[i];
            child.on('propertyChanged', me.propertyChangedHandler, me);
            child.render(me);
        }
        me.isCreated = true;
    },
    
    /***
     * Populate the size of container to every widget for Carousel layout (ViewStack)
     * 
     */
    populateSize: function(width, height) {
        var me = this;
        var i, length = me.children.length;
        for(i=0; i<length; i++) {
            var child = me.children[i];
            child.populateSize(width, height);
        }
    },
    
    propertyChangedHandler:function(event, data) {
        var me = this;
        var sourceId = event.id;
        var sourcePort = data.name;
        var value = data.value;
        console.log('Data changed on ' + sourceId + "'s port "+ sourcePort);
        var length = me.links.length;
        for (var i = 0; i < length; i++) {
            var link = me.links[i];
            if(link.sourceId == sourceId && link.sourcePort == sourcePort) {
                console.log('Populate data into ' + link.targetId + "'s port "+ link.targetPort);
                var delegate = me.getDelegate(link.targetId);
                if(delegate != null) {
                    delegate.setValue(link.targetPort, value);
                }
            }
        }
    },
    
    /****
     * Destroy the cache and relationship
     */
    destroy: function() {
        var me = this;
        var i = 0, length = me.children.length;
        /***
         * pop() and the above push() should be matched
         * otherwise the children will be still kept!!!
         *
         * The following statement can't work????
         * for(var i=0; i<me.children.length; i++) {}
         * me.children = [];
         * 
         */
        if(me.children.length >= 0) {
            var delegate = me.children.pop();
            delegate.un('propertyChanged', me.propertyChangedHandler);
            delegate.destroy();
        } 
        me.children = [];
        me.links = [];
        me.eventsPending = [];
        me.layout = null;
        Vitria.WidgetSetDelegate.superclass.destroy.call(this);
    },
    
    getDelegate:function(id) {
        var me = this;
        var i = 0, length = me.children.length;
        for(;i<length; i++) {
            var delegate = me.children[i];
            if(delegate.id == id)
                return delegate;
        }
        return null;
    },
    
    /**************************************************/
    /*********  Widget lifecycle management  **********/
    /**************************************************/
    refresh: function() {
        var me =this;
        var i=0, length = me.children.length;
        for(; i<length; i++) {
            var child = me.children[i];
            child.refresh();
        }
    }
    
});

Ext.reg('widgetsetdelegate', Vitria.WidgetSetDelegate);
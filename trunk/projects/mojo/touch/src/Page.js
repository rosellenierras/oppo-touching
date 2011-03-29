

Ext.Page = Ext.extend(Ext.Carousel, {
    
    isPage: true,
    
    // layout: 'carousel',
    monitorOrientation: true,
    //layout: 'card',
    pageName: '',
    
    constructor: function(cfg) {
        var me = this;
        me.pageName = cfg.page;
        delete cfg.page;
        if(Ext.Viewport.orientation == 'portrait') {
            cfg.direction = 'horizontal';
        } else {
            cfg.direction = 'vertical';
        }
        Ext.Page.superclass.constructor.apply(this, arguments);
    },
    
    initComponent:function(cfg) {
        var me = this;
        Ext.Page.superclass.initComponent.call(me);
        me.on('orientationchange', me.changeLayout, me);
    },
    
    /****
     *
     */
    changeLayout:function(me, orientation, width, height) {
         if(me.delegate != null) {
            var reduceWidth = 0, reduceHeight = 0;
             if(true /*this.layout == 'carousel'*/) {
                 if(orientation == 'landscape') {
                    if(me.direction =='vertical') {
                        me.direction = 'horizontal';
                    }
                    reduceWidth = 20;
                 } else {
                    if(me.direction== 'horizontal') {
                        me.direction = 'vertical';
                    }
                    reduceHeight = 20;
                 }
                 var size = me.getSize();
                 me.delegate.populateSize(size.width - reduceWidth, size.height - reduceHeight);
             }
         }
    },
    
    afterRender:function(container, position) {
        var me = this;
        Ext.Page.superclass.afterRender.apply(this, arguments);
        Ext.Ajax.request({
            url: '../data/'+ me.pageName + '.xml',
            
            success: function(response, opts) {
                // var obj = response.responseText;
                var xml = response.responseXML.childNodes[0];
                me.createContent(xml);
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },
    
    createContent:function(xml) {
        var me = this;
        //try {
            // Attension: don't use 'new Vitria.WidgetSetDelegate()' to initialize
            // because the constructor won't be invoked !!!!!!!!!!!!!!!!!!
            var delegate = new Vitria.WidgetSetDelegate({model: xml});
            //var delegate = Ext.create({xtype:'widgetsetdelegate', model: xml});
            delegate.render(me);
            delegate.refresh();
            //me.doLayout();
            me.delegate = delegate;
        //} catch(err) {
        //    console.log('Fail to handle page render ' + err);
        //}
        me.changeLayout(me, Ext.Viewport.orientation);
    },
    
    refresh:function () {
        var me = this;
        if(me.delegate != null)
            me.delegate.refresh();
    },
    
    onDestroy:function() {
        var me = this;
        if(me.delegate != null)
        me.delegate.destroy();
        me.delegate = null;
        Ext.Page.superclass.onDestroy.call(this);  
    }
});

Ext.reg('page', Ext.Page);
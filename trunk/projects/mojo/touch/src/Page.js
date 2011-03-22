

Ext.Page = Ext.extend(Ext.Panel, {
    
    pageName: '',
    
    constructor: function(cfg) {
        var me = this;
        me.pageName = cfg.page;
        delete cfg.page;
        Ext.Page.superclass.constructor.call(this, arguments);
    },
    /*
    initComponent:function(cfg) {
        this.items = [{
            xtype: 'button',
            ui: 'round',
            text:  'test'
        }];
        Ext.Page.superclass.initComponent.call(this);
    },*/
    
    onRender:function() {
        var me = this;
        Ext.Ajax.request({
            url: '../data/'+ me.pageName + '.xml',
            
            success: function(response, opts) {
                // var obj = response.responseText;
                var xml = response.responseXML.childNodes[0];
                // Attension: don't use 'new Vitria.WidgetSetDelegate()' to initialize
                // because the constructor won't be invoked !!!!!!!!!!!!!!!!!!
                var delegate = new Vitria.WidgetSetDelegate({model: xml});
                delegate.render(me);
                delegate.refresh();
                // me.doLayout();
                me.delegate = delegate;
            },
            failure: function(response, opts) {
              //console.log('server-side failure with status code ' + response.status);
            }
        });
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
        Vitria.Page.superclass.onDestroy.call(this);  
    }
});

Ext.reg('page', Ext.Page);
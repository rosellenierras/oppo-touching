
Ext.define("Vitria.Page", {

    alias: 'vitria.page',

    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.chart.*',
        'Ext.Panel',
        'Ext.layout.component.Button',
        'Ext.util.TextMetrics'
    ],
    
    //alternateClassName: 'Vitria.Page',
    
    config: {
        modelId: '',  // 1213-3dsfs-ds-34234-dsf134
        release: '', // v1_0
        prjId: ''
    },
    name: '',
    delegate: null,
    isCreated: false,
    isBusy: false,
    
    initComponent:function() {
        this.callParent(arguments);
    },
    
    onRender:function() {
        var me = this;
        this.callParent(arguments);
        this.create();
    },
    
    /***
     * Create widget children
     */
    create:function() {
        var me = this;
        // 1. if model content is not ready, load it
        Ext.Ajax.request({
            url: '../data/'+ me.name + '.xml',
            
            //url: 'src/content/AreaChartExample.xml',
            //url: 'src/content/BarChartExample.xml',
            //url: 'src/content/ColumnChartExample.xml',
            //url: 'src/content/LineChartExample.xml',
            success: function(response, opts) {
                // var obj = response.responseText;
                var xml = response.responseXML.childNodes[0];
                // Attension: don't use 'new Vitria.WidgetSetDelegate()' to initialize
                // because the constructor won't be invoked !!!!!!!!!!!!!!!!!!
                var delegate = Ext.create('Vitria.WidgetSetDelegate', {model: xml});
                delegate.render(me);
                delegate.refresh();
                me.doLayout();
                me.delegate = delegate;
            },
            failure: function(response, opts) {
              //console.log('server-side failure with status code ' + response.status);
            }
        });
        // 2. if loaded, then analyze it and create children
        
    },
    
    refresh:function () {
        var me = this;
        me.isBusy = true;
        if(me.delegate != null)
            me.delegate.refresh();
        me.isBusy = false;
    },
    
    onDestroy:function() {
        var me = this;
        if(me.delegate != null)
        me.delegate.destroy();
        me.delegate = null;
        Vitria.Page.superclass.onDestroy.call(this);  
    }
    
})
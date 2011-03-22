

Ext.Page = Ext.extend(Ext.Panel, {
    
    initComponent:function(cfg) {
        this.items = [{
            xtype: 'button',
            ui: 'round',
            text:  'test'
        }];
        Ext.Page.superclass.initComponent.call(this);
    }
});

Ext.reg('page', Ext.Page);
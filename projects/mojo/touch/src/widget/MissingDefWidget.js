
Vitria.MissingDefWidget = Ext.extend(Ext.Panel, {
    
    title: 'Missing Implementation',
    
    initComponent:function() {
        Ext.apply(this, {
            layout: 'auto',
            items:[{
                html: '<b>This widget is not implemented yet...</b>'    
                    }]
            });
        Vitria.MissingDefWidget.superclass.initComponent.call(this);
        
    }
    
    
});

Ext.reg('vt.missingdefwidget', Vitria.MissingDefWidget);
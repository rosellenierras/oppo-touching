
Ext.define('Vitria.MissingDefWidget', {
    extend: 'Ext.panel.Panel',
    
    title: 'Missing Implementation',
    
    initComponent:function() {
        Ext.apply(this, {
            layout: 'auto',
            items:[{
                html: '<b>This widget is not implemented yet...</b>'    
                    }]
            });
        this.callParent(arguments);
    }
    
    
});
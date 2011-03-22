/**
 *
 *
 */

Ext.define('Vitria.RichTextWidget',{
    extend: 'Ext.form.TextArea',
    
    config: {
        text: null 
    },
    
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            // It didn't work for iPad
            autoScroll: true,
            //style:'overflow-y: scroll',
            //preventScrollbars: false,
            html: me.text
        });
        this.callParent(arguments);
    },
    
    applyText:function(value) {
        var me = this;
        me.html = value;
        me.doLayout();
    }
    
});
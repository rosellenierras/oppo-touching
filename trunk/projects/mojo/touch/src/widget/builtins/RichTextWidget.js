/**
 *
 *
 */

Vitria.RichTextWidget = Ext.extend(Ext.form.TextArea, {
    
    text: null,
    
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            // It didn't work for iPad
            autoScroll: true,
            //style:'overflow-y: scroll',
            //preventScrollbars: false,
            html: me.text
        });
        Vitria.RichTextWidget.superclass.initComponent(me, arguments);
    },
    
    applyText:function(value) {
        var me = this;
        me.html = value;
        me.doLayout();
    }
    
});
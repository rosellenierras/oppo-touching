/**
 *
 *
 */

Vitria.RichTextWidget = Ext.extend(Ext.form.FormPanel, {
    
    text: null,
    
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            items:[{
                xtype: 'textareafield',
                // It didn't work for iPad
                //autoScroll: true,
                //style:'overflow-y: scroll',
                //preventScrollbars: false,
                value: me.text
            }]
        });
        Vitria.RichTextWidget.superclass.initComponent.apply(me, arguments);
    },
    
    /**
     * Set the field data value
     * @param {Mixed} value The value to set
     * @return {Ext.form.Field} this
     */
    /*setValue: function(value){
        this.value = value;

        //if (this.rendered && this.fieldEl) {
        //    this.fieldEl.dom.value = (Ext.isEmpty(value) ? '' : value);
        //}
        var target = this.fieldEl;

        if (value) {
            target.update(Ext.DomHelper.markup(value));
            //delete this.html;
        }
        return this;
    },
    */
    applyText:function(value) {
        var me = this;
        me.html = value;
        me.doLayout();
    }
    
});
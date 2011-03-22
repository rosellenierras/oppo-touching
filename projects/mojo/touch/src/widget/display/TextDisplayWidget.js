/***
 *
 * Accept 'title', 'value' as input
 * 
 */

Vitria.TextDisplayWidget = Ext.extend(Ext.Panel, {
    
    layout: 'fit',
    
    child: null,
    
    renderType:null, // can be 'Grid', 'Text', 'HTML'
    
    title: '',
    
    value: null,
    
    setValue: function(newvalue) {
        apply(newvalue, this.value);
        this.value = newvalue;
    },
    
    applyValue:function(newValue, oldValue) {
        var newRenderType = null;
        var me = this;
        if(newValue) {
            if(typeof(newValue) == 'Array') {
                // it is Array, using DataGrid
                newRenderType = 'Grid';
            } else {
                newRenderType = 'Text';
                if(typeof(newValue) == 'string') {
                    if(newValue.indexOf('<html') == 0) {
                        // it is HTML, using rich text widget
                        newRenderType = 'HTML';
                    }
                }
            } 
        }
        // if the input is fake, do nothing
        if(me.renderType == null && newRenderType == null) 
            return;
        if(me.renderType != newRenderType) {
            me.removeAll();
            // the input type is changed, re-create a new child
            me.child = me.createChild(newRenderType, newValue);
            if(me.child) {
                me.add(me.child);
                me.doLayout();
            }
            return;
        } else {
            // same inputs, just change the value of widget
            me.updateValue(newRenderType, newValue);
        }
        me.renderType = newRenderType;
    },
    
    createChild:function(type, value) {
        var me = this;
        switch(type) {
            case 'Grid':
                // TODO: create grid
                break;
            case 'Text':
                me.child = new Ext.form.TextArea({
                    html: value + '',
                    autoScroll: true,
                    editable: false});
                break;
            case 'HTML':
                me.child = new Ext.form.TextArea({
                    html: value + '',
                    autoScroll: true});
                break;
            default:
                break;
        }
        return me.child;
    },
    updateValue:function(type, value) {
        var me = this;
        switch(type) {
            case 'Grid':
                break;
            case 'Text':
                me.child.text = value; 
                break;
            case 'HTML':
                me.child.html = value;
                break;
            default:
                break;
        }
        me.doLayout();
    }
});


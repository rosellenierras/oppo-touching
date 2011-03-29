/**
 * @class Ext.layout.component.Draw
 * @extends Ext.layout.Component
 * @private
 *
 */

//Ext.define('Ext.layout.component.Draw', {
Ext.layout.Draw = Ext.extend(Ext.layout.AutoComponentLayout , {
    /* Begin Definitions */

    //alias: 'layout.draw',

    //extend: 'Ext.layout.component.Auto',

    /* End Definitions */

    type: 'draw',

    onLayout : function(width, height) {
        this.owner.surface.setSize(width, height);
        Ext.layout.Draw.superclass.onLayout.apply(this, arguments);
    }
});

Ext.regLayout('draw', Ext.layout.Draw);

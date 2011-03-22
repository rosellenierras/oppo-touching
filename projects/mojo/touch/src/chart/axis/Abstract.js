/**
 * @class Ext.chart.axis.Abstract
 * @ignore
 */
//Ext.define('Ext.chart.axis.Abstract', {

Ext.chart.axis.Abstract = Ext.extend(Ext.util.Observable, {
    /* Begin Definitions */

    //requires: ['Ext.chart.Chart'],

    /* End Definitions */

    constructor: function(config) {
        config = config || {};

        var me = this,
            pos = config.position || 'left';
    
        pos = pos.charAt(0).toUpperCase() + pos.substring(1);
        //axisLabel(Top|Bottom|Right|Left)Style
        config.label = Ext.apply(config['axisLabel' + pos + 'Style'] || {}, config.label || {});
        config.axisTitleStyle = Ext.apply(config['axisTitle' + pos + 'Style'] || {}, config.labelTitle || {});
        Ext.apply(me, config);
        me.fields = [].concat(me.fields);
        Ext.chart.axis.Abstract.superclass.constructor.call(me);
        me.labels = [];
        me.getId();
        me.labelGroup = me.chart.surface.getGroup(me.axisId + "-labels");
    },

    alignment: null,
    grid: false,
    steps: 10,
    x: 0,
    y: 0,
    minValue: 0,
    maxValue: 0,

    getId: function() {
        return this.axisId || (this.axisId = Ext.id(null, 'ext-axis-'));
    },

    drawAxis: Ext.emptyFn,
    addDisplayAndLabels: Ext.emptyFn
});
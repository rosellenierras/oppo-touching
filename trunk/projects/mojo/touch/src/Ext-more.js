
Ext.apply(Ext, {
    /**
    * Used internally by the mixins pre-processor
    * @private
    */
   mixin: function(scope, name, cls) {
       var me =  scope;
       var mixinPrototype = cls.prototype,
           myPrototype = me.prototype,
           i;

       for (i in mixinPrototype) {
           if (mixinPrototype.hasOwnProperty(i)) {
               if (myPrototype[i] === undefined) {
                   /*if (Ext.isFunction(mixinPrototype[i])) {
                       me.borrowMethod(i, mixinPrototype[i]);
                   }
                   else {
                       myPrototype[i] = mixinPrototype[i];
                   }*/
                   myPrototype[i] = mixinPrototype[i];
               }
               // don't support 'config' in touch framework
               /*else if (i === 'config' && Ext.isObject(myPrototype[i]) && Ext.isObject(mixinPrototype[i])) {
                   Ext.Object.merge(myPrototype[i], mixinPrototype[i]);
               }*/
           }
       }

       if (!myPrototype.mixins) {
           myPrototype.mixins = {};
       }

       myPrototype.mixins[name] = mixinPrototype;
   }
});

Ext.ns(
    'Ext.fx',
    'Ext.fx.target',
    'Ext.chart',
    'Ext.chart.axis',
    'Ext.chart.series',
    'Ext.chart.theme',
    'Ext.draw',
    'Ext.draw.engine',
    'Vitria'
);
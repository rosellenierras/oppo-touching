
/***
 * 
 * @class Ext.Page
 * @extends Ext.Container
 */

Ext.define("Vitria.Page", {

    alias: 'vitria.page',

    extend: 'Ext.Panel',

    requires: [
        'Ext.chart.*',
        'Ext.Panel',
        'Ext.layout.component.Button',
        'Ext.util.TextMetrics'
    ],
    
    alternateClassName: 'Vitria.Page',

//});
//Ext.Page = Ext.extend(Ext.Container, {
     
     //layout: 'fit',
     /**
      * 
      * @type String
      */
     snapshot: "themes/books/detail/ActivityByName.png",
         
     /**
      * 
      */
     initComponent: function() {
                  
         Ext.apply(this, {
             layout: 'fit',
             items: [{
                  id: 'chartCmp',
                  xtype: 'chart',
                  animate: true,
                  store: store1,
                  legend: {
                      position: 'bottom'
                  },
                  axes: [{
                      type: 'Numeric',
                      grid: true,
                      position: 'left',
                      fields: ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                      title: 'Number of Hits',
                      grid: {
                          odd: {
                              opacity: 1,
                              fill: '#ddd',
                              stroke: '#bbb',
                              'stroke-width': 1
                          }
                      },
                      minimum: 0,
                      adjustMinimumByMajorUnit: 0
                  }, {
                      type: 'Category',
                      position: 'bottom',
                      fields: ['name'],
                      title: 'Month of the Year',
                      grid: true,
                      label: {
                          rotate: {
                              degrees: 315
                          }
                      }
                  }],
                  series: [{
                      type: 'area',
                      highlight: true,
                      axis: 'left',
                      xField: 'name',
                      yField: ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                      style: {
                          opacity: 0.93
                      }
                  }]
                  }]
                  });
          this.callParent(arguments);
          //Ext.Page.superclass.initComponent.call(this);
            //this.html = '<div class="thumb-wrap-full"><div class="thumb-full"><img src="'+this.snapshot+'"></div></div>';
           //Ext.apply(this, {
           //  items: [{     
            ;
        //     }]
        //});
           
     },
     todo: function() {
         }
});

// Ext.reg('page', Ext.Page);
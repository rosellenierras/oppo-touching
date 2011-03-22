
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
                 shadow: true,
                legend: {
                    position: 'right'
                },
                insetPadding: 60,
                theme: 'Base:gradients',
                series: [{
                      type: 'pie',
                      field: 'data1', // ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                      /*highlight: {
                        segment: {
                          margin: 20
                        }
                      },*/
                      showInLegend: true,
                      donut: 30,
                      tips: {
                        trackMouse: true,
                        width: 140,
                        height: 28,
                        renderer: function(storeItem, item) {
                          //calculate percentage.
                          var total = 0;
                          me.store.each(function(rec) {
                              total += rec.get('data1');
                          });
                          this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data1') / total * 100) + '%');
                        }
                      }, 
                      label: {
                          field: 'data1',
                          display: 'rotate',
                          contrast: true,
                          font: '18px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif'
                      }
                      /*style: {
                          opacity: 0.93
                      }*/
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
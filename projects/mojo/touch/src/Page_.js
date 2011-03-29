Ext.Page = Ext.extend(Ext.TabPanel, {
    sortable: true, // Tap and hold to sort
    ui: 'dark',
    items: [{
        title: 'Tab 1',
        html: 'The tabs above are also sortable.<br />(tap and hold)',
        cls: 'card card5'
    },
    {
        title: 'Tab 2',
        html: 'Tab 2',
        cls: 'card card4'
    },
    {
        title:'Tab 3',
        items: [{ text: 'Show Chart',
                xtype: 'button',
                ui: 'round',
                //fn: {
                    handler: function() {
                        console.log('it is touched...');
                        Ext.getCmp('chartCmp').setSize(500, 500);
                        Ext.getCmp('chartCmp').redraw(true);
                    }
                //    scrope: this
                //}
                },
                {
                  id: 'chartCmp',
                  xtype: 'chart',
                  //animate: true,
                  width: 500,
                  height: 500,
                  store: window.store1,
                 shadow: true,
                legend: {
                    position: 'right'
                },
                insetPadding: 60,
                //theme: 'Base:gradients',
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
    }],
    
    afterRender:function() {
        Ext.Page.superclass.afterRender.apply(this, arguments);
        var cmp = Ext.getCmp('chartCmp');
        cmp.bindStore(window.store1, true);
    },
    
    showChartHandler: function() {
        console.log('it is touched...');
    },
    
    redraw:function() {
        var cmp = Ext.getCmp('chartCmp');
        if(cmp.rendered) {
            cmp.redraw(true);
        }
    }
});

Ext.reg('page', Ext.Page);

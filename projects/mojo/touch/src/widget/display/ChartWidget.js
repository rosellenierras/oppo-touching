

Vitria.ChartWidget = Ext.extend(Ext.chart.Chart, {
    
    /**
     * Use config to define the setter/getter
     */
    /*config: {
        results: null    
    }, */
    
    // input parameter for dynamically output 
    fields: null,
    obj:null,
    
    results: null,
    
    setResults: function(value) {
        var me = this;
        me.applyResults(value, me.results);
        me.results = value;
    },
    
    /**
     * Another way to define the property, but no setter method to do extra notification
     * Why newValue can't be stored in results??????????????????
     */
    applyResults:function(newValue, oldValue) {
        var me = this;
        var store = Ext.create('Ext.data.JsonStore', {
            fields: me.seriesValueField,
            data: newValue
        });
        me.bindStore(store, true);
        //me.redraw();
    },
    
    constructor: function(config) {
        var me = this;
        var cfg = config || {};
        // identify legacy charts and do transformation
        if(cfg.isLegacy == true) {
            me.type =  cfg.legacyType;
            delete cfg.isLegacy;
            delete cfg.legacyType;
            cfg = me.migrate(cfg);
        }
        // me.callParent([cfg]);
        Vitria.ChartWidget.superclass.constructor.call(me, cfg);
        me.addEvents(
            /**
             * When some property is changed, notify outside to trigger ECA
             */
            'propertyChanged'
        );
        // when selecting an item in series, notify outside
        me.on('itemmouseup', function(item){
            var obj = item;
            // field for value column, like 'data1'
            // axis for label value, like 'Jan' in 'name' category
            var field = null, axis = null, value = null;
            var temp = [];
            switch(me.type) {
                case 'AreaChartWidget':
                    field = item.storeField;
                    var index = item.storeIndex;
                    axis = axesValueFields[index];
                    temp = me.results[index];
                    value = temp[field];
                    break;
                case 'BarChartWidget':
                case 'ColumnChartWidget':
                    // item contains 'value' {Array} [2], while [0] is seriesField like 'data1'
                    field = item.value[0];
                    value = item.value[1];
                    var dp = me.results;
                    var length = dp.length;
                    for (var i=0;i<length;i++) {
                        var obj2 = dp[i];
                        if(field == obj2[me.seriesLabelField]) {
                            for (var key in obj2) {
                                if(obj2[key] == value) {
                                    axis = key;
                                    break;
                                }
                            }
                            break;
                        } 
                    }
                    break;
                case 'LineChartWidget':
                    break;
                case 'PieChartWidget':
                    obj = me.generatePieChartWidget(axesLabelFields, axesValueFields, seriesLabelField, seriesValueField);
                    break;
                default:
                    break;
            }
            
            // enrich axis and value
            me.fireEvent('propertyChanged', me, {name:'selected', value:temp});
            // in opbook impl, we added "@" for field
            me.fireEvent('propertyChanged', me, {name:'@' + me.seriesLabelField, value:field});
            me.fireEvent('propertyChanged', me, {name:'@' + axis, value:value});
            
        });
    },
    
    migrate:function(cfg) {
        var obj = {}, me = this;
        var series = cfg.series;
        var labels = cfg.labels;
        // identify legend
        var legend = cfg.legend;
        if(legend == 'false' || legend == 'true') {
            legend = (legend == 'true');
        } else if(typeof(legend) == 'string') {
            // transform json string like '{position: 'bottom'}' to object
            try {legend = Ext.JSON.decode(legend);} catch(err) {legend = false;}
        } else if(typeof(legend) != 'object'){
            legend = false;
        }
        me.axesLabelFields = [], me.axesValueFields = [], me.seriesLabelField = '', me.seriesValueField = [];
        // identify x field
        if(typeof(labels) == 'string') {
            me.axesLabelFields = [labels];
            me.seriesLabelField = labels;
        }
        // identify y field
        if(series != null) {
            me.axesValueFields = me.seriesValueField = series.split(',');
        }
        
        switch(me.type) {
            case 'AreaChartWidget':
                obj = me.generateAreaChartWidget(me.axesLabelFields, me.axesValueFields, me.seriesLabelField, me.seriesValueField);
                break;
            case 'BarChartWidget':
                obj = me.generateBarChartWidget(me.axesLabelFields, me.axesValueFields, me.seriesLabelField, me.seriesValueField);
                break;
            case 'ColumnChartWidget':
                obj = me.generateColumnChartWidget(me.axesLabelFields, me.axesValueFields, me.seriesLabelField, me.seriesValueField);
                break;
            case 'LineChartWidget':
                obj = me.generateLineChartWidget(me.axesLabelFields, me.axesValueFields, me.seriesLabelField, me.seriesValueField);
                break;
            case 'PieChartWidget':
                obj = me.generatePieChartWidget(me.axesLabelFields, me.axesValueFields, me.seriesLabelField, me.seriesValueField);
                break;
            default:
                break;
        }
        // keep widget uuid
        obj.id = cfg.id;
        return obj;
    },
    
    /***
     * Generate LineChart config
     * Convention:
     *    series X (bottom) is for label, servies y (left) is for value.
     */
    generateLineChartWidget:function(axesLabelFields, axesValueFields, seriesLabelField, seriesValueField) {
        var i = 0, length = seriesValueField.length;
        var series = [];
        for (; i<length; i++) {
            var field = seriesValueField[i];
            series.push({
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    axis: 'left',
                    smooth: true,
                    xField: seriesLabelField, // 'name',
                    yField: field ,           //'data1',
                    markerCfg: {
                        type: 'circle',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                });
        }
        return  {animate: true,
                //xtype: 'chart',
                //legend: legend,
                legend: {
                    position: 'bottom'
                },
                store: [],
                axes: [{
                      type: 'Numeric',
                      grid: true,
                      position: 'left',
                      fields: axesValueFields, // ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                      //title: 'Number of Hits',
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
                      fields: axesLabelFields, // ['name'],
                      //title: 'Month of the Year',
                      grid: true,
                      label: {
                          rotate: {
                              degrees: 315
                          }
                      }
                  }],
                  series: series
            };  
    },
    
    /***
     * Generate AreaChart config
     * Convention:
     *    series X (bottom) is for label, servies y (left) is for value.
     */
    generateAreaChartWidget:function(axesLabelFields, axesValueFields, seriesLabelField, seriesValueField) {
        return  {animate: true,
                //xtype: 'chart',
                //legend: legend,
                legend: {
                    position: 'bottom'
                },
                store: [],
                axes: [{
                      type: 'Numeric',
                      grid: true,
                      position: 'left',
                      fields: axesValueFields, // ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                      //title: 'Number of Hits',
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
                      fields: axesLabelFields, // ['name'],
                      //title: 'Month of the Year',
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
                      xField: seriesLabelField, // 'name',
                      yField: seriesValueField, // ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                      style: {
                          opacity: 0.93
                      }
                  }]
            };  
    },
    
    /***
     * Generate BarChart config
     * Convention:
     *    series X (bottom) is for value, servies y (left) is for label.
     *
     */
    generateBarChartWidget:function(axesLabelFields, axesValueFields, seriesLabelField, seriesValueField) {
        return  {animate: true,
                 shadow: true,
                legend: {
                    position: 'bottom'
                },
                store: [],
                //theme: 'White',
                axes: [{
                      type: 'Numeric',
                      grid: true,
                      position: 'bottom',
                      fields: axesValueFields, // ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                      //title: 'Number of Hits',
                      /*grid: {
                          odd: {
                              opacity: 1,
                              fill: '#ddd',
                              stroke: '#bbb',
                              'stroke-width': 1
                          }
                      },*/
                      minimum: 0
                  }, {
                      type: 'Category',
                      position: 'left',
                      fields: axesLabelFields, // ['name'],
                      //title: 'Month of the Year',
                      grid: true,
                      label: {
                          rotate: {
                              degrees: 315
                          }
                      }
                  }],
                  series: [{
                      type: 'bar',
                      highlight: true,
                      axis: 'bottom',
                      /*label: {
                        display: 'insideEnd',
                          field: seriesLabelField[0],
                          renderer: Ext.util.Format.numberRenderer('0'),
                          orientation: 'horizontal',
                          color: '#333',
                         'text-anchor': 'middle'
                      },*/
                      yField: seriesValueField, // ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                      xField: seriesLabelField, // 'name',
                      style: {
                          opacity: 0.93
                      }
                  }]
            };  
    },
    
    /***
     * Generate ColumnChart config
     * Convention:
     *    series X (bottom) is for label, servies y (left) is for value.
     *
     */
    generateColumnChartWidget:function(axesLabelFields, axesValueFields, seriesLabelField, seriesValueField) {
        return  {animate: true,
                 shadow: true,
                legend: {
                    position: 'bottom'
                },
                store: [],
                //theme: 'White',
                axes: [{
                      type: 'Numeric',
                      grid: true,
                      position: 'left',
                      fields: axesValueFields, // ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                      //title: 'Number of Hits',
                      /*grid: {
                          odd: {
                              opacity: 1,
                              fill: '#ddd',
                              stroke: '#bbb',
                              'stroke-width': 1
                          }
                      },*/
                      minimum: 0
                  }, {
                      type: 'Category',
                      position: 'bottom',
                      fields: axesLabelFields, // ['name'],
                      //title: 'Month of the Year',
                      grid: true,
                      label: {
                          rotate: {
                              degrees: 315
                          }
                      }
                  }],
                  series: [{
                      type: 'column',
                      highlight: true,
                      axis: 'left',
                      /*label: {
                        display: 'insideEnd',
                          field: seriesLabelField[0],
                          renderer: Ext.util.Format.numberRenderer('0'),
                          orientation: 'horizontal',
                          color: '#333',
                         'text-anchor': 'middle'
                      },*/
                      yField: seriesValueField, // ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                      xField: seriesLabelField, // 'name',
                      style: {
                          opacity: 0.93
                      }
                  }]
            };  
    },
    
    /***
     * Generate PieChart config
     * Convention:
     *    Currently only support one circle.
     *
     */
    generatePieChartWidget:function(axesLabelFields, axesValueFields, seriesLabelField, seriesValueField) {
        if(seriesValueField.length > 0)
            seriesValueField = seriesValueField[0];
        var me  = this;
        return  {
                 animate: true,
                 shadow: true,
                legend: {
                    position: 'right'
                },
                store: [],
                insetPadding: 60,
                theme: 'Base:gradients',
                series: [{
                      type: 'pie',
                      field: seriesValueField, // ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
                      highlight: {
                        segment: {
                          margin: 20
                        }
                      },
                      showInLegend: true,
                      //donut: 30,
                      tips: {
                        trackMouse: true,
                        width: 140,
                        height: 28,
                        renderer: function(storeItem, item) {
                          //calculate percentage.
                          var total = 0;
                          me.store.each(function(rec) {
                              total += rec.get(seriesValueField);
                          });
                          this.setTitle(storeItem.get(seriesLabelField) + ': ' + Math.round(storeItem.get(seriesValueField) / total * 100) + '%');
                        }
                      }, 
                      label: {
                          field: seriesLabelField,
                          display: 'rotate',
                          contrast: true,
                          font: '18px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif'
                      },
                      style: {
                          opacity: 0.93
                      }
                  }]
                };  
    }
});
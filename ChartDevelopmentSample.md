# Details #

  * Add oppo-charting.js and chart.css in the entry HTML;
```
<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Oppo Charting</title>
   <link rel="stylesheet" href="chart.css" type="text/css">
    <script type="text/javascript" src="../../sencha-touch.js"></script>
    <script type="text/javascript" src="oppo-charting-debug.js"></script>
     <script type="text/javascript" src="src/example-data.js"></script>
    <script type="text/javascript" src="sample.js"></script>
     
</head>
<body> 
</body>
</html>

```

  * Create a chart in sample.js.
```
Ext.setup({
    tabletStartupScreen: 'resources/img/tablet_startup.png',
    phoneStartupScreen: 'resources/img/phone_startup.png',
    icon: 'resources/img/icon.png',
    glossOnIcon: false,

    onReady: function() {
        var chart = new Ext.chart.Chart({
            shadow: true,
            store: window.store1,
            fullscreen: true, 
            theme: 'Category1',
            legend: {
                position: 'right'
            },
            axes: [{
                type: 'Numeric',
                minimum: 0,
                position: 'left',
                fields: ['data1', 'data2', 'data3'],
                title: 'Number of Hits',
                grid: {
                    odd: {
                        opacity: 1,
                        fill: '#ddd',
                        stroke: '#bbb',
                        'stroke-width': 0.5
                    }
                }
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['name'],
                title: 'Month of the Year'
            }],
            series: [{
                type: 'line',
                highlight: {
                    size: 7,
                    radius: 7
                },
                axis: 'left',
                xField: 'name',
                yField: 'data1',
                markerCfg: {
                    type: 'cross',
                    size: 4,
                    radius: 4,
                    'stroke-width': 0
                }
            }, {
                type: 'line',
                highlight: {
                    size: 7,
                    radius: 7
                },
                axis: 'left',
                smooth: true,
                xField: 'name',
                yField: 'data2',
                markerCfg: {
                    type: 'circle',
                    size: 4,
                    radius: 4,
                    'stroke-width': 0
                }
            }, {
                type: 'line',
                highlight: {
                    size: 7,
                    radius: 7
                },
                axis: 'left',
                smooth: true,
                fill: true,
                xField: 'name',
                yField: 'data3',
                markerCfg: {
                    type: 'circle',
                    size: 4,
                    radius: 4,
                    'stroke-width': 0
                }
            }]

        });
        
    }
});
```

  * View HTML page

![http://oppo-touching.googlecode.com/svn/trunk/sdk/doc/charting.png](http://oppo-touching.googlecode.com/svn/trunk/sdk/doc/charting.png)
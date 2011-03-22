/****
 * 
 *
 *
 *
 */

Ext.define('Vitria.WidgetLib', {
    
    requires: [
        //'Vitria.WidgetSetFactory',
        'Vitria.MissingDefWidget',
        'Vitria.RichTextWidget',
        'Vitria.ChartWidget'
        ],
    
    // it is library class
    singleton: true, 
    
    statics: {
        // The factory to create Widget container
        //widgetSetFactory: new Vitria.WidgetSetFactory(),
        
        // store the key to class mapping
        widgetClassFactories: {
            MissingDefWidget:             {claz: Vitria.MissingDefWidget, isLegacy:false},
            GeneratedXMLTestDataWidget:   {claz: Vitria.TestDataWidget, isLegacy:false},
            RichTextWidget:               {claz: Vitria.RichTextWidget, isLegacy:false},
            TextDisplayWidget:               {claz: Vitria.TextDisplayWidget, isLegacy:false},
            /*  Charting Widgets */
            AreaChartWidget:              {claz: Vitria.ChartWidget, isLegacy:true},
            BarChartWidget:               {claz: Vitria.ChartWidget, isLegacy:true},
            ColumnChartWidget:            {claz: Vitria.ChartWidget, isLegacy:true},
            PieChartWidget:               {claz: Vitria.ChartWidget, isLegacy:true},
            LineChartWidget:              {claz: Vitria.ChartWidget, isLegacy:true},
            DataTimeComboChartWidget:     {claz: Vitria.ChartWidget, isLegacy:true}
        },
        
        // store the key to alias mapping
        widgetAlias: {
            'builtin:generated-record-test-data-widget': 'GeneratedXMLTestDataWidget' ,
            'builtin:area-chart-widget': 'AreaChartWidget',
            'builtin:bar-chart-widget': 'BarChartWidget',
            'builtin:column-chart-widget': 'ColumnChartWidget',
            'builtin:pie-chart-widget': 'PieChartWidget',
            'builtin:line-chart-widget': 'LineChartWidget',
            'builtin:rich-text-widget': 'RichTextWidget',
            'builtin:text-display-widget': 'TextDisplayWidget'
        },
        
        getWidgetType:function(alias) {
            var al = this.widgetAlias;
            return al[alias] || 'MissingDefWidget';
        },
        
        getWidgetAlias:function(alias) {
            var al = this.widgetAlias;
            var type = al[alias];
            if(type != null) {
                return type;
            } else {
                return alias;
            }
        },
        
        isLegacyWidget:function(type) {
            var obj = this.widgetClassFactories[type];
            if(obj['isLegacy'] == true)
                return true;
            return false;
        },
        /**
         * Register widget to central repository
         * @param {String} type
         * @param {ClassFactory} factory
         */
        registerWidget:function(type, factory) {
            var obj = this.widgetClassFactories[type];
            if(obj == null) {
                obj = {};
                this.widgetClassFactories[type] = obj;
            }
            obj['claz'] = factory;
        },
        
        getWidget:function(type) {
            var me = this;
            var obj = me.widgetClassFactories[type];
            if(obj != null)
                return obj['claz'];
            return null; 
        },
        
        hasWidgetFactory:function(type) {
            return this.widgetClassFactories[type] != null;
        },
        
        loadWidget:function(type) {
            
        }
        /***
         * Create a Widget container according to input config
         * @param {Object} config the map of input parameters, contains following keys:
         *   {Object} context the map of containing business data, like project Id, release info, etc.
         *   {String} name widget name
         *   {String} modelId model id of current widget
         *   {XML}    model widget definition. 
         *   {Boolean} isRoot it is true if current widget is root Page definition.
         *
         */
        /*createWidget: function(config) {
            var ctx = config.context, name = config.name, 
                modelId = config.modelId, model = config.model,
                isRoot = config.isRoot || false;
            var type = model.getAttribute('type');
            if(hasWidgetFactory(type) == false) {
                throw new Error(type + ' was not loaded in client yet...');
            }
            var widget = widgetSetFactory.createWiget();
            model = this.extractWidgetModel(model);
            widget.context = ctx;
            widget.isRoot = isRoot;
            widget.name = name;
            widget.modelId = modelId;
            widget.uuid = modelId;
            widget.model = model;
            
            widget.iWidgetClassFactory = widgetClassFactories[type];
            return widget;
        }*/
    }
    });

/***
 * The delegate of widget implementation.
 * Firstly you need to get the xml definition of Widget, and also the input parameter,
 * then you try to create a widget delegate based on above info.
 * 
 * The sample code to display a widget is as follows:
 *  var delegate = new Vitria.WidgetDelegate({model:modelXML, parm: paramXML});
 *  delegate.render(panel);
 *  delegate.refresh();
 *  
 *  The {Element} modelXML looks like:
 *  <widget type="AreaChartWidget" label="i18n:areaChart-title">
    <description>
    i18n:Area-Chart-Description
    </description>
    <metadata>
      <property refreshable="false" inspectable="true" actionable="true"/>
      <metadata passThru="$results"/>
    </metadata>
    <inputs>
      <param control="false" setting="false" label="i18n:areaChart-results" name="$results">
         <description>i18n:Chart-results-Description</description>
      </param>
    </inputs>
    <outputs>
      <param label="i18n:areaChart-selected-row" name="selected" type="record">
         <description>i18n:Chart-selected-row-Description</description>
      </param>
      <param label="i18n:areaChart-selected-series" name="series">
         <description>i18n:Chart-selected-series-Description</description>
      </param>
    </outputs>
      </widget>
      
 *  The {Element} paramXML looks like:
 *  <widget uuid="7A1F3941-C9ED-E489-F201-61226032D370" name="builtin:area-chart-widget"
            title="Single Series" xpos="179" ypos="176" compx="573.15" compy="95"
            width="482" height="322" frame="RoundedBox" frameStyle="null"
            visible="Always" selectable="false" dataChangeOnly="true" refreshOnQuiesce="false">
      <param name="series" value="value0"/>
      <param name="labels" value="group0"/>
      <param name="legend" value="false"/>
    </widget>

 *  How to define a custom widget:
 *  1) accept inputs through property and config.
 *     a) if just get the input without special computing, just define the variable with same name;
 *        Ext.define('MyWidget', {
 *            inputParam1: null,
 *            ...
 *        });
 *     b) if plan to compute internal value or notify UI display when getting input value,
 *        you need to define config and use 'applyValue' to apply the change.
 *        Ext.define('MyWidget', {
 *            config: {
 *            inputParam1: null
 *            },
 *            applyInputParam1:function(newValue, oldValue) {
 *                // notify display
 *            }
 *        });
 *  2) notify your output's change by 'propertyChanged' event.
 *       me.fireEvent('propertyChanged', me, {name: 'result', value: me.result});
 *     Of course you also need to define the event in your initComponent() method.
 *   
 * The delegate will focus on:
 * 1) help to populate initial properties to widget;
 * 2) help to layout the widget;
 * 3) help to coordiniate with other widgets when ECA is defined in page;
 *
 */

/*** Implementation Tips
 * 1) before creating delegate instance, the modelXML (as widget implementation) already
 *   is loaded. At the same time, the responding .js file should be also loaded to the client.
 *   The logic can be controlled by widget framework with .json metadata.
 *
 */
Vitria.WidgetDelegate = Ext.extend(Ext.util.Observable, {
    
    /*
    config: {
        visibility: 'Never',
        frame: '',
        view: '',
        format: '',
        title: '',
        model: null,
        selectable: false,
        refreshable: false,
        minimizable: false,
        inspectable: false,
        actionable: false,
        dataChangeOnly: false,
        refreshOnQuiesce: false,
        metadataPassThruParam: '',
        inputTypes: [],
        inputParams: [],
        outputTypes: [],
        outputParams: []
    },*/
    
    // parent delegate. If it null, then it is root Widget delegate
    parent: null,
    
    model: null,
    /***
    * The real widget implementation, dynamically loaded and initialized
    */
    widget: null,
    widgetType: null,
    iWidgetProperties: {},
    /***
     * The arguments should be an object, the key "model" {Element} is required.
     * The key "param" {Element} is optional for default value of widget.
     */
    constructor: function(cfg) {
        // analyze signature and parameters
        var me = this;
        me.iWidgetProperties = {};
        me.addEvents(
            'propertyChanged'
        );
        Vitria.WidgetDelegate.superclass.constructor.call(this, arguments);
        me.initSignature(cfg);
        me.initParameter(cfg);
    },
    
    /***
     * render itself
     */
    render: function(parent) {
        var me = this;
        var factory = Vitria.WidgetLib.getWidget(me.widgetType);
        // give a flag to factory for identify the legacy charts
        if(Vitria.WidgetLib.isLegacyWidget(me.widgetType)) {
            me.iWidgetProperties['isLegacy'] = true;
            me.iWidgetProperties['legacyType'] = me.widgetType;
        }
        //if(console)
        //    console.log(''+me.widgetType + '.render(), iWidgetProperties: ' + me.getProperties());
        if(factory == null) {
            me.widget = new Vitria.MissingDefWidget(me.iWidgetProperties);
            me.widget.title = me.widgetType;
        } else {
            me.widget = new factory(me.iWidgetProperties);
        }
        me.widget.id = me.id;
        me.widget.on('propertyChanged', function(event, obj) {
            me.fireEvent('propertyChanged', me, {name: obj.name, value: obj.value});
        });
        
        if(parent instanceof Vitria.WidgetDelegate) {
            me.parent = parent;
            if(me.visible === 'Always') {
                // it is important to set size firstly before adding it
                me.initSize();
                parent.widget.add(me.widget);
                parent.widget.doLayout();
            }
        } else if(parent instanceof Ext.Component){
            me.parent = null;
            parent.add(me.widget);
            me.initSize();
            parent.doLayout();
        } else {
            //console.log("Can't identify the parent of widget: " + parent);
        }
        me.isCreated = true;
    },
    
    destroy: function() {
        var me = this;
        if(me.widget) {
            me.widget.clearListeners();
            //if(me.visible === 'Always') {
            //    me.parent.widget.remove(me.widget, true);
            //}
        }
        me.model = null;
        me.widget = null;
        me.parent = null;
        //me.iWidgetProperties = {};
        me.clearListeners();
    },
    
    initSize:function() {
        var me = this;
        if(me.visible === 'Always') {
            //console.log(me.widgetType+'.initSize('+me.xpos+', '+me.ypos+', '+me.width+', '+me.height+')');
            me.widget.setPosition(me.xpos, me.ypos);
            me.widget.setSize(me.width, me.height);
            if(me.title && 'title' in me.widget) {
                me.widget.title = me.title;
            }
        }
    },
    
    // TODO: analyze this.model XML content and get info for future use
    initSignature:function(cfg) {
        var me = this;
        // model is XML definition for widget interface and impl
        if(cfg.model != null) {
            me.model = cfg.model;
            me.widgetType = me.model.getAttribute('type');
        }
    },
    
    //TODO: persist default value for meta indicator (eg., refreshable) and input property
    initParameter:function(cfg) {
        var pa = cfg.param;
        var me = this;
        if(pa) {
            me.id = pa.getAttribute('uuid');
            me.iWidgetProperties.id = me.id;
            me.visible = pa.getAttribute('visible');
            me.xpos = parseInt(pa.getAttribute('xpos'));
            me.ypos = parseInt(pa.getAttribute('ypos'));
            me.width = parseInt(pa.getAttribute('width'));
            me.height = parseInt(pa.getAttribute('height'));
            me.title = pa.getAttribute('title');
            // enrich 'iWidgetProperties'
            var list = pa.getElementsByTagName('param');
            var i = 0;
            var length = list.length;
            for(;i<length; i++) {
                var paramXML = list[i];
                var name = paramXML.getAttribute('name');
                if(name.indexOf('$') == 0) 
                    name = name.substring(1, name.length);
                var value = paramXML.getAttribute('value');
                me.iWidgetProperties[name] = value;
            }
        }
        //console.log(''+me.widgetType + '.initParameter(), iWidgetProperties: ' + me.getProperties());
    },
    
    getProperties:function() {
        var me = this, message = '';
        for(var key in me.iWidgetProperties) {
            var value = me.iWidgetProperties[key];
            message += '('+ key + ': '+ value+')';
        }
        return message;
    },
    /***
     * Populate the value to widget property
     */
    setValue:function(name, value) {
        var me = this;
        if(name in me.widget) {
            // name exists in widget property
            // just do assignment, can't notify it
            me.widget[name] = value;
        } else {
            var setter = 'set' + Ext.String.capitalize(name);
            /**
             * if(me.widget.hasOwnProperty(setter)) {
             * can't work because setter exists in the prototype of widget 
             */
            // name exists in widget 'config'
            if(setter in me.widget && typeof me.widget[setter] === 'function') {
                // it will do assignment by set***() and also notify widget by apply***()
                me.widget[setter].call(me.widget, value);
            }
        }
    },
    
    /***
     * Get the value of widget property
     */
    getValue:function(name) {
        var me = this;
        if(name in me.widget) {
            return me.widget[name];
        } else {
            var getter = 'get' + Ext.String.capitalize(name);
            if(getter in me.widget && typeof me.widget[getter] === 'function') {
                return me.widget[getter].call(me.widget, value);
            }
        }
        return null;
    },
    
    /***
     * Invoke the method of the widget through the delegate
     *@param {String} method the method of me.widget
     *@param {Boolean} needReturn the flag to return the result or not
     *@param {Array} params the parameter list of above method
     * The example:
     *  1) there is a widget like:
     *   Ext.define('myWidget', {
     *       myMethod:function(param1, param2){}
     *   });
     *  2) try to invoke its method by widget's delegate
     *   delegate.invokeMethod('myMethod', [param1, param2]);
     *   
     */
    invokeMethod:function(method, needReturn, params) {
        var me = this;
        try {
            if(method in me.widget && typeof me.widget[method] === 'function') {
                if(needReturn == true) {
                    return me.widget[method].apply(me.widget, params);
                } else {
                    me.widget[method].apply(me.widget, params);
                }
            }
        } catch (er) {
            //console.log(er);
        }
        if(needReturn == true) {
            return null;
        }
    },
    
    /**************************************************/
    /*********  Widget lifecycle management  **********/
    /**************************************************/
    refresh: function() {
        this.invokeMethod('refresh', false);
    },
    
    terminate: function () {
        this.invokeMethod('terminate', false);
    },
    
    pause: function () {
        this.invokeMethod('pause', false);
    },
    
    resume: function () {
        this.invokeMethod('resume', false);
    },
    
    freeze: function () {
        this.invokeMethod('freeze', false);
    },
    
    thaw: function () {
        this.invokeMethod('thaw', false);
    }
});

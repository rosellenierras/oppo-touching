/***
 * Viewer for book list, page list
 * @class Ext.BookContent
 * @extends Ext.Panel
 */
Ext.define("Vitria.BookContent", {
  
  alias: 'vitria.bookcontent',
  extend: "Ext.DataView",
  requires: [
        'Ext.XTemplate',
        'Ext.data.ArrayStore',
        'Ext.data.MemoryProxy',
        'Ext.util.TextMetrics'
    ],
    
    alternateClassName: 'Vitria.BookContent',

    layout: 'fit',
    autoHeight: true,
    multiSelect: true,
    overItemClass:'x-view-over',
    itemSelector:'div.thumb-wrap',
    emptyText: 'No images to display',
    
    /***
     * Represent the type of current list
     * can be 'book' or 'page'
     * @type String
     */
    contentType: 'book',
    /***
     * data provider of icon view, array of array
     * @type 
     * sample data like [
            [1, 'Book 1', 'book', 'themes/books/BallBlue_400x400.gif'],
            [2, 'Book 2', 'book', 'themes/books/Bar_Chart_400x400.gif'],
            [3, 'Book 3', 'book', 'themes/books/Camera_400x400.gif']
          ]
     */
    dataProvider: [],
    
    tpl: ['<tpl for=".">',
                    '<div class="thumb-wrap" id="{id}">',
                '<div class="thumb"><img src="{snapshot}" title="{name}"></div>',
                '<span class="x-editable">{name}</span></div>',
                '</tpl>',
                '<div class="x-clear"></div>'],
       /***
      * override initComponent and set some default properties
      */
     initComponent: function() {
             var me = this;
             
             this.addEvents(
                 /**
                  * @event openNode
                  * @param {Object} an element of data provider
                  */
                 'openNode',
                 ''
             );
           Ext.regModel('Image_', { // window.Image is protected in ie6 !!!
          fields: [
         {name: 'id'},
         {name: 'name'},
         {name: 'type'},
         {name:'snapshot'}
          ],
          sortInfo: {
                  field    : 'name',
                  direction: 'ASC'
              }
      });
      
      /*
       var store = new Ext.data.Store({
        autoLoad: true,
        model: 'User',
        data : data,
        proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'users'
        }
        }
      */
          this.store = Ext.create('Ext.data.ArrayStore', {
          fields: [
         {name: 'id'},
         {name: 'name'},
         {name: 'type'},
         {name:'snapshot'}
          ],
          data: this.dataProvider
          //new Ext.data.MemoryProxy()
              /*fields  : ['id', 'name', 'type', 'snapshot'],
              sortInfo: {
                  field    : 'name',
                  direction: 'ASC'
              }*/
          });
          //if(this.dataProvider) {
          //  this.store.loadData(this.dataProvider);
          //}
      Vitria.BookContent.superclass.initComponent.call(this);
      //me.callParent(arguments);
     },
     
     listeners: {
        dblclick: {
          fn: function(comp, index, element, ev){
              var selectedObj = comp.dataProvider[index];
            if(selectedObj != null) {
                  this.enterNode(selectedObj);
            }
          }
        },
        click: {
            fn: function(comp, index, element, ev){
            var selectedObj = comp.dataProvider[index];
            if(selectedObj != null) {
              this.enterNode(selectedObj);
          }
          }
        }
      }, 

     enterNode: function (node) {
         this.fireEvent('openNode', node);        
     },
     /***
      * update view according to the input data
      * @param {} data
      */
     updateView: function(data) {
             this.dataProvider = data;
             this.store.loadData(this.dataProvider);
     }, 
     
     onAdd: function(c) {
            this.el.slideIn('r', {duration: 3});
     }, 
     onRemove: function(c) {
            this.el.slideOut('r', {duration: 3});
     }
});

//Ext.reg('bookview', Ext.BookContent);
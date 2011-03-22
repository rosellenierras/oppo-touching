
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite',
             'Ext.layout.container.Fit',
             'Ext.util.DelayedTask']);
Ext.require('Vitria.WidgetDelegate');
Ext.require('Vitria.WidgetSetDelegate');
Ext.require('Vitria.WidgetLib');

/***
 * 
 */
Ext.onReady(function(){
	//Ext.window.moveTo(0, 0);
	Ext.QuickTips.init();
    var box = Ext.get('loading');
    if(box)
      box.remove();
  var viewport = new Ext.Viewport({
    layout: 'border',
    margins: '0 0 0 0',
    items: [
      new Vitria.AppViewPage({
         currentView: 'Library',
         id: 'images-view',
        region: 'center'
      })
    ]
  });       
  Ext.getCmp('images-view').load();
  //Ext.getCmp('images-view').fireEvent('render');

});

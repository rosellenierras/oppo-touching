/***
 * 
 * 
 * @class Ext.AppViewPage
 * @extends Ext.Panel
 */
Ext.define("Vitria.AppViewPage", {
   
   alias: 'vitria.appviewpage',

    extend: 'Ext.Panel',

    requires: [
        'Ext.chart.*',
        'Ext.toolbar.*',
        'Ext.button.*',
        'Ext.util.ClickRepeater',
    'Vitria.BookContent',
    'Vitria.Page',
        'Ext.layout.component.Button'
    ],
    
    alternateClassName: 'Vitria.AppViewPage',

// });

//Ext.AppViewPage = Ext.extend(Ext.Panel, {
  version: 'initial',
  //height: 150,
  
  /***
   * Record current view name
   * @type String
   */
  currentView: '',
  /***
   * Record current selected book
   * @type String
   */
  currentBook: '',
  /**
   * Record current selected page
   * @type String
   */
  currentPage: '',
  layout: 'fit',
  frame: false, 
  /***
   * Cache
   * the current app view, type as BookContent (containing a list of books, snapshot)
   */
  viewCache: null,
  // cache of the books
  // the key is book name, the value is BookContent (containing a list of pages, snapshot)
  booksCache: {},
  // cache of the pages
  // not used now, didn't cache page yet
  pagesCache: {},
  
  /***
   * menu variable for book list and page list
   */
  booklistMenu: new Ext.menu.Menu(),
  pagelistMenu: new Ext.menu.Menu(),
  /***
   * 
   */
  initComponent: function() {
    var me = this;
    
    // initialize default setting
    //if(me.currentView != null)
    //    me.title = me.currentView;
    me.viewCache = null;    
    me.booksCache = {};
    me.pagesCache = {};
    
    var temp = this;
    this.tbar = Ext.createWidget('toolbar', {
	  id: 'global_toolbar',
	  height: 45,
	  cls: 'm3oToolbarCls',
      items:[
	  {
		 style: '',
		 handleMouseEvents: false,
	     html: '<img src="themes/images/m3o.png" style="height:35;width:22;" id="oryx_repository_logo" alt="M3O Logo" title="M3O"/>'
	   }, {
          id: 'currentViewLabel',
          handler: this.openLibraryHandler(this)
      }, {
          id: 'firstNav',
          width: 16,
		  cls: 'm3oToolbarCls',
		  menu: this.booklistMenu,
		  //handler: this.openBookMenuHandler(this),
          text: ''
      }, {
           id: 'currentBookLabel',
			// cls: 'm3oToolbarCls',
		   //width: 50,
		   handler: this.openBookHandler(this)
      }, {
          id: 'secondNav',
		  menu: this.pagelistMenu,
		  width: 16,
          //xtype: 'label',
          text: ''
      }, {
          id: 'currentPageLabel'
      },  {
          id: 'dynSpacer',
        xtype: 'tbspacer',
        width: 0
      },{
        xtype: 'tbfill'
      },
	  
/***
 * Change to button with icons
 *
 */
			{
                text: 'Refresh',
				id: 'refreshButton',
                scale: 'small', //'medium','large'
                rowspan: 1, iconCls: 'refresh',
                iconAlign: 'top',
				tooltip: {text: 'Refresh the page'},
				disabled: true,
				handler: this.refreshHandler(this),
                cls: 'x-btn-as-arrow'
            },{
                //xtype:'menu', //splitbutton
                text: 'Settings',
                scale: 'small',
                rowspan: 1,
                iconCls: 'setting',
                iconAlign: 'top',
                arrowAlign:'right',
                menu: [{
						  text: 'System Setting'
						}, {
						  text: 'M3O Help'
						}, "-", {
						  text: 'About M3O'
						}]
            },{
                //xtype:'splitbutton',
                text: 'vtbaadmin',
                scale: 'small', 
                rowspan: 1,
                iconCls: 'user',
                iconAlign: 'top',
                arrowAlign:'right',
                menu: [{
						  text: 'Account setting'
						}, {
						  text: 'Change password'
						}, "-", {
						  text: 'Logout'
						}]
            }
        
	   ]}),
    
    //Ext.AppViewPage.superclass.initComponent.call(this);
    this.addEvents(
      /**
       * TBD
       */
      'statusChange'
    );
    me.callParent(arguments);
  },
  
  onRender: function(ct, position) {
      Vitria.AppViewPage.superclass.onRender.call(this, ct, position);
  },
  
  /***
   * 
   */
  load: function() {
        if(!this.viewCache) {
            this.viewCache = new Vitria.BookContent({
			contentType: 'view',
            dataProvider: [
                  //[1, 'C2C-Enrollment', 'book', 'themes/books/Bar_Chart_400x400.gif'],
                  //[2, 'Sample', 'book', 'themes/books/Camera_400x400.gif'],
                  [3, 'Page Sample', 'book', 'themes/books/BallBlue_400x400.gif']
                ]});
          var parentComp = this;      
          this.viewCache.on('openNode', function(data){
                 parentComp.loadBook(data);
          });
        }
        this.currentBook = null;
        this.currentPage = null;
        this.displayView(this.viewCache);
  },
  
  /***
   * 
   * @param {String} bookId
   */
  loadBook: function(book) {
        var bookId = '';
        if(typeof(book) == 'string') {
              bookId = book;
        } else {
              bookId = book[1];
        }
        this.currentBook = bookId;
        this.currentPage = null;
        var temp = this.booksCache[bookId];
        if(temp == null) {
            if(bookId == 'C2C-Enrollment') {
                temp = new Vitria.BookContent({
					id: bookId,
					layout: 'fit',
					contentType: 'book',
					dataProvider: [
						  [1, 'Enrollment-Monitor', 'page', 'themes/books/info/Enrollment-Monitor.png'],
						  [2, 'ManageAlertSLA', 'page', 'themes/books/info/ManageAlertSLA.png'],
						  [3, 'SuccessRates', 'page', 'themes/books/info/SuccessRates.png']
						]});
            } else if(bookId == 'Page Sample') {
			    temp = new Vitria.BookContent({
					id: bookId,
					layout: 'fit',
					contentType: 'book',
					dataProvider: [
						  [1, 'AreaChartExample', 'page', 'themes/books/info/Enrollment-Monitor.png'],
						  [2, 'BarChartExample', 'page', 'themes/books/info/ManageAlertSLA.png'],
						  [3, 'ColumnChartExample', 'page', 'themes/books/info/SuccessRates.png'],
						  [4, 'LineChartExample', 'page', 'themes/books/info/SuccessRates.png'],
						  [5, 'PieChartExample', 'page', 'themes/books/info/SuccessRates.png']
			  
						]});
			} else {
              temp = new Vitria.BookContent({
                id: bookId,
                contentType: 'book',
                dataProvider: [
                      [2, 'ActivityByName', 'page', 'themes/books/info/ActivityByName.png'],
                      [1, 'ProcessDetails', 'page', 'themes/books/info/ProcessDetails.png'],
                      [3, 'ProcessSummary', 'page', 'themes/books/info/ProcessSummary.png'],
                      [4, 'SubProcessSummary', 'page', 'themes/books/info/SubProcessSummary.png'],
                      [5, 'TaskSummary', 'page', 'themes/books/info/TaskSummary.png']
                    ]});
            }
          var parentComp = this;          
          temp.on('openNode', function(data){
                 parentComp.loadPage(data);
          });          
          this.booksCache[bookId] = temp;
        } 
        this.displayView(temp);
  },
  
  /***
   * Core method to switch different views
   */
  displayView: function(comp) {
    var me = this;
      if(me.view == comp) return;
      if(me.view) {
        me.view.hide();
        var destroyed = false;
        if(me.view.contentType == 'page') {
            destroyed = true;
        }
        me.remove(this.view, destroyed);
        me.doLayout();
      }
      me.view = comp;
      me.view.show();
      me.add(me.view);
      me.show();
      // update the status
      me.updateNavigationLabel();
      try {
        me.fireEvent('statusChange', comp.contentType);
      } catch(er) {
    alert(er)};
  },
  
  /***
   * Give a page definition and show it
   * @param {} pageId
   */
  loadPage: function(page) {
        var pageId = '';
        var url = "themes/books/detail/ActivityByName.png";
		if(typeof(page) == 'string') {
			pageId = page;
		} else {
			pageId = page[1];
			url = page[3];
			url = url.replace('info/', 'detail/');
		}
		this.currentPage = pageId;
		var temp = null;
		if(temp == null) {
			temp = new Vitria.Page({
			  snapshot: url,
			  contentType: 'page',
			  name: pageId,
			  layout: 'fit',
			  renderTo: this.el
			});
		}
		this.displayView(temp);
		temp.doLayout();
  },
  
  /***
   * private
   */
  up2Handler: function(temp) {
      return function(item) {
        if(temp.currentPage) {
              // can't support
              temp.loadBook(temp.currentBook);
        } else if(temp.currentBook) {
              temp.load();
        };
      }
  },
  refreshHandler:function(temp) {
      return function(item) {
	     if(temp.view && 'refresh' in temp.view) {
		      temp.view.refresh();
		 }
    };
  },
  // click the view title to go back
  openLibraryHandler: function(temp) {
       return function(item) {
           temp.load();
       };
  },
  // click the book title to go back
  openBookHandler: function(temp) {
      return function(item) {
          var label = Ext.getCmp('currentBookLabel').getText();
          temp.loadBook(label);
      };
  },
  // click '>' to show menu, click menu item to open book
  onBookMenuClick:function(item) {
      
  },
  // click '>' to show menu, click menu item to open page
  onPageMenuClick:function(temp) {
	  var me = temp;
	  return function(item) {
		var label = item.text;
		if(label != me.currentPage) {
			var currentBookCmp = me.booksCache[me.currentBook];
			var dp = currentBookCmp.dataProvider;
			for(var i=0;i<dp.length; i++) {
				var page = dp[i][1];
				if(page == label) {
				   me.loadPage(page);
				   break;
				}
			}
		}
	  };
  },
  /***
   *
   *.x-btn-toolbar-medium button {
	  background-repeat: no-repeat;
	  color: #333333;
	  font-family: Tahoma,Arial,Verdana,sans-serif;
	  font-size: 11px;
	  font-weight: bold;
	}
   */
  changeFont:function(comp) {
	  //comp.el.removeCls('x-btn-toolbar-medium');
	  
	  //comp.setStyle('top: 5px;');
	  
	  Ext.get(comp.el.dom.firstChild.firstChild).addCls('m3oToolbarCls');
	  Ext.getCmp('global_toolbar').doLayout(); //show();
  },
  
  /**
   *@private
   *@param flg the flag to create or destroy BookListMenu
   */
  refreshBookListMenu:function(flag) {
      var me = this;
	  if(flag == true) {
		  if(me.booklistMenu.items.length == 0) {
			  if(me.viewCache) {
				  var dp = me.viewCache.dataProvider;
				  if(dp && dp.length > 0) {
					  var i = 0, length = dp.length;
					  for (; i<length; i++) {
						  me.booklistMenu.add({text: dp[i][1], handler: me.onBookMenuClick});
					  }
				  }
			  }
		  }
	  } else {
		  me.booklistMenu.removeAll();
	  }
  },
  
  /**
   *@private
   */
  refreshPageListMenu:function(flag) {
	  var me = this;
	  if(flag == true) {
	      if(me.pagelistMenu.items.length == 0) {
			  if(me.currentBook) {
				  var dp = me.booksCache[me.currentBook].dataProvider;
				  if(dp && dp.length > 0) {
					  var i = 0, length = dp.length;
					  for (; i<length; i++) {
						  me.pagelistMenu.add({text: dp[i][1], handler: me.onPageMenuClick(me)});
					  }
				  }
			  }
		  }
	  } else {
		  me.pagelistMenu.removeAll();
	  }
  },
  
  /***
   * Update the navigation label in the first element of toolbar
   */
  updateNavigationLabel: function() {
	     var currentViewLabel = Ext.getCmp('currentViewLabel');
		 var firstNav = Ext.getCmp('firstNav')
		 var currentBookLabel = Ext.getCmp('currentBookLabel');
		 var secondNav = Ext.getCmp('secondNav');
		 var currentPageLabel = Ext.getCmp('currentPageLabel');
		 var me = this;
          if(me.currentView) {
			  currentViewLabel.setText(me.currentView);
			  me.changeFont(currentViewLabel);
		  }
		  // change menu list of booklistMenu and pagelistMenu
          if(me.currentBook) {
                  firstNav.show();
				  me.refreshBookListMenu(true);
                  currentBookLabel.show();
                  currentBookLabel.setText(me.currentBook);
				  me.changeFont(currentBookLabel);
                  if(me.currentPage) {
                          secondNav.show();
						  me.refreshPageListMenu(true);
                          currentPageLabel.show();
                          currentPageLabel.setText(me.currentPage);
						  me.changeFont(currentPageLabel);
                 } else {
                          secondNav.hide();
						  me.refreshPageListMenu(false);
                          currentPageLabel.hide();
                   }
          } else {
                  firstNav.hide();
				  me.refreshBookListMenu(false);
                  currentBookLabel.hide();
                  secondNav.hide();
				  me.refreshPageListMenu(false);
                  currentPageLabel.hide();
		  }
		  // 'refresh' icon
		  if(me.view.contentType == 'page') {
			  Ext.getCmp('refreshButton').enable();
			  if(Ext.get('refreshButton').hasCls('v-item-disabled') == true)
				  Ext.get('refreshButton').removeCls('v-item-disabled');
		  } else {
			  Ext.getCmp('refreshButton').disable();
			  if(Ext.get('refreshButton').hasCls('v-item-disabled') == false)
				  Ext.get('refreshButton').addCls('v-item-disabled');
		  }
  }
});

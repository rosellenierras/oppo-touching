Ext.ns('sink', 'demos', 'Ext.ux');

        Ext.regModel('Page', {
            fields: ['id',
                     'name', //{name:'text', mapping:'name'},
                     'type',
                     'image',
                     'def'],
            proxy: {
                type: 'ajax',
                url : '../data/appview.json',
                reader: {
                    type: 'tree',
                    //record: 'items'
                    root: 'items'
                    //type: 'xml'
                    //root: 'root',
                    //record: 'node'
                }
            }
            /*proxy: {
                type: 'ajax',
                url : '../data/appview.json'
            }*/
        });
        
/***
 * The component to simulate iOS layout
 */
var html = '<div><img src="themes/images/OpsBK.gif" width="210" height="291" />'+
           '<h1>JavaScript-Oriented User Interface</h1>'+
           '<p>This is the initial version of JavaScript prototype to push M3O to all devices.  '+
           'M3O can build up practical user interfaces available at any device any time.<br /><br /><span>M3OJO 1.0</span></p></div>';
    ;
Ext.ux.UniversalUI = Ext.extend(Ext.Panel, {
    fullscreen: true,
    layout: 'card',
    items: [{
        cls: 'launchscreen',
        html: html}],
    backText: 'Back',
    useTitleAsBackText: true,
    
    /***
     * init components
     */
    initComponent : function() {
        this.navigationButton = new Ext.Button({
            hidden: Ext.is.Phone || Ext.Viewport.orientation == 'landscape',
            text: 'Applications',
            handler: this.onNavButtonTap,
            scope: this
        });

        this.backButton = new Ext.Button({
            text: this.backText,
            ui: 'back',
            handler: this.onUiBack,
            hidden: true,
            scope: this
        });
        
        var btns = [this.navigationButton];
        if (Ext.is.Phone) {
            // backButton is before navigationButton
            btns.unshift(this.backButton);
        }
        
        // Main navigation bar
        this.navigationBar = new Ext.Toolbar({
            ui: 'dark',
            dock: 'top',
            title: this.title,
            items: btns.concat(this.buttons || [])
        });
        
        /****
         * folder structure of books and pages
         */
        

        var mrStore = new Ext.data.TreeStore({
            model: 'Page',
            autoLoad: true
        })
        // Main body, which includes navigation bar, and contents from store definition
        this.navigator = new Ext.NestedList({
            // change store to show M3O related data
            // store: sink.StructureStore,
            store: mrStore,
            displayField: 'name',
            useToolbar: Ext.is.Phone ? false : true,
            updateTitleText: false,
            dock: 'left',
            hidden: !Ext.is.Phone && Ext.Viewport.orientation == 'portrait',
            toolbar: Ext.is.Phone ? this.navigationBar : null,
            listeners: {
                itemtap: this.onNavPanelItemTap,
                scope: this
            }
        });

        this.navigator.on('back', this.onNavBack, this);

        if (!Ext.is.Phone) {
            this.navigator.setWidth(250);
        }
        // dockedItems is the variables of Panel. It will be added into display area later
        // just like toolbar of desktop panel
        this.dockedItems = this.dockedItems || [];
        this.dockedItems.unshift(this.navigationBar);
        
        // 
        if (!Ext.is.Phone && Ext.Viewport.orientation == 'landscape') {
            this.dockedItems.unshift(this.navigator);
        }
        else if (Ext.is.Phone) {
            this.items = this.items || [];
            this.items.unshift(this.navigator);
        }

        this.addEvents('navigate');


        Ext.ux.UniversalUI.superclass.initComponent.call(this);
    },
    
    /****
     * refresh panel, keep back button or hide it depending on different OS layout
     * 
     */
    toggleUiBackButton: function() {
        var navPnl = this.navigator;
        // refresh panel for iPhone
        if (Ext.is.Phone) {
            if (this.getActiveItem() === navPnl) {

                var currList      = navPnl.getActiveItem(),
                    currIdx       = navPnl.items.indexOf(currList),
                    recordNode    = currList.recordNode,
                    title         = navPnl.renderTitleText(recordNode),
                    parentNode    = recordNode ? recordNode.parentNode : null,
                    backTxt       = (parentNode && !parentNode.isRoot) ? navPnl.renderTitleText(parentNode) : this.title || '',
                    activeItem;


                if (currIdx <= 0) {
                    this.navigationBar.setTitle(this.title || '');
                    this.backButton.hide();
                } else {
                    this.navigationBar.setTitle(title);
                    if (this.useTitleAsBackText) {
                        this.backButton.setText(backTxt);
                    }

                    this.backButton.show();
                }
            // on a demo
            } else {
                activeItem = navPnl.getActiveItem();
                recordNode = activeItem.recordNode;
                backTxt    = (recordNode && !recordNode.isRoot) ? navPnl.renderTitleText(recordNode) : this.title || '';

                if (this.useTitleAsBackText) {
                    this.backButton.setText(backTxt);
                }
                this.backButton.show();
            }
            this.navigationBar.doLayout();
        }

    },

    onUiBack: function() {
        var navPnl = this.navigator;

        // if we already in the nested list
        if (this.getActiveItem() === navPnl) {
            navPnl.onBackTap();
        // we were on a demo, slide back into
        // navigation
        } else {
            this.setActiveItem(navPnl, {
                type: 'slide',
                reverse: true
            });
        }
        this.toggleUiBackButton();
        this.fireEvent('navigate', this, {});
    },
    
    /***
     * When an item of nav list is selected
     */
    onNavPanelItemTap: function(subList, subIdx, el, e) {
        var store      = subList.getStore(),
            record     = store.getAt(subIdx),
            recordNode = record.node,
            nestedList = this.navigator,
            title      = nestedList.renderTitleText(recordNode),
            type, card, preventHide, anim;

        if (record) {
            type        = record.get('type');
            var name = record.get('name');
            var or = this.getActiveItem();
            if(or != null && or.pageName == name)
                return;
            if(type == 'page') {
                card        = new Ext.Page({page: name});
                //card        = record.get('card');
                //anim        = record.get('cardSwitchAnimation');
                //preventHide = record.get('preventHide');
            }
        }

        if (Ext.Viewport.orientation == 'portrait' && !Ext.is.Phone && !recordNode.childNodes.length && !preventHide) {
            this.navigator.hide();
        }

        if (card) {
            var orignalCard = this.getActiveItem();
            if(orignalCard != null && orignalCard.isPage == true) {
                this.remove(orignalCard, true);
            }
            this.setActiveItem(card, anim || 'slide');
            this.currentCard = card;
            
            //if('redraw' in card) {
            //    card.redraw();
            //}
        }
        
        if (title) {
            this.navigationBar.setTitle(title);
        }
        this.toggleUiBackButton();
        this.fireEvent('navigate', this, record);
    },

    onNavButtonTap : function() {
        this.navigator.showBy(this.navigationButton, 'fade');
    },

    layoutOrientation : function(orientation, w, h) {
        if (!Ext.is.Phone) {
            if (orientation == 'portrait') {
                this.navigator.hide(false);
                this.removeDocked(this.navigator, false);
                if (this.navigator.rendered) {
                    this.navigator.el.appendTo(document.body);
                }
                this.navigator.setFloating(true);
                this.navigator.setHeight(400);
                this.navigationButton.show(false);
            }
            else {
                this.navigator.setFloating(false);
                this.navigator.show(false);
                this.navigationButton.hide(false);
                this.insertDocked(0, this.navigator);
            }
            this.navigationBar.doComponentLayout();
        }

        Ext.ux.UniversalUI.superclass.layoutOrientation.call(this, orientation, w, h);
    }
});

sink.Main = {
    init : function() {
        this.sourceButton = new Ext.Button({
            text: 'Source',
            ui: 'action',
            hidden: true,
            handler: this.onSourceButtonTap,
            scope: this
        });

        this.codeBox = new Ext.ux.CodeBox({scroll: false});

        var sourceConfig = {
            items: [this.codeBox],
            bodyCls: 'ux-code',
            scroll: {
                direction: 'both',
                eventTarget: 'parent'
            }
        };

        if (!Ext.is.Phone) {
            Ext.apply(sourceConfig, {
                width: 500,
                height: 500,
                floating: true
            });
        }

        this.sourcePanel = new Ext.Panel(sourceConfig);

        this.ui = new Ext.ux.UniversalUI({
            title: Ext.is.Phone ? 'm3ojo' : 'm3ojo',
            useTitleAsBackText: false,
            //navigationItems: sink.Structure,
            buttons: [{xtype: 'spacer'}, this.sourceButton],
            listeners: {
                navigate : this.onNavigate,
                scope: this
            }
        });
    },


    onNavigate : function(ui, record) {
        if (record.data && record.data.source) {
            var source = record.get('source');
            if (this.sourceButton.hidden) {
                this.sourceButton.show();
                ui.navigationBar.doComponentLayout();
            }

            Ext.Ajax.request({
                url: source,
                success: function(response) {
                    this.codeBox.setValue(Ext.htmlEncode(response.responseText));
                },
                scope: this
            });
        }
        else {
            this.codeBox.setValue('No source for this example.');
            this.sourceButton.hide();
            this.sourceActive = false;
            this.sourceButton.setText('Source');
            ui.navigationBar.doComponentLayout();
        }
    },

    onSourceButtonTap : function() {
        if (!Ext.is.Phone) {
            this.sourcePanel.showBy(this.sourceButton.el, 'fade');
        }
        else {
            if (this.sourceActive) {
                this.ui.setActiveItem(this.ui.currentCard, Ext.is.Android ? false : 'flip');
                this.sourceActive = false;
                this.ui.navigationBar.setTitle(this.currentTitle);
                this.sourceButton.setText('Source');
            }
            else {
                this.ui.setActiveItem(this.sourcePanel, Ext.is.Android ? false : 'flip');
                this.sourceActive = true;
                this.currentTitle = this.ui.navigationBar.title;
                this.ui.navigationBar.setTitle('Source');
                this.sourceButton.setText('Example');
            }
            this.ui.navigationBar.doLayout();
        }
        
        this.sourcePanel.scroller.scrollTo({x: 0, y: 0});
    }
};

Ext.setup({
    tabletStartupScreen: 'themes/images/OpsBook_logo.jpg',
    phoneStartupScreen: 'themes/images/OpsBook_logo.jpg',
    icon: 'themes/images/OpsBook_logo.jpg',
    glossOnIcon: false,
    fullscreen: true,
    onReady: function() {
        sink.Main.init();
    }
});

Ext.ns('demos', 'demos.Data');

﻿ Ext.ns('Ext.ux');Ext.ux.ThreePaneApp=function(conf){MasterPanel=function(conf){config={title:'Master',region:'center',tbar:[{split:true,text:'Details Panel',id:'details-panel-button',handler:this.toggleDetails.createDelegate(this,[]),menu:{id:'details-menu',cls:'details-menu',width:100,items:[{text:'Bottom',checked:true,group:'rp-group',checkHandler:this.toggleDetails,scope:this,iconCls:'details-bottom'},{text:'Right',checked:false,group:'rp-group',checkHandler:this.toggleDetails,scope:this,iconCls:'details-right'},{text:'Hide',checked:false,group:'rp-group',checkHandler:this.toggleDetails,scope:this,iconCls:'details-hide'}]}}]};Ext.apply(config,conf||{});MasterPanel.superclass.constructor.call(this,config);}
Ext.extend(MasterPanel,Ext.Panel,{toggleDetails:function(m,pressed){if(!m){var readMenu=Ext.menu.MenuMgr.get('details-menu');readMenu.render();var items=readMenu.items.items;var b=items[0],r=items[1],h=items[2];if(b.checked){r.setChecked(true);}else if(r.checked){h.setChecked(true);}else if(h.checked){b.setChecked(true);}
return;}
if(pressed){var details=Ext.getCmp('details-panel');var right=Ext.getCmp('right-details');var bot=Ext.getCmp('bottom-details');switch(m.text){case'Bottom':right.hide();right.remove(details,false);bot.add(details);bot.show();bot.ownerCt.doLayout();break;case'Right':bot.hide();bot.remove(details,false);right.add(details);right.show();right.ownerCt.doLayout();break;case'Hide':bot.hide();right.hide();right.remove(details,false);bot.remove(details,false);right.ownerCt.doLayout();break;}}}});var masterPanelConf={};if(conf&&conf.masterPanelConf){masterPanelConf=conf.masterPanelConf;}
var masterPanel=new MasterPanel(masterPanelConf);DetailsPanel=function(conf){config={id:'details-panel',layout:'fit',title:'Details',id:'details-panel'};Ext.apply(config,conf||{});DetailsPanel.superclass.constructor.call(this,config);}
Ext.extend(DetailsPanel,Ext.Panel);var detailsPanelConf={};if(conf&&conf.detailsPanelConf){detailsPanelConf=conf.detailsPanelConf;}
var detailsPanel=new DetailsPanel(detailsPanelConf);NavPanel=function(conf){config={title:'Navigation',region:'west',margins:'5 0 5 5',cmargins:'5 5 5 5',width:200,minSize:100,maxSize:300};Ext.apply(config,conf||{});NavPanel.superclass.constructor.call(this,config);}
Ext.extend(NavPanel,Ext.Panel);var navPanelConf={};if(conf&&conf.navPanelConf){navPanelConf=conf.navPanelConf;}
var navPanel=new NavPanel(navPanelConf);MasterDetailsCnt=function(conf){config={layout:'border',region:'center',collapsible:false,border:false,margins:'5 5 5 0',id:'main-view',hideMode:'offsets',items:[masterPanel,{id:'bottom-details',layout:'fit',height:300,split:true,border:false,region:'south',items:detailsPanel},{id:'right-details',layout:'fit',border:false,region:'east',width:350,split:true,hidden:true}]};Ext.apply(config,conf||{});MasterDetailsCnt.superclass.constructor.call(this,config);}
Ext.extend(MasterDetailsCnt,Ext.Panel);var masterDetailsCntConfig={};if(conf&&conf.masterDetailsCntConfig){masterDetailsCntConfig=conf.masterDetailsCntConfig;}
var masterDetailsCnt=new MasterDetailsCnt(masterDetailsCntConfig);config={layout:'border',defaults:{collapsible:true,split:true},items:[{xtype:'box',el:'app-header',height:40,region:'north'},navPanel,masterDetailsCnt]};if(conf){Ext.apply(config,conf);}
Ext.ux.ThreePaneApp.superclass.constructor.call(this,config);}
Ext.extend(Ext.ux.ThreePaneApp,Ext.Viewport);Ext.onReady(function(){var navPane={title:'MyInbox',collapsible:true,layout:'fit',items:{xtype:'treepanel',id:'inbox-tree',autoScroll:true,animate:true,enableDD:true,containerScroll:true,border:false,dataUrl:'mail-folders.php',root:{nodeType:'async',text:'MailBox',draggable:false,id:'mailbox'}}}
var detailsPane={title:'Re: Join us for happy hour'}
var masterPane={title:'Messages List'}
var container=new Ext.ux.ThreePaneApp({detailsPanelConf:detailsPane,navPanelConf:navPane,masterPanelConf:masterPane});});
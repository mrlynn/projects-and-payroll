
var global_printer=null;Date.patterns={ISO8601Long:"Y-m-d H:i:s",ISO8601Short:"Y-m-d",ShortDate:"n/j/Y",LongDate:"l, F d, Y",FullDateTime:"l, F d, Y g:i:s A",MonthDay:"F d",ShortTime:"g:i A",LongTime:"g:i:s A",SortableDateTime:"Y-m-d\\TH:i:s",UniversalSortableDateTime:"Y-m-d H:i:sO",YearMonth:"F, Y"};function printmygridGO(obj){global_printer.printGrid(obj);}
function printmygridGOcustom(obj){global_printer.printCustom(obj);}
Ext.onReady(function(){Ext.QuickTips.init();Ext.DatePicker.prototype.startDay=4;Ext.apply(Ext.form.VTypes,{daterange:function(val,field){var date=field.parseDate(val);if(!date){return;}
if(field.startDateField&&(!this.dateRangeMax||(date.getTime()!=this.dateRangeMax.getTime()))){var start=Ext.getCmp(field.startDateField);start.setMaxValue(date);start.validate();this.dateRangeMax=date;}else if(field.endDateField&&(!this.dateRangeMin||(date.getTime()!=this.dateRangeMin.getTime()))){var end=Ext.getCmp(field.endDateField);end.setMinValue(date);end.validate();this.dateRangeMin=date;}
return true;}});var weekStore=new Ext.data.JsonStore({id:'weekStore',url:'data.php',root:'data',baseParams:{xtable:'week',task:'weekDropDown'},fields:[{name:'week'},{name:'date'}]});weekStore.load;var projectStore=new Ext.data.JsonStore({fieldLabel:'project',id:'projectStore',url:'data.php',root:'results',baseParams:{xtable:'project',task:'showProjects',start:0,limit:100000},fields:[{name:'project_id',type:'int'},{name:'project_name'}]});var companyStore=new Ext.data.JsonStore({fieldLabel:'Company',id:'companyStore',url:'data.php',root:'results',baseParams:{xtable:'company',task:'getCompany',start:0,limit:100000},fields:[{name:'company_id',type:'int'},{name:'company_name'}]});var hourRecord=Ext.data.Record.create([{name:'hour_id',mapping:'hour_id'},{name:'company_name',mapping:'company_name'},{name:'user_firstname',mapping:'user_firstname'},{name:'user_lastname',mapping:'user_lastname'},{name:'user_paytype',mapping:'user_paytype'},{name:'hour_num',type:'int',mapping:'hour_num'},{name:'regular_hours',type:'int',mapping:'regular_hours'},{name:'user_regularpay',type:'float',mapping:'user_regularpay'},{name:'regular_pay',type:'float',mapping:'regular_pay'},{name:'otb_hours',type:'int',mapping:'otb_hours'},{name:'user_pto',type:'int',mapping:'user_pto'},{name:'user_pto_used',type:'int',mapping:'user_pto_used'},{name:'user_otbpay',type:'float',mapping:'user_otbpay'},{name:'otb_pay',type:'float',mapping:'otb_pay'},{name:'total_due',type:'float',mapping:'total_due'}]);var hourReader=new Ext.data.JsonReader({root:'results',totalProperty:'total',id:'hour_id'},hourRecord);hourDS=new Ext.data.GroupingStore({id:'hourDS',proxy:new Ext.data.HttpProxy({url:'data.php',method:'POST'}),baseParams:{start:0,limit:10000,task:'payroll_employee',xtable:'hour'},reader:hourReader,sortInfo:{field:'hour_id',direction:'ASC'},groupField:'company_name'});Ext.ux.grid.GroupSummary.Calculations['totalCost']=function(v,record,field){return v+(record.data.hour_num*record.data.user_regularpay);};var gridsummary=new Ext.ux.grid.GridSummary();var groupsummary=new Ext.ux.grid.GroupSummary();var companyRecord=Ext.data.Record.create([{name:'company_id',mapping:'company_id'},{name:'company_name',mapping:'company_name'}]);var companyReader=new Ext.data.JsonReader({root:'data',totalProperty:'total',id:'company_id'},companyRecord);companyDS=new Ext.data.GroupingStore({id:'companyDS',proxy:new Ext.data.HttpProxy({url:'grid-reconfigure.php',method:'POST'}),baseParams:{task:'readCompany',xtable:'company'},reader:companyReader,sortInfo:{field:'company_id',direction:'ASC'}});function handleDelete(){var selectedKeys=grid.selModel.selections.keys;if(selectedKeys.length>0){Ext.MessageBox.confirm('Message','Do you really want to delete this company?',deleteRecord);}else{Ext.MessageBox.alert('Message','Please select a company to delete');}};function refreshGrid(){hourDS.reload();}
function updateDB(oGrid_Event){if(oGrid_Event.value instanceof Date){var fieldValue=oGrid_Event.value.format('Y-m-d H:i:s');}else{var fieldValue=oGrid_Event.value;}
Ext.Ajax.request({waitMsg:'Saving changes...',url:'grid-reconfigure.php',params:{task:"update",key:company_id,xtable:'company',keyID:oGrid_Event.record.data.company_id,field:oGrid_Event.field,value:fieldValue,originalValue:oGrid_Event.record.modified},failure:function(response,options){Ext.MessageBox.alert('Warning','Oops...');},success:function(response,options){if(oGrid_Event.record.data.company_id==''){var responseData=Ext.util.JSON.decode(response.responseText);var newID=responseData.newID;oGrid_Event.record.set('newRecord','no');oGrid_Event.record.set('company_id',newID);ds.commitChanges();}else{ds.commitChanges();}}});};function handleEdit(editEvent){var gridField=editEvent.field;updateDB(editEvent);if(gridField=='price'){getTax(editEvent);}}
function addRecord(){var r=new companyRecord({company_id:'',company_name:''});hourGrid.stopEditing();companyDS.insert(0,r);hourGrid.startEditing(0,1);};var myMaxDate=Date.parse('today+10years');var weekDropDown=new Ext.form.ComboBox({id:'weekDropDown',triggerAction:'all',store:weekStore,displayField:'week',valueField:'date',labelSeparator:null,fieldLabel:'Week:',listClass:'x-combo-list-small',allowBlank:false});var dateForm1=new Ext.FormPanel({labelWidth:80,frame:true,border:false,baseCls:'x-toolbar',bodyStyle:'padding:3px',items:[weekDropDown]});var companyname_edit=new Ext.form.TextField();var money=function(val){return Ext.util.Format.number(val,'$?0,000.00?');};var columns=[{id:'company',header:"Company",width:160,sortable:true,dataIndex:'company_name'},{header:"Last",width:75,sortable:true,dataIndex:'user_lastname'},{header:"First",width:75,sortable:true,dataIndex:'user_firstname'},{header:"Min Rate",width:75,sortable:true,renderer:'usMoney',dataIndex:'user_regularpay'},{header:"Max Rate",width:75,sortable:true,renderer:'usMoney',dataIndex:'user_otbpay'}];var hourColumnModel=new Ext.grid.ColumnModel([{header:"ID",width:20,dataIndex:'company_id',sortable:true,hidden:true},{header:"Company",width:190,dataIndex:'company_name',sortable:true,hidden:false,summaryType:'count',summaryRenderer:function(v,params,data){return((v===0||v>1)?'('+v+' Timesheets)':'(1 Timesheets)');}},{header:"First Name",width:190,dataIndex:'user_firstname',sortable:true,hidden:false},{header:"Last Name",width:190,dataIndex:'user_lastname',sortable:true,hidden:false},{header:'Pay Type',width:110,dataIndex:'user_paytype',hidden:false,sortable:true},{header:'PTO',width:110,dataIndex:'user_pto',hidden:false,sortable:true},{header:'PTO Used',width:110,dataIndex:'user_pto_used',hidden:false,sortable:true},{header:"MIN Rate",width:190,align:'right',dataIndex:'user_regularpay',sortable:true,hidden:false,type:'float',renderer:money},{header:"MAX Rate",width:190,align:'right',dataIndex:'user_otbpay',sortable:true,hidden:false,renderer:money},{header:"Total Hours",width:190,align:'right',dataIndex:'hour_num',sortable:true,summaryType:'sum',hidden:false},{header:"Regular Hours",width:190,align:'right',dataIndex:'regular_hours',sortable:true,summaryType:'sum',hidden:false},{header:"OTB Hours",width:190,align:'right',dataIndex:'otb_hours',sortable:true,hidden:false,summaryType:'sum'},{header:"Regular Pay",id:'regular_pay',width:190,align:'right',dataIndex:'regular_pay',sortable:true,hidden:false,summaryType:'sum',grandTotal:true,summaryRenderer:Ext.util.Format.usMoney,renderer:money},{header:"OTB Pay",id:'otb_pay',width:190,align:'right',dataIndex:'otb_pay',sortable:true,hidden:false,summaryType:'sum',grandTotal:true,summaryRenderer:Ext.util.Format.usMoney,renderer:money},{header:"Total Due",id:'total_due',width:190,align:'right',dataIndex:'total_due',sortable:true,hidden:false,summaryType:'sum',summaryRenderer:Ext.util.Format.usMoney,renderer:money}]);var datePicker=new Ext.menu.DateMenu({usePickerPlus:false,noOfMonth:1,markWeekends:true,multiSelection:true,markNationalHolidays:true,useQuickTips:false,strictRangeSelect:true,renderTodayButton:true,showToday:false,handler:function(dp,date){var allStringDates=[];var dateParam='';if(Ext.isDate(date)){allStringDates.push(date.format('Y-m-d'));}else{Ext.each(date,function(c){allStringDates.push(c.format('Y-m-d'));},this);}
for(var i=0;i<allStringDates.length;i++){if(i==0){dateParam=allStringDates[i];}else{dateParam=dateParam+','+allStringDates[i];}}
company_id=Ext.getCmp('company_id');hourDS.baseParams.company_id=company_id.value;hourDS.baseParams.dateParam=dateParam;hourDS.load({params:{start:0,limit:38}});}});var startDate=new Ext.form.DateField({format:'Y-m-d',fieldLabel:'From Date',startDay:4,id:'startDate',name:'startDate',width:140,allowBlank:false,vtype:'daterange',emptyText:'From Date...',endDateField:'endDate'});var endDate=new Ext.form.DateField({format:'Y-m-d',startDay:4,fieldLabel:'To Date',id:'endDate',name:'endDate',width:140,allowBlank:false,vtype:'daterange',emptyText:'To Date...',startDateField:'startDate'});var selectProject=function(value){hourDS.baseParams.project_id=value.value;};var clearProject=function(){hourDS.baseParams.project_id='';};var projectCombo=new Ext.form.ClearableComboBox({fieldLabel:'Project',emptyText:'(All Projects)',displayField:'project_name',valueField:'project_id',forceSelection:true,typeAhead:true,mode:'remote',store:'projectStore',id:'project_id',triggerAction:'all',selectOnFocus:true,enableKeyEvents:true,listeners:{'select':selectProject,'cleared':clearProject,keyup:{buffer:150,fn:function(field,e){if(Ext.EventObject.ESC==e.getKey()){field.onTriggerClick();}else{var val=this.getRawValue();var re=new RegExp('%'+val+'%');projectStore.clearFilter();projectStore.filter('project_name',val,true,false);}}}}});var selectCompany=function(value){hourDS.baseParams.company_id=value.value;};var clearCompany=function(){hourDS.baseParams.company_id='';};var companyCombo=new Ext.form.ClearableComboBox({fieldLabel:'Company',emptyText:'(All Companies)',displayField:'company_name',valueField:'company_id',mode:'remote',forceSelection:true,typeAhead:true,store:'companyStore',id:'company_id',triggerAction:'all',selectOnFocus:true,listeners:{'select':selectCompany,'cleared':clearCompany}});var hourGrid=new Ext.grid.GridPanel({sm:new Ext.grid.RowSelectionModel({singleSelect:true}),store:hourDS,cm:hourColumnModel,autoExpandColumn:'Name',height:'300',autoWidth:true,trackMouseOver:true,tbar:[companyCombo,'-',projectCombo,'-',startDate,endDate,'-',{text:'Generate Report',iconCls:'go',xtype:'button',handler:function(){hourDS.baseParams.startDate=startDate.value;hourDS.baseParams.endDate=endDate.value;hourDS.load({params:{start:0,limit:38}});hourGrid.setAutoScroll(true);}},'-',{text:'Add Timesheet',tooltip:'Click to Add a Timesheet',iconCls:'clock_add',handler:addTimeSheet},'-',{text:'Refresh',tooltip:'Click to Refresh the table',handler:refreshGrid,iconCls:'reload'},'-',{xtype:'button',text:'Print',id:'downloadpdf',tooltip:'Print Projects Report',icon:'images/icons/printer.png',enableKeyEvents:true,handler:function(){printWindow=Ext.getCmp('printWindow');var startDate=Ext.getCmp('startDate').getValue();sdate=new Date(startDate);var sdate=sdate.format(Date.patterns.ISO8601Short);var endDate=Ext.getCmp('endDate').getValue();edate=new Date(endDate);var edate=endDate.format(Date.patterns.ISO8601Short);printWindow=window.open("data.php?print=1&task=payroll_employee&startDate="+sdate+"&endDate="+edate,"newwin","height=400, width: 600,toolbar=no,scrollbars=yes,menubar=yes");}}],viewConfig:{emptyText:'No Payroll to Display'},view:new Ext.grid.GroupingView({forceFit:true,emptyText:'No payroll data',showGroupname:false,enableNoGroups:false,groupTextTpl:'{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'}),plugins:[groupsummary,gridsummary]});hourGrid.addListener('afteredit',handleEdit);function addTimeSheet(){var scheduledate={xtype:'datefield',fieldLabel:'Date',name:'scheduledate',id:'scheduledate',format:'Y-m-d'};var projectStore=new Ext.data.JsonStore({autoLoad:true,id:'projectStore',url:'data.php',root:'results',baseParams:{xtable:'project',start:0,limit:10000,task:'showProjects'},fields:[{name:'project_id',type:'int'},{name:'project_name'}]});var projectEdit=new Ext.form.ComboBox({id:'projectEdit',triggerAction:'all',typeAhead:false,store:projectStore,displayField:'project_name',valueField:'project_id',hiddenName:'project_id',labelSeparator:null,fieldLabel:'Project:',listClass:'x-combo-list-small',allowBlank:false,mode:'remote',forceSelection:true,listeners:{keyup:{buffer:150,fn:function(field,e){if(Ext.EventObject.ESC==e.getKey()){field.onTriggerClick();}else{var val=this.getRawValue();var re=new RegExp('%'+val+'%');projectStore.clearFilter();projectStore.filter('project_name',val,true,false);}}}}});var hour_num=new Ext.form.TextField({name:'hour_num',fieldLabel:'Hours'});var userStore=new Ext.data.JsonStore({id:'userStore',url:'data.php',root:'results',baseParams:{xtable:'user',start:0,limit:10000,task:'showUsers'},fields:[{name:'user_id',type:'int'},{name:'username'}]});var userEdit=new Ext.form.ComboBox({id:'userEdit',triggerAction:'all',store:userStore,displayField:'username',valueField:'user_id',hiddenName:'user_id',labelSeparator:null,fieldLabel:'Employee:',listClass:'x-combo-list-small',allowBlank:false,forceSelection:true,typeAhead:true,mode:'remote',listeners:{keyup:{buffer:150,fn:function(field,e){if(Ext.EventObject.ESC==e.getKey()){field.onTriggerClick();}else{var val=this.getRawValue();var re=new RegExp('%'+val+'%');userStore.clearFilter();userStore.filter('username',val,true,false);}}}}});var createTimeSheet=new Ext.form.Checkbox({fieldLabel:'Add Timesheet?',name:'addtimesheet',value:'yes',checked:true});var dr=new Ext.FormPanel({frame:true,height:180,id:'dr',width:300,labelWidth:100,lazyRender:true,url:'data.php',baseParams:{xtable:'task',task:'addTimeSheet'},bodyStyle:'padding:5px',defaults:{labelWidth:100,width:170},defaultType:'datefield',items:[scheduledate,userEdit,projectEdit,hour_num,createTimeSheet],buttons:[{text:'Add Timesheet',handler:function(){dr.getForm().submit({success:function(f,a){Ext.Msg.alert('Success','Timesheet Successfully Created');dr.getForm().reset();},failure:function(f,a){Ext.Msg.alert('Warning','Timesheet Not Successfully Created');}});}},{text:'Cancel',handler:function(){winPanel.hide();}}]});var winPanel=Ext.getCmp('winPanel');if(!winPanel){var winPanel=new Ext.Window({title:'Add Timesheet',id:'winPanel',autoHeight:true,width:310,resizable:false,closable:true,modal:true,items:[dr]});}
winPanel.onShow=function(){dr=Ext.getCmp('dr');dr.getForm().reset();winPanel.show();}
winPanel.onClose=function(){dr=Ext.getCmp('dr');dr.getForm().reset();}
winPanel.show();};var viewport=new Ext.Viewport({layout:'border',defaults:{collapsible:false,split:true},items:[{region:'center',id:'centerpanel',layout:'fit',autoScroll:true,frame:false,containerScroll:true,border:false,items:[hourGrid]}]});});
/**
 * Editor Grid for Projects - Part of Wall Systems Supply Payroll and Scheduling System
 * Interacts with server side php/MySQL
 * January 18, 2007
 * Michael Lynn <merlynn@gmail.com>
 */
Ext.namespace('WSSApp');
Ext.WSSApp.projects = function() { //Start of the WSSApp.projects module
//
// Setup printing options
//
    var global_printer = null;  // it has to be on the index page or the generator page  always
    function printmygridGO(obj){  global_printer.printGrid(obj);    }
    function printmygridGOcustom(obj){ global_printer.printCustom(obj);     }
// 
// Setup Private Variables
//

// 
// Setup Project Form
//
	function createProjectForm() {
// 
// Datastore for company combobox
//
		var companyStore = new Ext.data.JsonStore({
			id: 		'companyStore'
			,url:		'grid-reconfigure.php'
			,root:		'data'
			,baseParams:{xtable:'company'}
			,fields: [
				{name: 'company_id', type: 'int'}
				,{name: 'company_name'}
			]
		});
//
// Create Project Form
//
		var projectForm = new Ext.form.FormPanel({
			frame: false
			,border: false,
			,reader: new Ext.data.JsonReader({
				root: 'data'
			}
			,Ext.data.Record.create([
                {name: 'project_id', mapping: 'project_id',sortDir: 'ASC', sortType: 'asInt'}
                ,{name: 'project_name', mapping: 'project_name'}
                ,{name: 'project_num', mapping: 'project_num',sortDir: 'ASC', sortType: 'asInt'}
                ,{name: 'company_id', mapping: 'company_id'}
                ,{name: 'company_name', mapping: 'company_name'}
                ,{name: 'project_startdate', mapping: 'project_startdate', type: 'date', dateFormat: 'Y-m-d'}
                ,{name: 'project_enddate', mapping: 'project_enddate', type: 'date', dateFormat: 'Y-m-d'}
                ,{name: 'project_cost', mapping: 'project_cost'}
			])
			)
			,url: 'addprojects-form.php'
			,borders: true
			,defaultType: 'textfield'
			,bodyStyle: Ext.isIE ? 'padding:0 0 5px 5px;' : 'padding:5px 5px;'
			,labelWidth: 120
			,style: {
				//"margin-left": "10px",
				// when you add custom margin in IE 6...
				//"margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0" // you have to adjust for it somewhere else
			} 
			items: [{
				,xtype: 'fieldset'
				,title: 'Project Details'
				,autoHeight: true
				,autoWidth: true
				,labelWidth: 120
				,items: [
					{xtype: 'textfield' ,fieldLabel: 'Project Name' ,name: 'project_name' }
					,{ xtype: 'textfield', fieldLabel: 'Project Number', name: 'project_num' }
					,{ xtype: 'textfield', fieldLabel: 'Project Initials', name: 'project_initials' }
					,{ xtype: 'textfield', fieldLabel: 'Company Name', name: 'company_name'}
					,{ xtype: 'datefield', fieldLabel: 'Start Date', name: 'project_startdate' }
					,{ xtype: 'datefield', fieldLabel: 'End Date', name: 'project_enddate' }
					,{ xtype: 'textfield', fieldLabel: 'Est. Cost', name: 'project_cost' }
				]
			}]
			,buttons: [
				{ text: 'Save'
					,handler: function () {
						addprojectForm.getForm().submit({
							waitMsg: 'Saving...'
							,url:'addproject-form.php?action=insert'
							,success: function () {
								Ext.MessageBox.alert('Message', 'Data has been saved'); // clear the form
							},
							,failure: function () {
								Ext.MessageBox.alert('Message', 'Saving data failed');
							}
						});
					}
				}
				,{ text: 'Cancel', handler: function () {
						addprojectForm.getForm().reset();
						addServerWin.close();
					}
				}
			] // end buttons
		}); // end projectform
	}); // end function createprojectform

	var loadMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
	setTimeout(function(){
			Ext.get('loading').remove();
			Ext.get('loading-mask').fadeOut({remove:true});
	}, 250);

//
// Data Store for Projects
//
        var projectRecord = Ext.data.Record.create([
                {name: 'project_id', mapping: 'project_id',sortDir: 'ASC', sortType: 'asInt'},
                {name: 'project_name', mapping: 'project_name'},
                {name: 'project_num', mapping: 'project_num',sortDir: 'ASC', sortType: 'asInt'},
                {name: 'company_id', mapping: 'company_id'},
                {name: 'company_name', mapping: 'company_name'},
                {name: 'project_startdate', mapping: 'project_startdate', type: 'date', dateFormat: 'Y-m-d'},
                {name: 'project_enddate', mapping: 'project_enddate', type: 'date', dateFormat: 'Y-m-d'},
                {name: 'project_cost', mapping: 'project_cost'}
        ]);
        var projectsReader = new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                id:'project_id'
        },projectRecord
        );
        var projectsDS = new Ext.data.GroupingStore({
		id: 'projectsDS',
                proxy: new Ext.data.HttpProxy({
                        url: 'grid-reconfigure.php',
                        method: 'POST'
                }),
                baseParams: {task:'readProjects',xtable: 'project'},
                reader: projectsReader,
		sortInfo:{field: 'project_id', direction:'ASC'},
		groupField: 'company_name'
        });
        function handleDelete() {
            var selectedKeys = grid.selModel.selections.keys; //returns array of selected rows ids only
            if(selectedKeys.length > 0)
            {
                Ext.MessageBox.confirm('Message','Do you really want to delete this project?', deleteRecord);
            }
            else
            {
                Ext.MessageBox.alert('Message','Please select a project to delete');
            }//end if/else block
        }; // end handleDelete 
	function refreshGrid() {
		projectsDS.reload();
	}
        function updateDB(oGrid_Event) {
            
            /*Do we need to disable a new record from further editing while the first request
              is being made since the record may not have the new companyID in time
              to use to properly handle other updates of the same record? 
              
              Dates come through as an object instead of a string or numerical
              value, so do a check to prep the new value for transfer to the
              server side script*/
            if (oGrid_Event.value instanceof Date)
            {   //format the value for easy insertion into MySQL
                var fieldValue = oGrid_Event.value.format('Y-m-d');
            } else
            {
                var fieldValue = oGrid_Event.value;
            }    
                    
            //submit to server
            Ext.Ajax.request( //alternative to Ext.form.FormPanel? or Ext.BasicForm
                {   //specify options (note success/failure below that receives these same options)
                    waitMsg: 'Saving changes...',
                    //url where to send request
                    url: 'grid-reconfigure.php', //url to server side script
                    //method: 'POST', //if specify params default is 'POST' instead of 'GET'
                    params: { //these will be available via $_POST or $_REQUEST:
                        task: "update", //pass task to do to the server script
			xtable: 'projects',
                        keyID: oGrid_Event.record.data.project_id,//for existing records this is the unique id (we need this one to relate to the db)
                                                                 //we'll check this server side to see if it is a new record                    
                     //   bogusID: oGrid_Event.record.id,//for new records Ext creates a number here unrelated to the database
                     //   newRecord: isNewRecord,//pass the new Record status indicator to server for special handling
                        field: oGrid_Event.field,//the column name
                        value: fieldValue,//the updated value
                        originalValue: oGrid_Event.record.modified//the original value (oGrid_Event.orginalValue does not work for some reason)
                                                                  //this might(?) be a way to 'undo' changes other than by cookie?
                                                                  //when the response comes back from the server can we make an undo array?                         
                    },//end params
                    //the function to be called upon failure of the request (404 error etc, NOT success=false)
                    failure:function(response,options){
                        Ext.MessageBox.alert('Warning','Oops...');
                        //ds.rejectChanges();//undo any changes
                    },//end failure block                                      
                    success:function(response,options){
			projectDS=Ext.getCmp('projectDS');
                        //Ext.MessageBox.alert('Success','Yeah...');
                        if(oGrid_Event.record.data.project_id == ''){
                            var responseData = Ext.util.JSON.decode(response.responseText);//passed back from server
                            var newID = responseData.newID;//extract the ID provided by the server
                            //oGrid_Event.record.id = newID;
                            oGrid_Event.record.set('newRecord','no');//reset the indicator since update succeeded
                            oGrid_Event.record.set('project_id',newID);//assign the id to the record
                            //note the set() calls do not trigger everything since you may need to update multiple fields for example
                            //so you still need to call commitChanges() to start the event flow to fire things like refreshRow()
                            projectDS.commitChanges();//commit changes (removes the red triangle which indicates a 'dirty' field)
                            //var whatIsTheID = oGrid_Event.record.modified;
                        } else {
                            projectDS.commitChanges();//commit changes (removes the red triangle which indicates a 'dirty' field)
                        }
                    }//end success block                                      
                 }//end request config
            ); //end request  
        }; //end updateDB 
        function handleEdit(editEvent) {
            var gridField = editEvent.field;//determine what column is being edited
            updateDB(editEvent);//start the process to update the db with cell contents
            
            //I don't want to wait for server update to update the Total Column
            if (gridField == 'price'){
                getTax(editEvent);//start the process to update the Tax Field
            }
        }
        function addRecord() {
            var r = new projectRecord({
                //specify default values
                project_id: '',
                project_num: '',
                company_name: '',
                project_name: '',
                project_startdate: (new Date()).clearTime(),
                project_enddate: (new Date()).clearTime(),
                project_cost: 0
                //newRecord:'yes',//use this to trigger special handling when updating
                //id: 0//this is not helpful, 
            });
            projectsGrid.stopEditing();//stops any acitve editing
            projectsDS.insert(0, r); //1st arg is index,
                             //2nd arg is Ext.data.Record[] records
            //very similar to ds.add, with ds.insert we can specify the insertion point
            projectsGrid.startEditing(0, 1);//starts editing the specified rowIndex, colIndex
                                    //make sure you pick an editable location in the line above
                                    //otherwise it won't initiate the editor
        }; // end addRecord 
//
// create editors
//
// Money Renderer
        var money = function (val){
                return Ext.util.Format.number(val, '$?0,000.00?');
        }

        var projectname_edit = new Ext.form.TextField({
		emptyText: 'Project Name...'
	});
        var projectcost_edit = new Ext.form.TextField({
		emptyText: 'Project Cost...'
	});
        var projectnum_edit = new Ext.form.TextField({
		emptyText: 'Project Number...'
	});
        var project_startdate_edit = new Ext.form.DateField({ format: 'Y-m-d'});
        var project_enddate_edit = new Ext.form.DateField({ format: 'Y-m-d'});
	var companyedit = new Ext.form.ComboBox({
		name: 'companyedit',
		triggerAction: 'all',
		typeAhead: true,
		store: companyStore,
		selectOnFocus: true,
		emptyText: '',
		displayField: 'company_name',
		hiddenName: 'company_id',
		forceSelection: true,
		labelSeparator: null,
		listClass: 'x-combo-list-small',
		lazyRender: false,
		allowBlank: false
	});
	comboRenderer = function(combo){
		return function(value){
			combo.store.clearFilter();
			var record = combo.findRecord(combo.valueField || combo.displayField, value);
			return record ? record.get(combo.displayField) : combo.valueNotFoundText;
		}
	};

//
// Create column models to display the various grids
//
        var projectsColumnModel = new Ext.grid.ColumnModel([
           { header: "ID", width: 30, dataIndex: 'project_id', sortable: true, hidden: true},
           { header: "Project Number", width: 40, dataIndex: 'project_num', editor: projectnum_edit, sortable: true, hidden: false },
           { header: "Company", width: 90, dataIndex: 'company_name', editor: companyedit, sortable: true, hidden: false},
           { header: 'Project Name', width: 130, dataIndex: 'project_name', editor: projectname_edit, sortable: true, hidden: false },
           { header: "Start Date", width: 50, type: 'date', renderer: Ext.util.Format.dateRenderer('Y-m-d'), dataIndex: 'project_startdate', editor: project_startdate_edit, sortable: true, hidden: false },
           { header: "End Date", width: 50, type: 'date', renderer: Ext.util.Format.dateRenderer('Y-m-d'), dataIndex: 'project_enddate', editor: project_enddate_edit, sortable: true, hidden: false },
           { header: "Est. Cost", align: 'right', width: 60, dataIndex: 'project_cost', editor: projectcost_edit, renderer: money, sortable: true, hidden: false }
        ]);

        var projectsGrid = new Ext.grid.EditorGridPanel({
	   loadMask: true,
	   stripeRows: true,
	   border: false,
           cellclick: function()
           {
                var record = projectsGrid.getStore().getAt(rowIndex); //get the record
                var fieldName = projectsGrid.getColumnModel().getDataIndex(columnIndex);//get field name
                var data = record.get(fieldName);
                Ext.MessageBox.alert('title','inside function');
                   //title: 'My Title Here',
                   //msg: 'outside the function...'
                   //fn: myCallBackFunction,//the callback function after the msg box is closed
                   //scope:this//scope of callback function   
           },
	   autoWidth: false,
	   autoScroll: true,
           clickstoEdit: 1,
           sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
	   autoHeight: true,
           store: projectsDS,
           cm: projectsColumnModel,
	   trackMouseOver: true,
           bbar: new Ext.PagingToolbar({
                pageSize: 300,
                store: projectsDS,
                displayInfo: true,//default is false (to not show displayMsg)
                displayMsg: 'Displaying Projects {0} - {1} of {2}',
                emptyMsg: "No data to display"//display message when no records found
           }),
           tbar: [
                {
                    text: 'Add Project',
                    tooltip: 'Click to Add a row',
                    iconCls:'add', //we create our own css with a class called 'add'
                    handler: addRecord //what happens when user clicks on it
                }, '-', //add a separator
                {
                    text: 'Delete Selected',
                    tooltip: 'Click to Delete selected row(s)',
                    handler: handleDelete, //what happens when user clicks on it
                    iconCls:'del' //we create our own css with a class called 'add'
                }, '-', //add a separator
                {
                    text: 'Refresh',
                    tooltip: 'Click to Refresh the table',
                    handler: refreshGrid, //what happens when user clicks on it
                    iconCls:'reload' //we create our own css with a class called 'add'
                },
                {xtype: 'tbseparator'},
                {
// Dump to PDF
// TODO: Figure out how to dump the entire datastore - not just what's in the client-side grid.
                        xtype: 'button',
			text: 'Print',
                        id: 'downloadpdf',
                        tooltip: 'Print Projects Report',
                        icon: 'images/icons/printer.png',
                        enableKeyEvents:true,
                        handler: basic_printGrid
                },

		'-',
		{
				 xtype:'trigger'
				,triggerClass:'x-form-clear-trigger'
				,onTriggerClick:function() {
					this.setValue('');
					projectsDS.clearFilter();
				}
				,id:'projectsfilter'
				,enableKeyEvents:true
				,listeners:{
					keyup:{buffer:150, fn:function(field, e) {
						if(Ext.EventObject.ESC == e.getKey()) {
							field.onTriggerClick();
						}
						else {
							var val = this.getRawValue();
							var re = new RegExp('%' + val + '%');
							projectsDS=Ext.getCmp('projectsDS');
							projectsDS.clearFilter();
							projectsDS.filter('project_name', val,true,false);
						}
					}}
				}

		}
            ],
            view: new Ext.grid.GroupingView({
                forceFit:true,
		emptyText: 'No Projects to Display',
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
            }) 
        });
        projectsDS.load();
        projectsGrid.addListener('afteredit', handleEdit);//give event name, handler (can use 'on' shorthand for addListener) 

        var viewport = new Ext.Viewport({
                stateId:'viewport-stateid',
                stateful:true,
                layout: 'border',
                defaults: {
                        collapsible: false,
                        split: true
                },
                items: [
                        {
                                title: '',
                                region: 'north',
                                autoHeight: true,
                                border: false,
                                margins:'0 0 5 0',
                                frame: false
                        },{
                                 region:'center'
                                ,id:'centerpanel'
				,layout: 'fit'
				,frame:false
				,border:false
				,autoScroll:true
                                ,border:true
                                ,items: [projectsGrid]
                        },
                        {
                                id: 'east'
				,title: ''
                                ,collapsible: true
                                ,region: 'east'
                                ,width: 300
				,items: [addprojectForm]
                        }

                ]
        });
	function basic_printGrid(){
                global_printer = new Ext.grid.XPrinter({
                        grid: projectsGrid,  // grid object
                        pathPrinter:'./printer',         // relative to where the Printer folder resides
                        //logoURL: 'ext_logo.jpg', // relative to the html files where it goes the base printing
                        pdfEnable: true,  // enables link PDF printing (only save as)
                        hasrowAction:false,
                        localeData:{
                                Title:'Wall Systems Supply',
                                subTitle:'Payroll and Scheduling Systems - Projects Report',
                                footerText:'&copy 2010 - Wall Systems Supply, Priviledged and Confidential Information',
                                pageNo:'Page # ',       //page label
                                printText:'Print',  //print document action label
                                closeText:'Close',  //close window action label
                                pdfText:'PDF'},
                        useCustom:{  // in this case you leave null values as we dont use a custom store and TPL
                                custom:false,
                                customStore:null,
                                columns:[],
                                alignCols:[],
                                pageToolbar:null,
                                useIt: false,
                                showIt: false,
                                location: 'bbar'
                        },
                        showdate:true,// show print date
                        showdateFormat:'Y-F-d H:i:s', //
                        showFooter:true,  // if the footer is shown on the pinting html
                        styles:'default' // wich style youre gonna use
                });
                global_printer.prepare(); // prepare the document
	};
}(); 
//
// Start the Show
//
	Ext.onReady(WSSApp.projects.init, WSSApp.projects, true);
	        Ext.QuickTips.init();
	};


var global_printer = null;  // it has to be on the index page or the generator page  always
function printmygridGO(obj){  global_printer.printGrid(obj);    }
function printmygridGOcustom(obj){ global_printer.printCustom(obj);     }
Ext.ns('Application');
Ext.onReady(function () {
	Ext.QuickTips.init();
//
// Data store for Company - used by combobox in grid
//
	var companyStore = new Ext.data.JsonStore({
		id: 'companyStore',
		url: 'data.php',
		root: 'results',
		baseParams:{xtable:'company',task:'getCompany'},
		fields: [
			{name: 'company_id', type: 'int'},
			{name: 'company_name'}
		]
	});
//
// Data Store for Company
//
        var companyRecord = Ext.data.Record.create([
                {name: 'company_id', mapping: 'company_id'},
                {name: 'company_name', mapping: 'company_name'}
        ]);
        var companyReader = new Ext.data.JsonReader({
                root: 'results',
                totalProperty: 'total',
                id:'company_id'
        },companyRecord
        );
        companyDS = new Ext.data.GroupingStore({
				id: 'companyDS',
                proxy: new Ext.data.HttpProxy({
                        url: 'data.php',
                        method: 'POST'
                }),
                baseParams: {task:'getCompany',xtable: 'company', start: 0, limit: 10000},
                reader: companyReader,
				sortInfo:{field: 'company_id', direction:'ASC'}
        });
		function deleteRecord(btn) {
			if(btn=='yes') {
				var selectedKeys = companyGrid.selModel.selections.keys;
				Ext.Ajax.request({
					waitMsg: 'Saving changes...',
					url: 'data.php',
					params: {
						task: 'delete',
						xkey: 'company_id',
						xtable: 'company',
						xid: selectedKeys 
					},
					callback: function (options, success, response) {
						if (success) {
							Ext.MessageBox.alert('OK',response.responseText);
							var json = Ext.util.JSON.decode(response.responseText);
							Ext.MessageBox.alert('OK',json.del_count + ' record(s) deleted.');
						} else{
							Ext.MessageBox.alert('Sorry, please try again. [Q304]',response.responseText);
						}
					},
					failure:function(response,options){
						Ext.MessageBox.alert('Warning','Oops...');
					},
					success:function(response,options){
						refreshGrid();
					}
				});
			}
		};				
        function handleDelete() {
            var selectedKeys = companyGrid.selModel.selections.keys; //returns array of selected rows ids only
            if(selectedKeys.length > 0)
            {
                Ext.MessageBox.confirm('Message','Do you really want to delete this company?', deleteRecord);
            }
            else
            {
                Ext.MessageBox.alert('Message','Please select a company to delete');
            }//end if/else block
        }; // end handleDelete 
		function refreshGrid() {
			companyDS.reload();
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
                var fieldValue = oGrid_Event.value.format('Y-m-d H:i:s');
            } else
            {
                var fieldValue = oGrid_Event.value;
            }    
                    
            //submit to server
            Ext.Ajax.request( //alternative to Ext.form.FormPanel? or Ext.BasicForm
                {   //specify options (note success/failure below that receives these same options)
                    waitMsg: 'Saving changes...',
                    //url where to send request
                    url: 'data.php', //url to server side script
                    //method: 'POST', //if specify params default is 'POST' instead of 'GET'
                    params: { //these will be available via $_POST or $_REQUEST:
                        task: "update", //pass task to do to the server script
                        //key: company_id,//pass to server same 'id' that the reader used
						xtable: 'company',
                        keyID: oGrid_Event.record.data.company_id,//for existing records this is the unique id (we need this one to relate to the db)
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
                        //Ext.MessageBox.alert('Success','Yeah...');
                        if(oGrid_Event.record.data.company_id == ''){
                            var responseData = Ext.util.JSON.decode(response.responseText);//passed back from server
                            var newID = responseData.newID;//extract the ID provided by the server
                            //oGrid_Event.record.id = newID;
                            oGrid_Event.record.set('newRecord','no');//reset the indicator since update succeeded
                            oGrid_Event.record.set('company_id',newID);//assign the id to the record
                            //note the set() calls do not trigger everything since you may need to update multiple fields for example
                            //so you still need to call commitChanges() to start the event flow to fire things like refreshRow()
                            companyDS.commitChanges();//commit changes (removes the red triangle which indicates a 'dirty' field)
                            //var whatIsTheID = oGrid_Event.record.modified;
                        } else {
                            companyDS.commitChanges();//commit changes (removes the red triangle which indicates a 'dirty' field)
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
            var r = new companyRecord({
                //specify default values
                company_id: '',
                company_name: ''
            });
            companyGrid.stopEditing();//stops any acitve editing
            companyDS.insert(0, r); //1st arg is index,
                             //2nd arg is Ext.data.Record[] records
            //very similar to ds.add, with ds.insert we can specify the insertion point
            companyGrid.startEditing(0, 1);//starts editing the specified rowIndex, colIndex
                                    //make sure you pick an editable location in the line above
                                    //otherwise it won't initiate the editor
        }; // end addRecord 
//
// create editors
//
        var companyname_edit = new Ext.form.TextField();
//
// Create column models to display the various grids
//
        var companyColumnModel = new Ext.grid.ColumnModel([
           { header: "ID", width: 20, dataIndex: 'company_id', sortable: true, hidden: false },
           { header: "Company Name", width: 190, dataIndex: 'company_name', editor: companyname_edit, sortable: true, hidden: false }
        ]);


		var companyGrid = new Application.WSSGrid({
			autoScroll: true,
			loadMask: true,
			stripeRows: true,
			cellclick: function()
			{
                var record = companyGrid.getStore().getAt(rowIndex); //get the record
                var fieldName = companyGrid.getColumnModel().getDataIndex(columnIndex);//get field name
                var data = record.get(fieldName);
                Ext.MessageBox.alert('title','inside function');
                   //title: 'My Title Here',
                   //msg: 'outside the function...'
                   //fn: myCallBackFunction,//the callback function after the msg box is closed
                   //scope:this//scope of callback function   
			},
			autoWidth: true,
			clickstoEdit: 1,
			sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			//autoHeight: true,
			height: 300,
			store: companyDS,
			cm: companyColumnModel,
			border: false,
			autoExpandColumn: 'Name',
			trackMouseOver: true,
           tbar: [
                {
                    text: 'Add Company',
                    tooltip: 'Click to Add a row',
                    iconCls:'company_add', //we create our own css with a class called 'add'
                    handler: addRecord //what happens when clicks on it
                }, '-', //add a separator
                {
                    text: 'Delete Selected',
                    tooltip: 'Click to Delete selected row(s)',
                    handler: handleDelete, //what happens when user clicks on it
                    iconCls:'company_delete' //we create our own css with a class called 'add'
                }, '-', //add a separator
                {
                    text: 'Refresh',
                    tooltip: 'Click to Refresh the table',
                    handler: refreshGrid, //what happens when user clicks on it
                    iconCls:'reload' //we create our own css with a class called 'add'
                },
		'-',
		{
				 xtype:'trigger'
				,triggerClass:'x-form-clear-trigger'
				,onTriggerClick:function() {
					this.setValue('');
					companyDS.clearFilter();
				}
				,id:'companyfilter'
				,enableKeyEvents:true
				,listeners:{
					keyup:{buffer:150, fn:function(field, e) {
					if(Ext.EventObject.ESC == e.getKey()) {
						field.onTriggerClick();
					}
					else {
						var val = this.getRawValue();
						var re = new RegExp('%' + val + '%');
						companyDS.clearFilter();
						companyDS.filter('company_name', val,true,false);
					}
					}}
				}

		},'-',{
				xtype: 'button',
				text: 'Print',
                        id: 'downloadpdf',
                        tooltip: 'Print Projects Report',
                        icon: 'images/icons/printer.png',
                        enableKeyEvents:true,
                        handler: basic_printGrid
                }

            ],
            //this is the key to showing the GroupingStore
            view: new Ext.grid.GroupingView({
                forceFit:true,
                //custom grouping text template to display the number of items per group
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
            }) /**/

        });
        companyDS.load();
        companyGrid.addListener('afteredit', handleEdit);//give event name, handler (can use 'on' shorthand for addListener) 

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
							region:'center'
							,id:'centerpanel'
							,layout: 'fit'
							,frame:false
							,border:false
							,autoScroll:true
							,border:true
							,items: [companyGrid]
                        }

                ]
        });

    function basic_printGrid(){
                global_printer = new Ext.grid.XPrinter({
                        grid: companyGrid,  // grid object
                        pathPrinter:'./printer',         // relative to where the Printer folder resides
                        //logoURL: 'ext_logo.jpg', // relative to the html files where it goes the base printing
                        pdfEnable: true,  // enables link PDF printing (only save as)
                        hasrowAction:false,
                        localeData:{
                                Title:'Wall Systems Supply',
                                subTitle:'Payroll and Scheduling Systems - Company Report',
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

});

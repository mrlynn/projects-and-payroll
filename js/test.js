/**
 * Editor Grid for Projects - Part of Wall Systems Supply Payroll and Scheduling System
 * Interacts with server side php/MySQL
 * January 18, 2007
 * Michael Lynn <merlynn@gmail.com>
 */
//
// Setup printing options
//
var global_printer = null; // it has to be on the index page or the generator page  always


function printmygridGO(obj) {
    global_printer.printGrid(obj);
}

function printmygridGOcustom(obj) {
    global_printer.printCustom(obj);
}
Ext.ns('Application');
Ext.onReady(function () {
    Ext.QuickTips.init();
    var loadMask = new Ext.LoadMask(Ext.getBody(), {
        msg: "Please wait..."
    });
    setTimeout(function () {
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove: true
        });
    },
    250);
    // 
    // Setup Datastores
    //
    var companyStore = new Ext.data.JsonStore({
        id: 'companyStore',
        url: 'data.php',
        root: 'results',
        baseParams: {
            task: 'getCompany',
            xtable: 'company',
            start: 0,
            limit: 1000
        },
        fields: [{
            name: 'company_id',
            type: 'int'
        },
        {
            name: 'company_name'
        }]
    });

    //
    // Data Store for Projects
    //
    var projectRecord = Ext.data.Record.create([{
        name: 'project_id',
        mapping: 'project_id',
        sortDir: 'ASC',
        sortType: 'asInt'
    },
    {
        name: 'project_name',
        mapping: 'project_name'
    },
    {
        name: 'project_num',
        mapping: 'project_num',
        sortDir: 'ASC',
        sortType: 'asInt'
    },
    {
        name: 'company_id',
        mapping: 'company_id'
    },
    {
        name: 'company_name',
        mapping: 'company_name'
    },
    {
        name: 'project_startdate',
        mapping: 'project_startdate',
        type: 'date',
        dateFormat: 'Y-m-d'
    },
    {
        name: 'project_enddate',
        mapping: 'project_enddate',
        type: 'date',
        dateFormat: 'Y-m-d'
    },
    {
        name: 'project_cost',
        mapping: 'project_cost'
    },
    {
        name: 'labor_cost',
        mapping: 'labor_cost'
    }]);
    var projectsReader = new Ext.data.JsonReader({
        root: 'results',
        totalProperty: 'total',
        id: 'project_id'
    },
    projectRecord);
    projectsDS = new Ext.data.GroupingStore({
        id: 'projectsDS',
        proxy: new Ext.data.HttpProxy({
            url: 'data.php',
            method: 'POST'
        }),
        baseParams: {
            task: 'showProjects',
            xtable: 'project',
            start: 0,
            limit: 10000
        },
        reader: projectsReader,
        sortInfo: {
            field: 'company_id',
            direction: 'DSC'
        },
        groupField: 'company_name'
    });

    function handleDelete() {
        var selectedKeys = projectsgrid.selModel.selections.keys; //returns array of selected rows ids only
        if (selectedKeys.length > 0) {
            Ext.MessageBox.confirm('Message', 'Do you really want to delete this project?', deleteRecord);
        } else {
            Ext.MessageBox.alert('Message', 'Please select a project to delete');
        } //end if/else block
    }; // end handleDelete 


    function refreshGrid() {
        projectsDS.reload();
    }

    function updateDB(oGrid_Event) {
        if (oGrid_Event.value instanceof Date) { //format the value for easy insertion into MySQL
            var fieldValue = oGrid_Event.value.format('Y-m-d');
        } else {
            var fieldValue = oGrid_Event.value;
        }
        Ext.Ajax.request( //alternative to Ext.form.FormPanel? or Ext.BasicForm
        { //specify options (note success/failure below that receives these same options)
            waitMsg: 'Saving changes...',
            //url where to send request
            url: 'data.php',
            //url to server side script
            //method: 'POST', //if specify params default is 'POST' instead of 'GET'
            params: { //these will be available via $_POST or $_REQUEST:
                task: "updateProject",
                //pass task to do to the server script
                xtable: 'projects',
                keyID: oGrid_Event.record.data.project_id,
                //for existing records this is the unique id (we need this one to relate to the db)
                //we'll check this server side to see if it is a new record                    
                //   bogusID: oGrid_Event.record.id,//for new records Ext creates a number here unrelated to the database
                //   newRecord: isNewRecord,//pass the new Record status indicator to server for special handling
                field: oGrid_Event.field,
                //the column name
                value: fieldValue,
                //the updated value
                originalValue: oGrid_Event.record.modified //the original value (oGrid_Event.orginalValue does not work for some reason)
                //this might(?) be a way to 'undo' changes other than by cookie?
                //when the response comes back from the server can we make an undo array?                         
            },
            //end params
            //the function to be called upon failure of the request (404 error etc, NOT success=false)
            failure: function (response, options) {
                Ext.MessageBox.alert('Warning', 'Oops...');
                //ds.rejectChanges();//undo any changes
            },
            //end failure block                                      
            success: function (response, options) {
                //Ext.MessageBox.alert('Success','Yeah...');
                if (oGrid_Event.record.data.project_id == '') {
                    var responseData = Ext.util.JSON.decode(response.responseText); //passed back from server
                    var newID = responseData.newID; //extract the ID provided by the server
                    //oGrid_Event.record.id = newID;
                    oGrid_Event.record.set('newRecord', 'no'); //reset the indicator since update succeeded
                    oGrid_Event.record.set('project_id', newID); //assign the id to the record
                    //note the set() calls do not trigger everything since you may need to update multiple fields for example
                    //so you still need to call commitChanges() to start the event flow to fire things like refreshRow()
                    projectsDS.commitChanges(); //commit changes (removes the red triangle which indicates a 'dirty' field)
                    //var whatIsTheID = oGrid_Event.record.modified;
                } else {
                    projectsDS.commitChanges(); //commit changes (removes the red triangle which indicates a 'dirty' field)
                }
            } //end success block                                      
        } //end request config
        ); //end request  
    }; //end updateDB 


    function handleEdit(editEvent) {
        var gridField = editEvent.field; //determine what column is being edited
        if (gridField == 'company_name') {
            var r = companyEdit.findRecord('company_name', editEvent.value);
            editEvent.record.set('company_id', r ? r.get('company_id') : null);
        };
        updateDB(editEvent); //start the process to update the db with cell contents
        //I don't want to wait for server update to update the Total Column
        if (gridField == 'price') {
            getTax(editEvent); //start the process to update the Tax Field
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
        projectsGrid.stopEditing(); //stops any acitve editing
        projectsDS.insert(0, r); //1st arg is index,
        //2nd arg is Ext.data.Record[] records
        //very similar to ds.add, with ds.insert we can specify the insertion point
        projectsGrid.startEditing(0, 1); //starts editing the specified rowIndex, colIndex
        //make sure you pick an editable location in the line above
        //otherwise it won't initiate the editor
    }; // end addRecord 
    //
    // create editors
    //
    // Money Renderer
    var money = function (val) {
        return Ext.util.Format.number(val, '$?0,000.00?');
    }
    var labor_money = function (val) {
        // eventually change this to shade values over project cost in red.
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
    var project_startdate_edit = new Ext.form.DateField({
        format: 'Y-m-d'
    });
    var project_enddate_edit = new Ext.form.DateField({
        format: 'Y-m-d'
    });
    var companyEdit = new Ext.form.ComboBox({
        id: 'companyEdit',
        triggerAction: 'all',
        //typeAhead: false,
        store: companyStore,
        //selectOnFocus: true,
        //emptyText: 'Select Company...',
        displayField: 'company_name',
        valueField: 'company_id',
        hiddenName: 'company_id',
        //forceSelection: true,
        labelSeparator: null,
        listClass: 'x-combo-list-small',
        //lazyRender: true,
        allowBlank: false
    });
    Ext.util.Format.comboRenderer = function (combo) {
        return function (value) {
            console.log(value);
            var record = combo.findRecord(combo.valueField, value);
            return record ? record.get(combo.displayField) : combo.valueNotFoundText;
        }
    }


    //
    // Create column models to display the various grids
    //
    var projectsColumnModel = new Ext.grid.ColumnModel([{
        header: "ID",
        width: 30,
        dataIndex: 'project_id',
        sortable: true,
        hidden: true
    },
    {
        header: "Project Number",
        width: 48,
        dataIndex: 'project_num',
        editor: projectnum_edit,
        sortable: true,
        hidden: false
    },
    {
        header: "Company",
        width: 90,
        dataIndex: 'company_name',
        editor: companyEdit,
        sortable: true,
        hidden: false
    },
    {
        header: 'Project Name',
        width: 130,
        dataIndex: 'project_name',
        editor: projectname_edit,
        sortable: true,
        hidden: false
    },
    {
        header: "Start Date",
        width: 50,
        type: 'date',
        renderer: Ext.util.Format.dateRenderer('Y-m-d'),
        dataIndex: 'project_startdate',
        editor: project_startdate_edit,
        sortable: true,
        hidden: false
    },
    {
        header: "End Date",
        width: 50,
        type: 'date',
        renderer: Ext.util.Format.dateRenderer('Y-m-d'),
        dataIndex: 'project_enddate',
        editor: project_enddate_edit,
        sortable: true,
        hidden: false
    },
    {
        header: "Est. Cost",
        align: 'right',
        width: 60,
        dataIndex: 'project_cost',
        editor: projectcost_edit,
        renderer: money,
        sortable: true,
        hidden: false
    },
    {
        header: "Labor To Date",
        align: 'right',
        width: 60,
        dataIndex: 'labor_cost',
        renderer: labor_money,
        sortable: true,
        hidden: false
    }]);

    var projectsGrid = new Application.WSSGrid({
        cellclick: function () {
            var record = projectsGrid.getStore().getAt(rowIndex); //get the record
            var fieldName = projectsGrid.getColumnModel().getDataIndex(columnIndex); //get field name
            var data = record.get(fieldName);
            Ext.MessageBox.alert('title', 'inside function');
            //title: 'My Title Here',
            //msg: 'outside the function...'
            //fn: myCallBackFunction,//the callback function after the msg box is closed
            //scope:this//scope of callback function   
        },
        store: projectsDS,
        cm: projectsColumnModel,
        bbar: new Ext.PagingToolbar({
            pageSize: 300,
            store: projectsDS,
            displayInfo: true,
            //default is false (to not show displayMsg)
            displayMsg: 'Displaying Projects {0} - {1} of {2}',
            emptyMsg: "No data to display" //display message when no records found
        }),
        tbar: [{
            text: 'Add Project',
            tooltip: 'Click to Add a row',
            iconCls: 'project_add',
            //we create our own css with a class called 'add'
            handler: addRecord //what happens when user clicks on it
        },
        '-', //add a separator
        {
            text: 'Delete Selected',
            tooltip: 'Click to Delete selected row(s)',
            handler: handleDelete,
            //what happens when user clicks on it
            iconCls: 'project_delete' //we create our own css with a class called 'add'
        },
        '-', //add a separator
        {
            text: 'Refresh',
            tooltip: 'Click to Refresh the table',
            handler: refreshGrid,
            //what happens when user clicks on it
            iconCls: 'reload' //we create our own css with a class called 'add'
        },
        {
            xtype: 'tbseparator'
        },
        {
            // Dump to PDF
            // TODO: Figure out how to dump the entire datastore - not just what's in the client-side grid.
            xtype: 'button',
            text: 'Print',
            id: 'downloadpdf',
            tooltip: 'Print Projects Report',
            icon: 'images/icons/printer.png',
            enableKeyEvents: true,
            handler: basic_printGrid
        },

        '-', {
            xtype: 'trigger',
            triggerClass: 'x-form-clear-trigger',
            onTriggerClick: function () {
                this.setValue('');
                projectsDS.clearFilter();
            },
            id: 'projectsfilter',
            enableKeyEvents: true,
            listeners: {
                keyup: {
                    buffer: 150,
                    fn: function (field, e) {
                        if (Ext.EventObject.ESC == e.getKey()) {
                            field.onTriggerClick();
                        } else {
                            var val = this.getRawValue();
                            var re = new RegExp('%' + val + '%');
                            projectsDS.clearFilter();
                            projectsDS.filter('project_name', val, true, false);
                        }
                    }
                }
            }

        }],
	viewConfig: {emptyText: 'No Projects To Display'},
        view: new Ext.grid.GroupingView({
            forceFit: true,
            emptyText: 'No Projects to Display',
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
        })

    });
    projectsDS.load();
    projectsGrid.addListener('afteredit', handleEdit); //give event name, handler (can use 'on' shorthand for addListener) 
    var viewport = new Ext.Viewport({
        stateId: 'viewport-stateid',
        stateful: true,
        layout: 'border',
        defaults: {
            collapsible: false,
            split: true
        },
        items: [{
            title: '',
            region: 'north',
            autoHeight: true,
            border: false,
            margins: '0 0 5 0',
            frame: false
        },
        {
            region: 'center',
            id: 'centerpanel',
            layout: 'fit',
            frame: false,
            border: false,
            autoScroll: true,
            items: [projectsGrid]
        }
        //	},
        //{
        //id: 'east'
        //,title: ''
        //,collapsible: true
        //,region: 'east'
        //,width: 300
        ////,items: [addprojectForm]
        //,items: []
        //}
        ]
    });

    function basic_printGrid() {
        global_printer = new Ext.grid.XPrinter({
            grid: projectsGrid,
            // grid object
            pathPrinter: './printer',
            // relative to where the Printer folder resides
            //logoURL: 'ext_logo.jpg', // relative to the html files where it goes the base printing
            pdfEnable: true,
            // enables link PDF printing (only save as)
            hasrowAction: false,
            localeData: {
                Title: 'Wall Systems Supply',
                subTitle: 'Payroll and Scheduling Systems - Projects Report',
                footerText: '&copy 2010 - Wall Systems Supply, Priviledged and Confidential Information',
                pageNo: 'Page # ',
                //page label
                printText: 'Print',
                //print document action label
                closeText: 'Close',
                //close window action label
                pdfText: 'PDF'
            },
            useCustom: { // in this case you leave null values as we dont use a custom store and TPL
                custom: false,
                customStore: null,
                columns: [],
                alignCols: [],
                pageToolbar: null,
                useIt: false,
                showIt: false,
                location: 'bbar'
            },
            showdate: true,
            // show print date
            showdateFormat: 'Y-F-d H:i:s',
            //
            showFooter: true,
            // if the footer is shown on the pinting html
            styles: 'default' // wich style youre gonna use
        });
        global_printer.prepare(); // prepare the document
    };

});

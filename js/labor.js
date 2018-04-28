Date.patterns = {
    ISO8601Long:"Y-m-d H:i:s",
    ISO8601Short:"Y-m-d",
    ShortDate: "n/j/Y",
    LongDate: "l, F d, Y",
    FullDateTime: "l, F d, Y g:i:s A",
    MonthDay: "F d",
    ShortTime: "g:i A",
    LongTime: "g:i:s A",
    SortableDateTime: "Y-m-d\\TH:i:s",
    UniversalSortableDateTime: "Y-m-d H:i:sO",
    YearMonth: "F, Y"
};

Ext.onReady(function () {
    Ext.QuickTips.init();
	Ext.DatePicker.prototype.startDay = 4;
	Ext.apply(Ext.form.VTypes, {
        daterange : function(val, field) {
                var date = field.parseDate(val);

                if(!date){
                        return;
                }
                if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                        var start = Ext.getCmp(field.startDateField);
                        start.setMaxValue(date);
                        start.validate();
                        this.dateRangeMax = date;
                }
                else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                        var end = Ext.getCmp(field.endDateField);
                        end.setMinValue(date);
                        end.validate();
                        this.dateRangeMin = date;
                }
                /*
                 * Always return true since we're only using this vtype to set the
                 * min/max allowed values (these are tested for after the vtype test)
                 */
                return true;
        }
});


    //
    // Data store for Company - used by combobox in grid
    //
    var companyStore = new Ext.data.JsonStore({
		fieldLabel: 'Company',
        id: 'companyStore',
        url: 'data.php',
        root: 'results',
        baseParams: {
            xtable: 'company',
            task: 'getCompany',
			start: 0,
			limit: 100000
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
    // Data Store for Hours
    //
    var hourRecord = Ext.data.Record.create([{
        name: 'first_date',
        mapping: 'first_date'
    },
	{
        name: 'last_date',
        mapping: 'last_date'
    },
    {
        name: 'user_id',
        mapping: 'user_id'
    },
    {
        name: 'user_firstname',
        mapping: 'user_firstname'
    },
    {
        name: 'user_lastname',
        mapping: 'user_lastname'
    },
    {
        name: 'company_id',
        mapping: 'company_id'
    },
    {
        name: 'project_id',
        mapping: 'project_id'
    },
    {
        name: 'project_num',
        mapping: 'project_num'
    },
    {
        name: 'project_name',
        mapping: 'project_name'
    },
    {
        name: 'hours',
        mapping: 'hours'
    },
	{
		name: 'project_cost',
		mapping: 'project_cost'
	},
	{
		name: 'cost',
		mapping: 'cost'
	}
	]);
	//
	// Reader for Json Data - Hour table
	//
    var hourReader = new Ext.data.JsonReader({
        root: 'results',
        totalProperty: 'total',
        id: 'user_id'
    },
    hourRecord);
	// 
	// Grouping Store Timesheet data
	//
    //hourDS = new Ext.data.GroupingStore({
    hourDS = new Ext.data.GroupingStore({
        id: 'hourDS',
        proxy: new Ext.data.HttpProxy({
            url: 'data.php',
            method: 'POST'
        }),
        baseParams: {
            start: 0,
            limit: 10000,
            task: 'showLabor'
        },
        reader: hourReader,
        sortInfo: {
            field: 'first_date',
            direction: 'ASC'
        }
    });
    var gridsummary = new Ext.ux.grid.GridSummary();
    var groupsummary = new Ext.ux.grid.GroupSummary();


    //
    // Data Store for Company
    //
    var companyRecord = Ext.data.Record.create([{
        name: 'company_id',
        mapping: 'company_id'
    },
    {
        name: 'company_name',
        mapping: 'company_name'
    }]);
    var companyReader = new Ext.data.JsonReader({
        root: 'data',
        totalProperty: 'total',
        id: 'company_id'
    },
    companyRecord);
    companyDS = new Ext.data.GroupingStore({
        id: 'companyDS',
        proxy: new Ext.data.HttpProxy({
            url: 'grid-reconfigure.php',
            method: 'POST'
        }),
        baseParams: {
            task: 'readCompany',
            xtable: 'company'
        },
        reader: companyReader,
        sortInfo: {
            field: 'company_id',
            direction: 'ASC'
        }
    });

    function refreshGrid() {
        hourDS.reload();
    }

    //
    // Create column models to display the various grids
    //
function renderDate(value){    
	return Date.parseDate(value,"Y-m-d").format('m/d/Y');} 

    var hourColumnModel = new Ext.grid.ColumnModel([{
        header: "Employee First Name",
        width: 190,
        dataIndex: 'user_firstname',
        sortable: true,
        hidden: false
    },
    {
        header: "Employee Last Name",
        width: 190,
        dataIndex: 'user_lastname',
        sortable: true,
        hidden: false
    },
    {
        header: "Project Num",
        width: 120,
        dataIndex: 'project_num',
        sortable: true,
        hidden: false
    },
    {
        header: "Project",
        width: 190,
        dataIndex: 'project_name',
        sortable: true,
        hidden: false
    },
    {
        header: "First Date",
        width: 190,
        dataIndex: 'first_date',
        sortable: true
    },
    {
        header: "Last Date",
        width: 190,
        dataIndex: 'last_date',
        sortable: true
    },
    {
        header: "Hours",
        width: 150,
        dataIndex: 'hours',
        sortable: true,
		align: 'right',
        summaryType: 'sum',
        summaryRenderer: function(v, params, data){
            return ((v === 0 || v > 1) ? '(' + v +' Hours)' : '(1 Hour)');
        }

    },
    {
        header: "Labor Cost",
        width: 190,
        dataIndex: 'cost',
        sortable: true,
		align: 'right',
        summaryType: 'sum',
        summaryRenderer: Ext.util.Format.usMoney,
		renderer: Ext.util.Format.usMoney,
		grandTotal: true
    },
    {
        header: "Materials Cost",
        width: 190,
        dataIndex: 'project_cost',
        sortable: true,
		align: 'right',
		renderer: Ext.util.Format.usMoney,
        summaryType: 'average',
        summaryRenderer: Ext.util.Format.usMoney,
		grandTotal: true
    }
	]);

    var projectStore = new Ext.data.JsonStore({
        fieldLabel: 'project',
        id: 'projectStore',
        url: 'data.php',
        root: 'results',
        baseParams: {
            xtable: 'project',
            task: 'showProjects',
            start: 0,
            limit: 100000
        },
        fields: [{
            name: 'project_id',
            type: 'int'
        },
        {
            name: 'project_name'
        },
		{
			name: 'project_num'
		}]
    });
    var selectProject = function (value) {
        hourDS.baseParams.project_id = value.value;
    };
    var clearProject = function () {
        hourDS.baseParams.project_id = '';
    };


    var projectCombo = new Ext.form.ClearableComboBox({
		id: 'projectCombo',
        fieldLabel: 'Project',
        emptyText: '(All Projects)',
        displayField: 'project_name',
        valueField: 'project_id',
        forceSelection: true,
        typeAhead: true,
        mode: 'remote',
        store: 'projectStore',
        id: 'project_id',
        triggerAction: 'all',
        selectOnFocus: true,
        enableKeyEvents: true,
        listeners: {
            'select': selectProject,
            'cleared': clearProject,
            keyup: {
                buffer: 150,
                fn: function(field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    } else {
                        var val = this.getRawValue();
                        var re = new RegExp('%' + val + '%');
                        projectStore.clearFilter();
                        projectStore.filter('project_name',val, true, false);
                    }
                }
            }
        }
    });
    var startDate = new Ext.form.DateField({
        format: 'Y-m-d',
        fieldLabel: 'From Date',
        id: 'startDate',
        name: 'startDate',
        width: 140,
        allowBlank: false,
        vtype: 'daterange',
        emptyText: 'From Date...',
        endDateField: 'endDate'
        // id of the 'To' date field
    });

    var endDate = new Ext.form.DateField({
        format: 'Y-m-d',
        //YYYY-MMM-DD
        fieldLabel: 'To Date',
        id: 'endDate',
        name: 'endDate',
        width: 140,
        allowBlank: false,
        vtype: 'daterange',
        emptyText: 'To Date...',
        startDateField: 'startDate'
        // id of the 'From' date field
    });

    var hourGrid = new Ext.grid.GridPanel({
		id: 'hourGrid',
        plugins:[groupsummary,gridsummary],
        loadMask: true,
        stripeRows: true,
		border: false,
        cellclick: function () {
            var record = hourGrid.getStore().getAt(rowIndex); //get the record
            var fieldName = hourGrid.getColumnModel().getDataIndex(columnIndex); //get field name
            var data = record.get(fieldName);
        },
        autoWidth: true,
		autoScroll: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
		height: 400,
        store: hourDS,
        cm: hourColumnModel,
        border: false,
        autoExpandColumn: 'Name',
        trackMouseOver: true,
        tbar: [projectCombo,'-',startDate,endDate,
        { text: 'Generate Report',
            iconCls: 'go',
            xtype: 'button',
            handler: function() {
                //company_id = Ext.getCmp('company_id');
                //hourDS.baseParams.company_id = company_id.value;
                hourDS.baseParams.startDate=startDate.value;
                hourDS.baseParams.endDate=endDate.value;
                hourDS.baseParams.project_id=projectCombo.value;
                hourDS.load({params: {
                        start: 0,
                        limit: 90
                    }
                });
            }
        },'-',
        { text: 'Print',
	        icon: 'images/icons/printer.png',
            xtype: 'button',
            handler: function() {
				printWindow = window.open("data.php?print=1&task=showLabor&project_id="+projectCombo.value+"&startDate="+startDate.value+"&endDate="+endDate.Value,"newwin", "height=400, width: 600,toolbar=no,scrollbars=yes,menubar=yes");
            }
        },
        //'-',
        //{
            //text: 'Add Weekly Timesheet',
            //iconCls: 'clock_add',
            //handler: addWeeklyTimeSheet //what happens when clicks on it
        //},
        '-',
        {
            text: 'Refresh',
            tooltip: 'Click to Refresh the table',
            handler: refreshGrid,
            iconCls: 'reload' //we create our own css with a class called 'add'
        }],
        //this is the key to showing the GroupingStore
        view: new Ext.grid.GroupingView({
            forceFit: true,
            //custom grouping text template to display the number of items per group
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Entries" : "Entry"]})'
        })
        /**/

    });
    //companyDS.load(); // Don't load until a date range is selected
    var viewport = new Ext.Viewport({
        stateId: 'viewport-stateid',
        stateful: true,
        layout: 'border',
        defaults: {
            collapsible: false,
            split: true
        },
        items: [{
            region: 'center',
            id: 'centerpanel',
			layout: 'fit',
            autoScroll: true,
            frame: false,
            containerScroll: false,
            border: false,
            items: [hourGrid]
        }]
    });
});

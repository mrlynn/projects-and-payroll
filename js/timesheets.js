Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.DatePicker.prototype.startDay = 4;
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
    Ext.apply(Ext.form.VTypes, {
        daterange: function(val, field) {
            var date = field.parseDate(val);

            if (!date) {
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
        name: 'hour_id',
        mapping: 'hour_id'
    },
    {
        name: 'hour_date',
        mapping: 'hour_date'
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
        name: 'company_name',
        mapping: 'company_name'
    },
    {
        name: 'project_id',
        mapping: 'project_id'
    },
    {
        name: 'project_name',
        mapping: 'project_name'
    },
    {
        name: 'hour_num',
        mapping: 'hour_num'
    }]);
    //
    // Reader for Json Data - Hour table
    //
    var hourReader = new Ext.data.JsonReader({
        root: 'results',
        totalProperty: 'total',
        id: 'hour_id'
    },
    hourRecord);
    //
    // Grouping Store Timesheet data
    //
    hourDS = new Ext.data.GroupingStore({
        id: 'hourDS',
        proxy: new Ext.data.HttpProxy({
            url: 'data.php',
            method: 'POST'
        }),
        baseParams: {
            start: 0,
            limit: 10000,
            task: 'getTimesheets',
            xtable: 'hour'
        },
        reader: hourReader,
        sortInfo: {
            field: 'hour_date',
            direction: 'ASC'
        },
        groupField: ['hour_date']
    });

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
    function deleteRecord(btn) {
        hourGrid = Ext.getCmp('hourGrid');
        if (btn == 'yes') {
            var selectedKeys = hourGrid.selModel.selections.keys;
            Ext.Ajax.request({
                waitMsg: 'Saving changes...',
                url: 'data.php',
                params: {
                    task: 'delete',
                    xkey: 'hour_id',
                    xtable: 'hour',
                    xid: selectedKeys
                },
                callback: function(options, success, response) {
                    if (success) {
                        Ext.MessageBox.alert('OK', response.responseText);
                        var json = Ext.util.JSON.decode(response.responseText);
                        Ext.MessageBox.alert('OK', json.del_count + ' record(s) deleted.');
                    } else {
                        Ext.MessageBox.alert('Sorry, please try again. [Q304]', response.responseText);
                    }
                },
                failure: function(response, options) {
                    Ext.MessageBox.alert('Warning', 'Oops...');
                },
                success: function(response, options) {
                    refreshGrid();
                }
            });
        }
    };


    function handleDelete() {
        var selectedKeys = hourGrid.selModel.selections.keys;
        //returns array of selected rows ids only
        if (selectedKeys.length > 0) {
            Ext.MessageBox.confirm('Message', 'Do you really want to delete this timesheet?', deleteRecord);
        } else {
            Ext.MessageBox.alert('Message', 'Please select a timesheet to delete');
        }
        //end if/else block
    };
    // end handleDelete
    function refreshGrid() {
        hourDS.reload();
    }

    function updateDB(oGrid_Event) {

        if (oGrid_Event.value instanceof Date) {
            //format the value for easy insertion into MySQL
            var fieldValue = oGrid_Event.value.format('Y-m-d H:i:s');
        } else {
            var fieldValue = oGrid_Event.value;
        }

        Ext.Ajax.request(
        //alternative to Ext.form.FormPanel? or Ext.BasicForm
        {
            waitMsg: 'Saving changes...',
            url: 'grid-reconfigure.php',
            params: {
                //these will be available via $_POST or $_REQUEST:
                task: "update",
                key: company_id,
                xtable: 'company',
                keyID: oGrid_Event.record.data.company_id,
                field: oGrid_Event.field,
                value: fieldValue,
                originalValue: oGrid_Event.record.modified
                //the original value (oGrid_Event.orginalValue does not work for some reason)
            },
            //end params
            failure: function(response, options) {
                Ext.MessageBox.alert('Warning', 'Oops...');
                //ds.rejectChanges();//undo any changes
            },
            //end failure block
            success: function(response, options) {
                //Ext.MessageBox.alert('Success','Yeah...');
                if (oGrid_Event.record.data.company_id == '') {
                    var responseData = Ext.util.JSON.decode(response.responseText);
                    //passed back from server
                    var newID = responseData.newID;
                    //extract the ID provided by the server
                    //oGrid_Event.record.id = newID;
                    oGrid_Event.record.set('newRecord', 'no');
                    //reset the indicator since update succeeded
                    oGrid_Event.record.set('company_id', newID);
                    //assign the id to the record
                    //note the set() calls do not trigger everything since you may need to update multiple fields for example
                    //so you still need to call commitChanges() to start the event flow to fire things like refreshRow()
                    ds.commitChanges();
                    //commit changes (removes the red triangle which indicates a 'dirty' field)
                    //var whatIsTheID = oGrid_Event.record.modified;
                } else {
                    ds.commitChanges();
                    //commit changes (removes the red triangle which indicates a 'dirty' field)
                }
            }
            //end success block
        }
        //end request config
        );
        //end request
    };
    //end updateDB
    function handleEdit(editEvent) {
        var gridField = editEvent.field;
        //determine what column is being edited
        updateDB(editEvent);
        //start the process to update the db with cell contents
        //I don't want to wait for server update to update the Total Column
        if (gridField == 'price') {
            getTax(editEvent);
            //start the process to update the Tax Field
        }
    }

    function addRecord() {
        var r = new companyRecord({
            //specify default values
            company_id: '',
            company_name: ''
        });
        hourGrid.stopEditing();
        //stops any acitve editing
        companyDS.insert(0, r);
        //1st arg is index,
        //2nd arg is Ext.data.Record[] records
        //very similar to ds.add, with ds.insert we can specify the insertion point
        hourGrid.startEditing(0, 1);
        //starts editing the specified rowIndex, colIndex
        //make sure you pick an editable location in the line above
        //otherwise it won't initiate the editor
    };
    // end addRecord
    //
    // create editors
    //
    function handleDateRange(start, end) {
        d1 = start.format('Y-m-d');
        if (end) {
            d2 = end.format('Y-m-d');
        } else {
            d2 = d1;
        }
        hourDS.baseParams.startdate = d1;
        hourDS.baseParams.enddate = d2;
        hourDS.load({
            params: {
                start: 0,
                limit: 90
            }
        });
    }
    var companyname_edit = new Ext.form.TextField();
    //
    // Create column models to display the various grids
    //
    function renderDate(value) {
        return Date.parseDate(value, "Y-m-d").format('m/d/Y');
    }

    var hourColumnModel = new Ext.grid.ColumnModel([{
        header: "Employee First Name",
        width: 190,
        dataIndex: 'user_firstname',
        //editor: companyname_edit,
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
        header: "Company",
        width: 190,
        dataIndex: 'company_name',
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
        header: "Date",
        width: 190,
        dataIndex: 'hour_date',
        sortable: true,
        hidden: false,
        //renderer: Ext.util.Format.dateRenderer('l, F d')
        renderer: renderDate
    },
    {
        header: "Hours",
        width: 190,
        dataIndex: 'hour_num',
        sortable: true,
        align: 'right',
        hidden: false
    }]);

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


    var clearCompany = function() {
        taskDS.baseParams.company_id = '';
    };

    var selectCompany = function(value) {
        hourDS.baseParams.company_id = value.value;
    };
    var companyCombo = new Ext.form.ClearableComboBox({
        fieldLabel: 'Company',
        emptyText: '(All Companies)',
        displayField: 'company_name',
        valueField: 'company_id',
        forceSelection: true,
        typeAhead: true,
        store: 'companyStore',
        id: 'company_id',
        triggerAction: 'all',
        selectOnFocus: true,
        listeners: {
            'select': selectCompany,
            'cleared': clearCompany
        }

    });

    var hourGrid = new Ext.grid.EditorGridPanel({
        id: 'hourGrid',
        loadMask: true,
        stripeRows: true,
        border: false,
        cellclick: function() {
            var record = hourGrid.getStore().getAt(rowIndex);
            //get the record
            var fieldName = hourGrid.getColumnModel().getDataIndex(columnIndex);
            //get field name
            var data = record.get(fieldName);
            Ext.MessageBox.alert('title', 'inside function');
            //title: 'My Title Here',
            //msg: 'outside the function...'
            //fn: myCallBackFunction,//the callback function after the msg box is closed
            //scope:this//scope of callback function
        },
        autoWidth: true,
        autoScroll: true,
        clickstoEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        height: 300,
        store: hourDS,
        cm: hourColumnModel,
        border: false,
        autoExpandColumn: 'Name',
        trackMouseOver: true,
        tbar: [companyCombo, '-', startDate, endDate,
        {
            text: 'Generate Report',
            iconCls: 'go',
            xtype: 'button',
            handler: function() {
                // the following two lines cause an error in ie... needed to create a callback function to set the value of the company.
                //company_id = Ext.getCmp('company_id');
                //hourDS.baseParams.company_id = company_id.value;
                hourDS.baseParams.startDate = startDate.value;
                hourDS.baseParams.endDate = endDate.value;
                hourDS.load({
                    params: {
                        start: 0,
                        limit: 90
                    }
                });
            }
        },
        '-',
        {
            text: 'Add Weekly Timesheet',
            iconCls: 'clock_add',
            handler: addWeeklyTimeSheet
            //what happens when clicks on it
        },
        '-',
        {
            text: 'Add Timesheet',
            tooltip: 'Click to Add a row',
            iconCls: 'clock_add',
            handler: addTimeSheet
            //what happens when clicks on it
        },
        '-',
        //add a separator
        {
            text: 'Delete Selected',
            tooltip: 'Click to Delete selected row(s)',
            handler: handleDelete,
            iconCls: 'clock_delete'
            //we create our own css with a class called 'add'
        },
        '-',
        //add a separator
        {
            text: 'Refresh',
            tooltip: 'Click to Refresh the table',
            handler: refreshGrid,
            iconCls: 'reload'
            //we create our own css with a class called 'add'
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
    hourGrid.addListener('afteredit', handleEdit);
    //give event name, handler (can use 'on' shorthand for addListener)
	function thisThursday() {
		//var today = new Date('05/29/2010'); // to test - change the input value
		var today = new Date();
        var dayOfWeek = today.format('w');
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var year = today.getFullYear();
        m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        if (dayOfWeek > 4) {
            var subr = 4 - dayOfWeek ;
        } else {
            var subr = - ( dayOfWeek + 3 );
        }
        //todayValue = m_names[month - 1] + ' ' + (day - subr) + ', ' + year;
        todayValue = DateAdd('d',subr,today);
		var todayDate = new Date(todayValue)
        var dayOfWeek = todayDate.format('w');
        var month = todayDate.getMonth() + 1;
        var day = todayDate.getDate();
        var year = todayDate.getFullYear();
        todayValue = m_names[month - 1] + ' ' + day + ', ' + year;
		return todayValue;
	}
    function addWeeklyTimeSheet() {

        todayValue = thisThursday();
		pcombos = [];
		function goNextWeek() {
			wdd = Ext.getCmp('weekDropDown');
			ddate=wdd.getValue();
			tabContainer.removeAll();
			var thurs = new Date(ddate);
			rawdate = thurs.getTime() + (1000 * 60 * 60 * 24 * (7));
			tempDate = new Date(rawdate);
            var mday = tempDate.getDate();
            var tmonth = tempDate.getMonth() + 1;
            var tyear = tempDate.getFullYear();
            todayValue = tmonth + '/' + mday + '/' + tyear;

			createSchedule(todayValue);

	        wddValue = m_names[tmonth - 1] + ' ' + mday + ', ' + tyear;

			wdd.selectByValue(wddValue,true);
			wdd.setValue(wddValue);
		};
		function goToday() {
			wdd = Ext.getCmp('weekDropDown');
			tabContainer.removeAll();
			var thurs = new Date(thisThursday());

            var mday = thurs.getDate();
            var tmonth = thurs.getMonth() + 1;
            var tyear = thurs.getFullYear();
            thursday_formatted = tmonth + '/' + mday + '/' + tyear;

			createSchedule(thursday_formatted);

	        wddValue = m_names[tmonth - 1] + ' ' + mday + ', ' + tyear;
			wdd.selectByValue(wddValue,true);
			wdd.setValue(wddValue);
		}
		function goPrevWeek() {
			wdd = Ext.getCmp('weekDropDown');
			ddate=wdd.getValue();
			tabContainer.removeAll();
			var thurs = new Date(ddate);
			rawdate = thurs.getTime() - (1000 * 60 * 60 * 24 * (7));
			tempDate = new Date(rawdate);
            var mday = tempDate.getDate();
            var tmonth = tempDate.getMonth() + 1;
            var tyear = tempDate.getFullYear();
            todayValue = tmonth + '/' + mday + '/' + tyear;

			createSchedule(todayValue);

	        wddValue = m_names[tmonth - 1] + ' ' + mday + ', ' + tyear;

			wdd.selectByValue(wddValue,true);
			wdd.setValue(wddValue);
		}
		nextWeekBtn = new Ext.Button({
			id: 'nextweek',
			text: 'NEXT WEEK',
			iconCls: 'right',
			disabled: true,
			handler: goNextWeek
		});
		prevWeekBtn = new Ext.Button({
			id: 'prevweek',
			text: 'PREVIOUS WEEK',
			disabled: true,
			iconCls: 'left',
			handler: goPrevWeek
		});
		todayBtn = new Ext.Button({
			id: 'todayBtn',
			text: 'THIS WEEK',
			disabled: true,
			style: 'marginLeft: 290px',
			iconCls: 'calendar',
			handler: goToday
		});
        var tabContainer = new Ext.Panel({
            id: 'tabContainer',
// disable prev / next due to dst - mlynn 11/10/2011
			//tbar: [prevWeekBtn,todayBtn,'->',nextWeekBtn],
            title: '',
            width: 920,
            height: 300,
            border: false,
            frame: false,
            layout: 'table',
			bodyStyle: 'padding: 2px, 2px ',
			layoutConfig: {
				columns: 7
			},
			defaults: {
				bodyStyle: 'padding: 2px, 2px',
				border: false,
				frame: false
			}
        });
        var userStore = new Ext.data.JsonStore({
            id: 'userStore',
            url: 'data.php',
            root: 'results',
            baseParams: {
                xtable: 'user',
                start: 0,
                limit: 10000,
                task: 'showUsers'
            },
            fields: [{
                name: 'user_id',
                type: 'int'
            },
            {
                name: 'username'
            }]
        });
        var userDropDown = new Ext.form.ComboBox({
            id: 'userDropDown',
            triggerAction: 'all',
            store: userStore,
            displayField: 'username',
            valueField: 'user_id',
            hiddenName: 'user_id',
			emptyText: 'Select Employee',
            labelSeparator: null,
            fieldLabel: 'Employee:',
            typeAhead: true,
            forceSelection: true,
            mode: 'remote',
			columnWidth: .33,
            listClass: 'x-combo-list-small',
            allowBlank: false,
            enableKeyEvents: true,
            listeners: { 
				select: function(combo, value) {
					if (combo.getValue()) {
						tabContainer.removeAll();
						wd = Ext.getCmp('weekDropDown');						
						wd.enable();
						nextWeekBtn.enable();
						prevWeekBtn.enable();
						todayBtn.enable();
						weekdate=wd.getValue();
						createSchedule(weekdate);
	                }
	            },                
				keyup: {
                    buffer: 150,
                    fn: function(field, e) {
                        if (Ext.EventObject.ESC == e.getKey()) {
                            field.onTriggerClick();
                        } else {
                            var val = this.getRawValue();
                            var re = new RegExp('%' + val + '%');
                            userStore.clearFilter();
                            userStore.filter('username', val, true, false);
                        }
                    }
                }
            }
        });

        var weekStore = new Ext.data.JsonStore({
            id: 'weekStore',
            autoLoad: true,
            url: 'data.php',
            root: 'data',
            baseParams: {
                xtable: 'week',
                task: 'weekDropDown'
            },
            fields: [{
                name: 'week'
            },
            {
                name: 'date'
            }]
        });
        weekStore.load();
		var scheduledhours = new Ext.form.NumberField({
			id: 'scheduledhours',
			readOnly: true,
			fieldLabel: 'Hours Scheduled',
			width: 30
		});
        var workedhours = new Ext.form.NumberField({
			id: 'workedhours',
			readOnly: true,
            fieldLabel: 'Hours Worked',
			width: 30
        });
		var useAutoFill = new Ext.form.Checkbox({
			id: 'useAutoFill',
			fieldLabel: 'Auto Fill Project',
			checked: true
		});
		function setworkedhours(week,uid) {
			hours=0;
			Ext.Ajax.request({
				url: 'data.php',
				params: {
					task: 'get_week_hours',
					week: week,
					uid: uid,
					type: 'worked'
				},
				method: 'POST',
				callback: function (options,success,response) {
					var result=Ext.util.JSON.decode(response.responseText);
					if (result.success==false) {
// no hours
					} else {
						workedhours.setValue(result.results.hours+0);
					}
				}
			});
		}
		function setscheduledhours(week,uid) {
			hours=0;
			Ext.Ajax.request({
				url: 'data.php',
				params: {
					task: 'get_week_hours',
					week: week,
					type: 'scheduled',
					uid: uid
				},
				method: 'POST',
				callback: function (options,success,response) {
					var result=Ext.util.JSON.decode(response.responseText);
					if (result.success==false) {
// no hours
					} else {
						scheduledhours.setValue(result.results.hours+0);
					}
				}
			});
		}
		function createWeekGrid(week,uid) {
			var weekStore = new Ext.data.JsonStore({
				id: 'weekStore',
				autoLoad: true,
				url: 'data.php',
				root: 'results',
				baseParams: {
					task: 'weekGrid',
					week: week,
					uid: uid
				},
				sortInfo: {
					field: 'assign_date',
					direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
				},
				fields: [{
					name: 'assign_date'
				},
				{
					name: 'project_name'
				},
				{
					name: 'assign_num'
				}
				]
			});
			var weekColumnModel = new Ext.grid.ColumnModel([{
				header: "Date",
				width: 75,
				dataIndex: 'assign_date',
				sortable: true,
				hidden: false
			},
			{
				header: "Project",
				width: 170,
				dataIndex: 'project_name',
				sortable: true,
				hidden: false
			},
			{
				header: "Hours",
				width: 50,
				dataIndex: 'assign_num'
			}
			]);
			var weekGrid = new Ext.grid.GridPanel({
				id: 'weekGrid',
				width: 350,
				height: 130,
				title: '',
				autoScroll: true,
				layout: 'fit',
				store: weekStore,
				frame: true,
				border: true,
				cm: weekColumnModel
			});
			wf=Ext.getCmp('weekFieldSet');
			wf.removeAll();
			wf.add(weekGrid);
			wf.doLayout();
		}
        var weekDropDown = new Ext.form.ComboBox({
            id: 'weekDropDown',
			disabled: true,
            triggerAction: 'all',
            store: weekStore,
            mode: 'remote',
            enabled: false,
            displayField: 'week',
            valueField: 'week',
            labelSeparator: null,
            fieldLabel: 'Week of Thursday:',
            value: todayValue,
            allowBlank: false,
			columnWidth: .33,
            editable: false,
            autoWidth: true,
			emptyText: 'Select Week',
            listeners: 
			{
                select: function(combo, value) {
					weekdate=combo.getValue();
					uid=Ext.getCmp('userDropDown').getValue();
					createSchedule(combo.getValue());
					//setscheduledhours(weekdate,uid);
					//setworkedhours(weekdate,uid);
                },
				afterrender: function() {
					this.selectByValue(todayValue,true);
				}
            }
        });
		var form = new Ext.FormPanel({
		    id: 'form',
		    width: 923,
		    layout: 'column',
		    labelWidth: 120,
			labelAlign: 'left',
			border: true,
			frame: true,
		    autoHeight: true,
		    bodyStyle: 'padding:5px',
		    items: [{
				xtype: 'fieldset',
				columnWidth: .5,
				frame: false,
				border: false,
				items: [userDropDown, weekDropDown, scheduledhours, workedhours, useAutoFill]
				},{
				xtype: 'fieldset',
				id: 'weekFieldSet',
				columnWidth: .5,
				frame: false,
				border: false,
				items: []
				}
			]
		});
        function createSchedule(ddate) {
			tabContainer.removeAll();
			uf = Ext.getCmp('userDropDown');
			uid = uf.getValue();
            var projectStore = new Ext.data.JsonStore({
                id: 'projectStore',
                url: 'data.php',
                root: 'results',
				autoLoad: true,
                baseParams: {
                    xtable: 'project',
                    start: 0,
                    limit: 10000,
					showProjectNum: false,
                    task: 'showProjects'
                },
                fields: [{
                    name: 'project_id',
                    type: 'int'
                },
                {
                    name: 'project_name'
                }]
            });		
            function createHourField(d,uid) {
                hour_num = new Ext.form.NumberField({
                    id: 'hour_num' + d,
                    name: 'hour_num-' + d + '-' + uid,
                    renderTarget: 'td:nth(2)',
                    width: 23,
					value: hours,
                    fieldLabel: 'Hours'
                });
                return hour_num;
            };
            // end function createHourField
            function createProjectCombo(d,uid) {
				pcombos.push('projectEdit'+d); // add this component's id to our array
                projectEdit = new Ext.form.ComboBox({
                    id: 'projectEdit' + d,
                    name: 'project-' + d + '-' + uid,
                    triggerAction: 'all',
                    typeAhead: false,
                    store: projectStore,
                    selectOnFocus: true,
					width: 105,
                    emptyText: 'Project...',
                    displayField: 'project_name',
                    valueField: 'project_id',
                    hiddenName: 'project_id' + '-' + d + '-' + uid,
                    labelSeparator: null,
                    listClass: 'x-combo-list-small',
                    allowBlank: true,
					autoSelect: true,
                    mode: 'local',
					fieldLabel: 'Project:',
					labelWidth: 0,
                    forceSelection: true,
                    enableKeyEvents: true,
                    listeners: {
						select: function(combo, value) {
							if (this.id==pcombos[0]) {
								var p = combo.getValue();	
								var useAutoFill=Ext.getCmp('useAutoFill').getValue();
								if (useAutoFill==true) {
								if (combo.getValue()) {
									len = pcombos.length;
									for (var i = 1; i < len; i++) {
										var n=pcombos[i];
										var c=Ext.getCmp(n);
										if (Ext.isObject(c)) {
											c.focus();
											c.selectByValue(combo.getValue(),true);
											c.setValue(combo.getValue());
											c.fireEvent('select');
										}
									}
								}
								}
							}
						}
						//,                
                        
						//keyup: {
                            
						//buffer: 150,
                            
						//fn: function(field, e) {
                                
						//if (Ext.EventObject.ESC == e.getKey()) {
                                    
						//field.onTriggerClick();
                                
						//} else {
                                    
						//var val = this.getRawValue();
                                    
						//var re = new RegExp(val + '%');
                                    
						//projectStore.clearFilter();
                                    
						//projectStore.filter('project_name', val, true, false);
                                
						//}
                            
						//}
                        
						//}
                    }
                });
                return projectEdit;
            };
            // end function createDayForm
            function createFieldSet(ddate,uid) {
				d = new Date(ddate);
				dl = d.format('l');
				dd = d.getDate();
				dm = d.getMonth()+1;
                var fieldSet = new Ext.form.FieldSet({
                    autoHeight: true,
					id: 'fs_'+ddate+'-'+uid,
                    anchor: '100%',
					collapsible: false,
					bodyStyle: 'padding: 2px',
					layout: 'form',
					frame: true,
					border: true, 
					title: dl+' '+dm+'/'+dd,
					columnWidth: .14,
					defaults: { border: false, frame: false}
                });
				dayPanel = new Ext.Panel({
					layout: 'table',
					width: 129,
					bodyStyle: 'padding: 0px',
					layoutConfig: {columns: 2},
					title: dl+' '+dm+'/'+dd
				})
                //fieldSet.add(createProjectCombo(ddate,uid),createHourField(ddate,uid));
				dayPanel.add(createProjectCombo(ddate,uid),createHourField(ddate,uid));
				return dayPanel;
				//return fieldSet;
            };

			var scheduleForm = new Ext.form.FormPanel({
				id: 'scheduleForm',
				autoScroll: true,
				layout: 'column',
				border: true,
				frame: true,
				bodyStyle: 'padding: 0px',
				width: 920,
				containerScroll: true,
				labelWidth: 45,
				labelAlign: 'top',
				url: 'data.php',
				baseParams: { uid: uid, task: 'weekForm' }
			});

            var days = [];
            var fields = [];
            var thurs = new Date(ddate);
			setscheduledhours(ddate,uid);
			setworkedhours(ddate,uid);
			createWeekGrid(ddate,uid);

            for (s = 0; s <= 6; s = s + 1) {
		rawdate = thurs.getTime() + (1000 * 60 * 60 * 24 * (s));
		tempDate = new Date(rawdate);
		save_tmonth = tmonth;
		save_mday = mday;
                var mday = tempDate.getDate();
                var tmonth = tempDate.getMonth() + 1;
                var tyear = tempDate.getFullYear();
		if (save_tmonth==tmonth && save_mday==mday) {
// DST... so there are 25 hours in a day.
			rawdate = thurs.getTime() + (1000 * 60 * 60 * 25 * (s));
			tempDate = new Date(rawdate);
			var mday = tempDate.getDate();
			var tmonth = tempDate.getMonth() + 1;
			var tyear = tempDate.getFullYear();
		}

	
                todayValue = tmonth + '/' + mday + '/' + tyear;
                todayDate = new Date();
				todayDate.setDate(todayValue);
               // scheduleForm.add(createFieldSet(tmonth+'/'+mday+'/'+year,uid));
// send the unformated date in text or string form
                scheduleForm.add(createFieldSet(todayValue,uid));
				scheduleForm.doLayout();
            };
            scheduleForm.doLayout();
            tabContainer.add(scheduleForm);
            tabContainer.doLayout();
        }; // end of createSchedule function
        var winPanel = Ext.getCmp('winPanel');
		var buttons = new Ext.form.FormPanel({
			border: false,
			frame: false,
			buttonAlign: 'center',
		    buttons: [
		        {text: 'Save',
					handler: function() {
						pe = Ext.getCmp('scheduleForm');
						e = Ext.getCmp('form');
						pe.getForm().submit({
							url: 'data.php',
							success: function(f, a) {
	                            Ext.Msg.alert('Success', 'Timesheet Successfully Created');
	                            dr.getForm().reset();
								e.getForm().reset();
								Ext.getCmp('tabContainer').removeAll();
								Ext.getCmp('weekFieldSet').removeAll();
	                        },
	                        failure: function(f, a) {
	                            Ext.Msg.alert('Warning', 'Timesheet Not Successfully Created');
	                        }
						});
					}
				},
		        {text: 'Cancel'}
		    ]
		})
        if (!winPanel) {
            var winPanel = new Ext.Window({
                title: 'Add Timesheet',
                id: 'winPanel',
                width: 916,
                height: 385,
                layout: 'border',
	            bodyStyle: 'padding:5px',
                resizable: true,
                border: true,
                split: true,
                closable: true,
                modal: true,
                defaults: {
                    split: true,
                    border: false,
                    frame: false
                },
                items: [
                {
                    xtype: 'panel',
                    split: true,
                    region: 'center',
                    layout: 'border',
                    border: false,
                    frame: false,
					defaults: {border: false, frame: false},
                    items: [{
						xtype: 'panel',
						region: 'north',
						height: 150,
						frame: false, 
						border: false,
						items: [form]
					},{
						xtype: 'panel',
						region: 'center',
						layout: 'fit',
						autoScroll: false,
						containerScroll: false,
						items: [tabContainer]
					},{
						xtype: 'panel',
						region: 'south',
						height: 60,
						items: [buttons]
					}
					]
                }]
            });
        }
        winPanel.onShow = function() {
            dr = Ext.getCmp('form');
            dr.getForm().reset();
            winPanel.show();
        }
        winPanel.onClose = function() {
            dr = Ext.getCmp('form');
            dr.getForm().reset();
            //winPanel.hide();
        }
        winPanel.show();
    };
    // End Function addWeeklyTimeSheet;
    function addTimeSheet() {
        var scheduledate = {
            xtype: 'datefield',
            fieldLabel: 'Date',
            name: 'scheduledate',
            id: 'scheduledate',
            format: 'Y-m-d'
        };
        var projectStore = new Ext.data.JsonStore({
            id: 'projectStore',
            url: 'data.php',
            root: 'results',
            baseParams: {
                xtable: 'project',
                start: 0,
                limit: 10000,
                task: 'showProjects'
            },
            fields: [{
                name: 'project_id',
                type: 'int'
            },
            {
                name: 'project_name'
            }]
        });
        var projectEdit = new Ext.form.ComboBox({
            id: 'projectEdit',
            triggerAction: 'all',
            typeAhead: false,
            store: projectStore,
            //selectOnFocus: true,
            //emptyText: 'Select project...',
            displayField: 'project_name',
            valueField: 'project_id',
            hiddenName: 'project_id',
            labelSeparator: null,
            fieldLabel: 'Project:',
            listClass: 'x-combo-list-small',
            allowBlank: false,
            mode: 'remote',
            forceSelection: true,
            enableKeyEvents: true,
            listeners: {
                keyup: {
                    buffer: 150,
                    fn: function(field, e) {
                        if (Ext.EventObject.ESC == e.getKey()) {
                            field.onTriggerClick();
                        } else {
                            var val = this.getRawValue();
                            var re = new RegExp(val + '%');
                            projectStore.clearFilter();
                            projectStore.filter('project_name', val, true, false);
                        }
                    }
                }
            }

        });

        var hour_num = new Ext.form.TextField({
            name: 'hour_num',
            fieldLabel: 'Hours'
        });
        var userStore = new Ext.data.JsonStore({
            id: 'userStore',
            url: 'data.php',
            root: 'results',
            baseParams: {
                xtable: 'user',
                start: 0,
                limit: 10000,
                task: 'showUsers'
            },
            fields: [{
                name: 'user_id',
                type: 'int'
            },
            {
                name: 'username'
            }]
        });
        var userEdit = new Ext.form.ComboBox({
            id: 'userEdit',
            triggerAction: 'all',
            store: userStore,
            displayField: 'username',
            valueField: 'user_id',
            hiddenName: 'user_id',
            labelSeparator: null,
            fieldLabel: 'Employee:',
            typeAhead: true,
            forceSelection: true,
            mode: 'remote',
            listClass: 'x-combo-list-small',
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                keyup: {
                    buffer: 150,
                    fn: function(field, e) {
                        if (Ext.EventObject.ESC == e.getKey()) {
                            field.onTriggerClick();
                        } else {
                            var val = this.getRawValue();
                            var re = new RegExp('%' + val + '%');
                            userStore.clearFilter();
                            userStore.filter('username', val, true, false);
                        }
                    }
                }
            }


        });

        var createTimeSheet = new Ext.form.Checkbox({
            fieldLabel: 'Add Timesheet?',
            name: 'addtimesheet',
            value: 'yes',
            checked: true
        });

        var dr = new Ext.FormPanel({
            frame: true,
            height: 180,
            id: 'dr',
            width: 300,
            labelWidth: 100,
            lazyRender: true,
            url: 'data.php',
            baseParams: {
                xtable: 'task',
                task: 'addTimeSheet'
            },
            bodyStyle: 'padding:5px',
            defaults: {
                labelWidth: 100,
                width: 170
            },
            defaultType: 'datefield',
            items: [scheduledate, userEdit, projectEdit, hour_num, createTimeSheet],
            buttons: [{
                text: 'Add Timesheet',
                handler: function() {
                    dr.getForm().submit({
                        success: function(f, a) {
                            Ext.Msg.alert('Success', 'Timesheet Successfully Created');
                            dr.getForm().reset();
                        },
                        failure: function(f, a) {
                            Ext.Msg.alert('Warning', 'Timesheet Not Successfully Created');
                        }

                    });
                }
            },
            {
                text: 'Cancel',
                handler: function() {
                    winPanel.hide();
                }
            }]
        });
        var winPanel = Ext.getCmp('winPanel');
        if (!winPanel) {
            var winPanel = new Ext.Window({
                title: 'Add Timesheet',
                id: 'winPanel',
                autoHeight: true,
                width: 310,
                resizable: false,
                closable: true,
                modal: true,
                //closeAction: 'hide',
                items: [dr]
            });
        }
        winPanel.onShow = function() {
            dr = Ext.getCmp('dr');
            dr.getForm().reset();
            winPanel.show();
        }
        winPanel.onClose = function() {
            dr = Ext.getCmp('dr');
            dr.getForm().reset();
            //winPanel.hide();
        }
        winPanel.show();
    };
    // addTimeSheet function;
    var viewport = new Ext.Viewport({
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
            containerScroll: true,
            border: false,
            items: [hourGrid]
        }]
    });
});

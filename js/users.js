/**
 * Editor Grid for Users - Part of Wall Systems Supply Payroll and Scheduling System
 * Interacts with server side php/MySQL
 * January 18, 2007
 * Michael Lynn <merlynn@gmail.com>
 */
var global_printer = null; // it has to be on the index page or the generator page  always


function printmygridGO(obj) {
    global_printer.printGrid(obj);
}

function printmygridGOcustom(obj) {
    global_printer.printCustom(obj);
}
Ext.onReady(function () {
    Ext.QuickTips.init();
    Ext.apply(Ext.form.VTypes, {
        'ssn': function () {
            var re = /^([0-6]\d{2}|7[0-6]\d|77[0-2])([ \-]?)(\d{2})\2(\d{4})$/;
            return function (v) {
                return re.test(v);
            }
        }(),
        'ssnText': 'SSN format: xxx-xx-xxxx',
        'phone': function () {
            var re = /^(\d{3}[-]?){1,2}(\d{4})$/;
            return function (v) {
                return re.test(v);
            }
        }(),
		'phoneText': 'Not a valid phone number.',
		'password': function(val, field) { 
		if (field.initialPassField) { 
			var pwd = Ext.getCmp(field.initialPassField); 
			return (val == pwd.getValue()); 
		} 
		return true; 
		}, 
		passwordText: 'Passwords Do Not Match!'
    });

    //
    // Data store for Company - used by combobox in grid
    //
    var companyStore = new Ext.data.JsonStore({
        id: 'companyStore',
        url: 'data.php',
        root: 'results',
        autoLoad: true,
        baseParams: {
            xtable: 'company',
            task: 'getCompany',
            start: 0,
            limit: 10000
        },
        fields: [{
            name: 'company_id',
            type: 'int'
        },
        {
            name: 'company_name'
        }]
    });
    var userPayTypes = new Ext.data.SimpleStore({
        fields: ['id', 'value'],
        data: [
            ['hourly', 'Hourly'],
            ['salary', 'Salary']
        ]
    });
    var userTypes = new Ext.data.SimpleStore({
        fields: ['id', 'value'],
        data: [
            ['employee', 'Employee'],
            ['admin', 'Administrator']
        ]
    });
    var yesNo = new Ext.data.SimpleStore({
        fields: ['id', 'value'],
        data: [
            ['Y', 'Yes'],
            ['N', 'No']
        ]
    });
    //
    // Data Store for Users
    //
    var userRecord = Ext.data.Record.create([{
        name: 'user_id',
        mapping: 'user_id'
    },
    {
        name: 'user_name',
        mapping: 'user_name'
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
        name: 'user_paytype',
        mapping: 'user_paytype'
    },
    {
        name: 'user_pass',
        mapping: 'user_pass'
    },
    {
        name: 'user_email',
        mapping: 'user_email'
    },
    {
        name: 'user_type',
        mapping: 'user_type'
    },
    {
        name: 'user_active',
        mapping: 'user_active'
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
        name: 'user_startdate',
        mapping: 'user_startdate',
        type: 'date',
        dateFormat: 'Y-m-d'
    },
    {
        name: 'user_regularpay',
        mapping: 'user_regularpay',
        type: 'float'
    },
    {
        name: 'user_photo',
        mapping: 'user_photo',
        type: 'float'
    },
    {
        name: 'user_otbpay',
        mapping: 'user_otbpay'
    }]);
    var usersReader = new Ext.data.JsonReader({
        root: 'results',
        totalProperty: 'total',
        id: 'user_id'
    },
    userRecord);
    usersDS = new Ext.data.GroupingStore({
        id: 'usersDS',
        proxy: new Ext.data.HttpProxy({
            url: 'data.php',
            method: 'POST'
        }),
        baseParams: {
            task: 'showUsers',
            xtable: 'user',
            start: 0,
            limit: 10000
        },
        reader: usersReader,
        sortInfo: {
            field: 'company_id',
            direction: 'ASC'
        },
        groupField: 'company_name'
    });
        function deleteRecord(btn) {
            if(btn=='yes') {
                var selectedKeys = usersGrid.selModel.selections.keys;
                Ext.Ajax.request({
                    waitMsg: 'Saving changes...',
                    url: 'data.php',
                    params: {
                        task: 'delete',
                        xkey: 'user_id',
                        xtable: 'user',
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
        var selectedKeys = usersGrid.selModel.selections.keys; //returns array of selected rows ids only
        if (selectedKeys.length > 0) {
            Ext.MessageBox.confirm('Message', 'Do you really want to delete this user?', deleteRecord);
        } else {
            Ext.MessageBox.alert('Message', 'Please select a user to delete');
        } //end if/else block
    }; // end handleDelete 

    function refreshGrid() {
        usersDS.reload();
    }

    function updateDB(oGrid_Event) {

        /*Do we need to disable a new record from further editing while the first request
              is being made since the record may not have the new companyID in time
              to use to properly handle other updates of the same record? 
              
              Dates come through as an object instead of a string or numerical
              value, so do a check to prep the new value for transfer to the
              server side script*/
        if (oGrid_Event.value instanceof Date) { //format the value for easy insertion into MySQL
            var fieldValue = oGrid_Event.value.format('Y-m-d H:i:s');
        } else {
            if (oGrid_Event.field == 'user_pass') {
                var fieldValue = Ext.util.MD5(oGrid_Event.value); // md5 password
                //Ext.MessageBox.alert('message','Pass: '+oGrid_Event.value+'<br>Enc: '+fieldValue);
            } else {
                var fieldValue = oGrid_Event.value;
            }
        }

        //submit to server
        Ext.Ajax.request( //alternative to Ext.form.FormPanel? or Ext.BasicForm
        { //specify options (note success/failure below that receives these same options)
            waitMsg: 'Saving changes...',
            url: 'data.php',
            //url to server side script
            method: 'POST',
            //if specify params default is 'POST' instead of 'GET'
            params: { //these will be available via $_POST or $_REQUEST:
                task: "update",
                xtable: 'user',
                keyID: oGrid_Event.record.data.user_id,
                field: oGrid_Event.field,
                value: fieldValue,
                originalValue: oGrid_Event.record.modified //the original value (oGrid_Event.orginalValue does not work for some reason)
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
                if (oGrid_Event.record.data.user_id == '') {
                    var responseData = Ext.util.JSON.decode(response.responseText); //passed back from server
                    var newID = responseData.newID; //extract the ID provided by the server
                    //oGrid_Event.record.id = newID;
                    oGrid_Event.record.set('newRecord', 'no'); //reset the indicator since update succeeded
                    oGrid_Event.record.set('user_id', newID); //assign the id to the record
                    //note the set() calls do not trigger everything since you may need to update multiple fields for example
                    //so you still need to call commitChanges() to start the event flow to fire things like refreshRow()
                    usersDS.commitChanges(); //commit changes (removes the red triangle which indicates a 'dirty' field)
                    //var whatIsTheID = oGrid_Event.record.modified;
                } else {
                    usersDS.commitChanges(); //commit changes (removes the red triangle which indicates a 'dirty' field)
                }
            } //end success block                                      
        } //end request config
        ); //end request  
    }; //end updateDB 

    function handleEdit(editEvent) {
        var gridField = editEvent.field; //determine what column is being edited
        updateDB(editEvent); //start the process to update the db with cell contents
    }

    function addRecord() {
		addWin = Ext.getCmp('addWin');
		if (!addWin) {
			addForm = Ext.getCmp('addForm');
			if(!addForm) {
				addForm= { xtype: 'form',
					id: 'addForm',
					bodyStyle: 'padding:15px;background:transparent',
					border: false,
					url:'data.php',
					baseParams: {task:'addUser'},
					items: [
						{ xtype: 'textfield',id: 'firstname', fieldLabel: 'First Name', allowBlank: false, maxLength: 35 },
						{ xtype: 'textfield',id: 'lastname' , fieldLabel: 'Last Name', allowBlank: false, maxLength: 35 }
					],
					buttons: [{
						text: 'Add User',
						handler: function() {
							Ext.getCmp('addForm').getForm().submit({
								waitMsg: 'Please wait...',
								success: function (f, a) {
									Ext.Msg.alert('Success', 'User Successfully Added');
									usersDS.reload();
									addWin.hide();
								},
								failure: function (f, a) {
									Ext.Msg.alert('Warning', 'User Not Successfully Created');
								}
							});
						}
					}]
				};
			};
			addWin = new Ext.Window({
				title: 'Add Employee',
				layout: 'form',
				width: 340,
				autoHeight: true,
				closeAction: 'hide',
				items: [addForm]
			});
		}
		addWin.show();
    }; // end addRecord 
    var money = function (val) {
        return Ext.util.Format.number(val, '$?0,000.00?');
    }

    var userpass_edit = new Ext.form.TextField({
        inputType: 'password'
    });
    var username_edit = new Ext.form.TextField();
    var userfirstname_edit = new Ext.form.TextField();
    var userlastname_edit = new Ext.form.TextField();
    var userregularpay_edit = new Ext.form.TextField();
    var userotbpay_edit = new Ext.form.TextField();
    var usertype_edit = new Ext.form.ComboBox({
        store: userTypes,
        mode: 'local',
        displayField: 'value',
        triggerAction: 'all',
        typeAhead: true,
        allowBlank: false,
        valueField: 'id',
        width: 50
    });
    var userpaytype_edit = new Ext.form.ComboBox({
        store: userPayTypes,
        mode: 'local',
        displayField: 'value',
        valueField: 'id',
        triggerAction: 'all',
        typeAhead: true,
        allowBlank: false,
        valueField: 'id',
        width: 50
    });
    var useractive_edit = new Ext.form.ComboBox({
        store: yesNo,
        mode: 'local',
        displayField: 'value',
        triggerAction: 'all',
        typeAhead: true,
        allowBlank: false,
        valueField: 'id',
        width: 50
    });
    var user_startdate_edit = new Ext.form.DateField({
        format: 'Y-m-d'
    });
    var comboRenderer = function (combo) {
        return function (value) {
            var record = combo.findRecord(combo.valueField, value);
            return record ? record.get(combo.displayField) : combo.valueNotFoundText;
        }
    }
    var companyedit = new Ext.form.ComboBox({
        triggerAction: 'all',
        typeAhead: true,
        store: companyStore,
        selectOnFocus: true,
        emptyText: '',
        name: 'company',
        displayField: 'company_name',
        valueField: 'company_name',
        forceSelection: true,
        labelSeparator: null,
        listClass: 'x-combo-list-small',
        //lazyRender: false,
        allowBlank: false
    });
    //
    // Create column models to display the various grids
    //
    var usersColumnModel = new Ext.grid.ColumnModel([{
        header: "Login",
        width: 90,
        dataIndex: 'user_name',
        editor: username_edit,
        sortable: true,
        hidden: false
    },
    {
        id: "FName",
        width: 130,
        header: 'First Name',
        dataIndex: 'user_firstname',
        editor: userfirstname_edit,
        sortable: true,
        hidden: false
    },
    {
        id: "LName",
        width: 130,
        header: 'Last Name',
        dataIndex: 'user_lastname',
        editor: userlastname_edit,
        sortable: true,
        hidden: false
    },
    {
        header: "Company",
        width: 110,
        dataIndex: 'company_name',
        editor: companyedit,
        sortable: true,
        hidden: false
    },
    {
        header: "Start Date",
        width: 90,
        type: 'date',
        renderer: Ext.util.Format.dateRenderer('m/d/Y'),
        dataIndex: 'user_startdate',
        editor: user_startdate_edit,
        sortable: true,
        hidden: false
    },
	{
		header: "Pay Type",
		width: 90,
		dataIndex: 'user_paytype',
		editor: userpaytype_edit
	},	
    {
        header: "MIN Rate",
        align: 'right',
        width: 90,
        dataIndex: 'user_regularpay',
        editor: userregularpay_edit,
        renderer: money,
        sortable: true,
        hidden: false
    },
    {
        header: "MAX Rate",
        align: 'right',
        width: 90,
        dataIndex: 'user_otbpay',
        editor: userotbpay_edit,
        renderer: money,
        sortable: true,
        hidden: false
    }]);

var picBox = { 
   columnWidth: '200 px', 
   bodyStyle: 'padding:10px', 
   items: [ 
     { xtype: 'box', 
       autoEl: { tag: 'div', 
       html: '<img width=150 id="pic" src="images/unknown_male.png" class="img-contact" />' 
          } 
     } 
   ] 
} 

	var picFiles = { 
		columnWidth: .65, 
		layout: 'form',
		labelAlign:'top', 
		items: [{ 
		xtype: 'textfield', 
		fieldLabel: 'Current', 
		labelSeparator: '', 
		name: 'currPic', 
		id:'currPic', 
		readOnly: true, 
		disabled:true, 
		anchor:'100%' 
		}, 
		{ 
		xtype: 'textfield', 
		fieldLabel: 'New (JPG or PNG only)', 
		labelSeparator: '', 
		name: 'newPic', 
		id:'newPic', 
		style:'width: 300px', 
		inputType: 'file', 
		allowBlank: false 
	   }] 
	} 
	function validateFileExtension(fileName) { 
	   var exp = /^.*\.(jpg|JPG|png|PNG)$/; 
	   return exp.test(fileName); 
	} 
var pictUploadForm = new Ext.FormPanel({ 
   frame: true, 
   bodyStyle: 'padding:5px', 
   width: 420, 
   layout: 'column', 
   url: 'picupload.php', 
   method: 'POST', 
   fileUpload: true, 
   items: [picBox, picFiles], 
   buttons: [{
	text: 'Upload Picture', 
      handler: function() { 
         var theForm = pictUploadForm.getForm(); 
         if (!theForm.isValid()) { 
            Ext.MessageBox.alert('Change Picture', 
              'Please select a picture'); 
                 return; 
         } 
         if (!validateFileExtension(Ext.getDom('newPic').value)) { 
            Ext.MessageBox.alert('Change Picture', 
              'Only JPG or PNG, please.'); 
               return; 
         } 
         theForm.submit({ 
            params: { act: 'setPicture', id: 'contact1' }, 
            waitMsg: 'Uploading picture' 
         }) 
      } 
   }, 
   { 
      text: 'Cancel' 
   }] 
});
pictUploadForm.on({ 
   actioncomplete: function(form, action) { 
      if (action.type == 'load') { 
         var pic = action.result.data; 
         Ext.getDom('pic').src = pic.file; 
         Ext.getCmp('currPic').setValue(pic.file); 
      } 
      if (action.type == 'submit') { 
         var pic = action.result.data; 
         Ext.getDom('pic').src = pic.file; 
         Ext.getCmp('currPic').setValue(pic.file); 
         Ext.getDom('newPic').value = ''; 
      } 
   } 
});
//pictUploadForm.render(document.body); 
//pictUploadForm.getForm().load({ params: { act: 'getPicture', id: 'contact1' }, waitMsg: 'Loading' });

    var pictureWindow = new Ext.Window({
        title: 'Picture Upload',
        width: 500,
        height: 420,
        closable: true,
		closeAction: 'hide',
        items: pictUploadForm
    });

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
        //typeAhead: false,
        store: userStore,
        //selectOnFocus: true,
        //emptyText: 'Select user...',
        displayField: 'username',
        valueField: 'user_id',
        hiddenName: 'user_id',
        //forceSelection: true,
        labelSeparator: null,
        fieldLabel: 'Employee:',
        listClass: 'x-combo-list-small',
        //lazyRender: true,
        allowBlank: false
    });

    var projectEdit = new Ext.form.ComboBox({
        id: 'projectEdit',
        triggerAction: 'all',
        //typeAhead: false,
        store: projectStore,
        //selectOnFocus: true,
        //emptyText: 'Select project...',
        displayField: 'project_name',
        valueField: 'project_id',
        hiddenName: 'project_id',
        //forceSelection: true,
        labelSeparator: null,
        fieldLabel: 'Project:',
        listClass: 'x-combo-list-small',
        //lazyRender: true,
        allowBlank: false
    });
    var hour_num = new Ext.form.TextField({
        name: 'hour_num',
        fieldLabel: 'Hours'
    });

    var dr = new Ext.FormPanel({
        frame: true,
        height: 180,
        id: 'dr',
        width: 300,
        labelWidth: 100,
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
        items: [scheduledate, userEdit, projectEdit, hour_num],
        buttons: [{
            text: 'Add Timesheet',
            handler: function () {
                dr.getForm().submit({
                    success: function (f, a) {
                        Ext.Msg.alert('Success', 'Timesheet Successfully Created');
                        winPanel.hide();
                    },
                    failure: function (f, a) {
                        Ext.Msg.alert('Warning', 'Timesheet Not Successfully Created');
                    }

                });
            }
        },
        {
            text: 'Cancel',
            handler: function () {
                winPanel.hide();
            }
        }]
    });
    var winPanel = Ext.getCmp('winPanel');
    if (!winPanel) {
        winPanel = new Ext.Window({
            title: 'Add Timesheet',
            //Title of the Window
            id: 'winPanel',
            //ID of the Window Panel
            autoHeight: true,
            //Height of the Window will be auto
            width: 310,
            //Width of the Window
            resizable: false,
            //Resize of the Window, if false - it cannot be resized
            closable: true,
            //Hide close button of the Window
            modal: true,
            //When modal:true it make the window modal and mask everything behind it when displayed
            closeAction: 'hide',
            items: [dr]
        });
    }
    winPanel.onClose = function () {
        winPanel.hide();
    }
    var login = new Ext.FormPanel({
        labelWidth: 130,
		id: 'login',
        url: 'changepassword.php',
        frame: true,
        width: 320,
        autoHeight: true,
        bodyStyle: 'padding: 10px 10px 0 20px;',
        modal: true,
        defaultType: 'textfield',
        monitorValid: true,

        items: [
		{
            fieldLabel: 'Password',
            name: 'password',
			id: 'password',
            inputType: 'password',
            allowBlank: false
        },
        {
            fieldLabel: 'Reenter Password',
            name: 'password_confirm',
			id: 'password_confirm',
            inputType: 'password',
            allowBlank: false,
			vtype: 'password', initialPassField: 'password'
        }],
        buttons: [{
            text: 'Save',
			formBind: true,
            handler: function () {
				login = Ext.getCmp('login');
				gid = Ext.getCmp('usersGrid');
				var user_id = gid.getSelectionModel().getSelected().data.user_id;
				var password = Ext.util.MD5(login.getForm().findField('password').getValue('password'));
				
                login.getForm().submit({
                    method: 'POST',
					params: {user_id: user_id, md5_password: password},
                    waitTitle: 'Please wait',
                    waitMsg: 'Send data...',

                    success: function () {
                            login.getForm().reset();
                            Ext.Msg.alert('Change Password', 'Password Successfully Changed');
                    },

                    failure: function (form, action) {
                        if (action.failureType == 'server') {
                            obj = Ext.util.JSON.decode(action.response.responseText);
                            Ext.Msg.alert('Change Password!', obj.errors.reason);
                        } else {
                            Ext.Msg.alert('Warning!', 'Authentication server is unreachable : ' + action.response.responseText + "abcd");
                        }
                        login.getForm().reset();
                    }
                });
				passwordWindow.hide();
            }
        },
        {
            text: 'Reset',
            handler: function () {
                login.getForm().reset();
            }

        }]
    });

    var passwordWindow = new Ext.Window({
        frame: true,
        title: 'Change Password',
        width: 330,
        height: 150,
        closable: true,
        closeAction: 'hide',
        items: login
    });
    var userForm = new Ext.form.FormPanel({
        disabled: true,
        frame: true,
        containerScroll: true,
        autoHeight: true,
        autoScroll: true,
        id: 'userForm',
        reader: new Ext.data.JsonReader({
            root: 'results'
        },
        Ext.data.Record.create([{
            name: "user_id"
        },
        {
            name: "user_firstname"
        },
        {
            name: "user_lastname"
        },
        {
            name: "company_id"
        },
        {
            name: "user_name"
        },
        {
            name: "user_email"
        },
        {
            name: "user_type"
        },
        {
            name: "user_active"
        },
        {
            name: "user_regularpay"
        },
        {
            name: "user_paytype"
        },
        {
            name: "user_otbpay"
        },
        {
            name: "user_address"
        },
        {
            name: "user_city"
        },
        {
            name: "user_state"
        },
        {
            name: "user_zip"
        },
        {
            name: "user_homephone"
        },
        {
            name: "user_otherphone"
        },
        {
            name: "user_birthdate"
        },
        {
            name: "user_emerg_contact"
        },
        {
            name: "user_spouse_name"
        },
        {
            name: "user_weekhours"
        },
        {
            name: "user_sickdays"
        },
        {
            name: "user_vacdays"
        },
        {
            name: "user_paiddays"
        },
        {
            name: "user_password"
        },
        {
            name: "user_photo"
        }])),
        url: 'data.php',
        labelWidth: 120,
		method: 'POST',
        border: false,
        width: '100%',
        defaults: {
            width: 200
        },
        items: [
		//	{
            //xtype: 'fieldset',
            //title: 'Photograph',
            //collapsible: true,
            //autoHeight: true,
            //autoWidth: true,
            //width: 250,
            //items: [{
                //xtype: 'hidden',
                //name: 'user_photo'
            //},
            //{
                //xtype: 'box',
                //autoEl: {
                    //tag: 'div',
                    //style: 'padding-bottom:20px',
                    //html: '<img height=200 id="pic" src="images/unknown_male.png" class="img-contact" />'
                //}
            //},
            //{
                //xtype: 'button',
                //text: 'Change Picture',
                //handler: function () {
                    //pictureWindow.show()
                //}
            //}

            //]
        //},
        {
            xtype: 'fieldset',
            title: 'Personal Information',
            collapsible: true,
            autoHeight: true,
            autoWidth: true,
            width: 250,
            labelWidth: 120,
            defaultType: 'textfield',
            defaults: {
                width: 210
            },
            items: [{
                fieldLabel: 'First Name',
                readOnly: true,
                name: 'user_firstname'
            },
            {
                fieldLabel: 'Last Name',
                readOnly: true,
                name: 'user_lastname'
            },
            {
                fieldLabel: 'Date of Birth',
                xtype: 'datefield',
                name: 'user_birthdate'
            },
            {
                fieldLabel: 'National ID / SSN',
                vtype: 'ssn',
                name: 'user_ssn'
            }]
        },
        {
            xtype: 'fieldset',
            title: 'Contact Information',
            collapsible: true,
            autoHeight: true,
            autoWidth: true,
            width: 250,
            labelWidth: 120,
            defaultType: 'textfield',
            defaults: {
                width: 210
            },
            items: [{
                fieldLabel: 'Address',
                name: 'user_address'
            },
            {
                fieldLabel: 'City',
                name: 'user_city'
            },
            {
                fieldLabel: 'State',
                name: 'user_state'
            },
            {
                fieldLabel: 'Postal Code',
                name: 'user_zip'
            },
            {
                fieldLabel: 'Home Telephone',
                emptyText: '999-999-9999',
                vtype: 'phone',
                name: 'user_homephone'
            },
            {
                fieldLabel: 'Other Telephone',
                emptyText: '999-999-9999',
                vtype: 'phone',
                name: 'user_otherphone'
            },
            {
                fieldLabel: 'Email',
				required: false,
                emptyText: 'user@example.com',
                vtype: 'email',
                name: 'user_email'
            },
            {
                fieldLabel: 'Spouse Name',
                name: 'user_spousename'
            },
            {
                fieldLabel: 'Emergency Contact',
                name: 'user_emerg_contact'
            }]

        },
        {
            xtype: 'fieldset',
            title: 'Company Information',
            collapsible: true,
            autoHeight: true,
            autoWidth: true,
            width: 250,
            labelWidth: 120,
            defaultType: 'textfield',
            defaults: {
                width: 210
            },

            items: [{
                fieldLabel: 'Company',
                xtype: 'combo',
                store: 'companyStore',
                name: 'company_name',
                iconCls: 'company',
                lazyRender: true,
                emptyText: 'Select Company...',
                displayField: 'company_name',
                valueField: 'company_id',
                triggerAction: 'all'
            },
            {
                fieldLabel: 'Active?',
                xtype: 'checkbox',
                inputValue: 'Y',
                name: 'user_active'
            },
            {
                fieldLabel: 'Login',
                name: 'user_name'
            },
            {
                fieldLabel: 'Start Date',
                xtype: 'datefield',
                name: 'user_startdate'
            },
            {
                fieldLabel: 'MIN Rate',
                align: 'right',
                width: 70,
                name: 'user_regularpay'
            },
            {
                fieldLabel: 'MAX Rate',
                align: 'right',
                width: 70,
                name: 'user_otbpay'
            },
            {
                fieldLabel: 'Pay Type',
                xtype: 'combo',
                store: userPayTypes,
                mode: 'local',
                triggerAction: 'all',
                typeAhead: 'false',
                displayField: 'value',
                valueField: 'id',
                name: 'user_paytype'
			},
            {
                fieldLabel: 'Weekly Hours',
                align: 'right',
                width: 70,
                name: 'user_weekhours'
            },
            {
                fieldLabel: 'Sick Days',
                align: 'right',
                width: 70,
                name: 'user_sickdays'
            },
            {
                fieldLabel: 'Paid Days',
                width: 70,
                align: 'right',
                name: 'user_paiddays'
            },
            {
                fieldLabel: 'Vacation Days',
                width: 70,
                name: 'user_vacdays'
            },
            {
                fieldLabel: 'Employee Type',
                xtype: 'combo',
                store: userTypes,
                mode: 'local',
                triggerAction: 'all',
                typeAhead: 'false',
                displayField: 'value',
                valueField: 'id',
                name: 'user_type'
            },
            {
                fieldLabel: 'Password',
                disabled: true,
                inputType: 'password',
                name: 'user_password',
				value: '******'
            },
            {
                xtype: 'button',
                text: 'Change Password',
				width: 100,
                cls: 'lock',
                handler: function () {
                   passwordWindow.show(); 
                }
            }]
        }],
        buttonAlign: 'center',
        buttons: [{
            text: 'Save',
            handler: function () {
                gid = Ext.getCmp('usersGrid');
                var user_id = gid.getSelectionModel().getSelected().data.user_id;
                var company_id = gid.getSelectionModel().getSelected().data.company_id;
                var user_type = gid.getSelectionModel().getSelected().data.user_type;
                userForm.getForm().submit({
                //Ext.getCmp('userForm').submit({
                    waitMsg: 'Saving...',
					method: 'POST',
                    //url: 'data.php?task=saveUser&user_id='+user_id,
                    url: 'data.php',
					params:{user_id: user_id,task: 'saveUser'},
                    success: function () {
                        Ext.MessageBox.alert('Message', 'Data has been saved'); // clear the form
                        userForm.getForm().load();
                        usersDS.reload();
                    },
                    failure: function () {
                        Ext.MessageBox.alert('Message', 'Saving data failed');
                    }
                });
            }
        },
        {
            text: 'Cancel',
            handler: function () {
                userForm.getForm().reset();
            }
        }]
    });


	var userSchedule = new Ext.Panel({
		id: 'userSchedule',
		frame: false,
		border: false,
        items: [{
        }]

	});
    var formTab =new Ext.Panel({
        id: 'formTab',
        title: 'Details',
        containerScroll: true,
        frame: false,
        iconCls : 'user',
        border: false,
        items: [userForm]
    });

	var scheduleTab =new Ext.Panel({
		id: 'scheduleTab',
		title: 'Schedule',
		iconCls: 'calendar',
        containerScroll: false,
        frame: false,
        iconCls : 'calendar',
        border: false,
		items: [userSchedule]

	});

    var eastTabs = new Ext.TabPanel({
        id: 'eastTabs',
        stateId: 'esid',
        stateful: true,
        split: true,
        border: false,
        animate: false,
        autoScroll: true,
        activeTab: 0,
        layout: '',
        enableTabScroll: true,
        animScroll: false,
        defaults: {autoScroll:true},
        items: [formTab,scheduleTab]
    })

    var eastPanel = new Ext.Panel({
        region: 'east',
        id: 'eastPanel',
        layout: 'fit',
        autoScroll: true,
        border: false,
        containerScroll: true,
        items: [userForm]
    });


    var usersGrid = new Ext.grid.GridPanel({
        id: 'usersGrid',
        loadMask: true,
        stripeRows: true,
		border: false,
		autoSizeColumns: true,
        autoWidth: true,
		autoScroll: true,
        //clickstoEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
		height: 300,
        store: usersDS,
        cm: usersColumnModel,
        autoExpandColumn: 'Name',
        trackMouseOver: true,
        listeners: {
            rowclick: function () {
                gid = Ext.getCmp('usersGrid');
                usd = Ext.getCmp('userSchedule');
                uid = Ext.getCmp('userForm');
                eid = Ext.getCmp('east');
                uid.enable();
                eid.enable();
                eid.expand();
                var user_id = gid.getSelectionModel().getSelected().data.user_id;
                var company_id = gid.getSelectionModel().getSelected().data.company_id;
                var user_paytype = gid.getSelectionModel().getSelected().data.user_paytype;
                var user_type = gid.getSelectionModel().getSelected().data.user_type;
                userForm.getForm().reset();
                userForm.getForm().load({
                    waitMsg: 'Loading...',
                    url: 'data.php',
                    params: {
                        task: 'loadUserForm',
                        user_id: user_id
                    },
                    success: function (f, a) {
                        //Ext.Msg.alert('load success');
						if (company_id) {
							userForm.getForm().findField('company_name').setValue(company_id);
						}
                        userForm.getForm().findField('user_paytype').setValue(user_paytype);
                        userForm.getForm().findField('user_type').setValue(user_type);
                        var user_active = userForm.getForm().findField('user_active').getValue(user_active);
                        if (user_active == 'Y') {
                            userForm.getForm().findField('user_active').checked = true;
                        } else {
                            userForm.getForm().findField('user_active').checked = false;
                        }

                        var user_photo = userForm.getForm().findField('user_photo').getValue(user_photo);
                        if (user_photo) {
                            Ext.getDom('pic').src = user_photo;
                        } else {
                            Ext.getDom('pic').src = 'images/unknown_male.png';
                        }
                    },
                    failure: function (f, a) {
                        Ext.Msg.alert('Load Failed: ' + a.result.errorMessage);
                    }
                });
            }
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 300,
            store: usersDS,
            displayInfo: true,
            displayMsg: 'Displaying Users {0} - {1} of {2}',
            emptyMsg: "No data to display" //display message when no records found
        }),
        tbar: [{
            text: 'Add Employee',
            tooltip: 'Click to Add a row',
            iconCls: 'user_add',
            handler: addRecord //what happens when user clicks on it
        },
        '-', //add a separator
        {
            text: 'Delete Employee',
            tooltip: 'Click to Delete selected row(s)',
            handler: handleDelete,
            iconCls: 'user_delete' //we create our own css with a class called 'add'
        },
        '-', //add a separator
        {
            text: 'Refresh',
            tooltip: 'Click to Refresh the table',
            handler: refreshGrid,
            iconCls: 'reload' //we create our own css with a class called 'add'
        },
        {
            xtype: 'tbseparator'
        },
        {
            text: 'Print',
            xtype: 'button',
            id: 'downloadpdf',
            tooltip: 'Download PDF File',
            icon: 'images/icons/printer.png',
            enableKeyEvents: true,
            handler: basic_printGrid
        },
        '-', {
            xtype: 'trigger',
            triggerClass: 'x-form-clear-trigger',
            onTriggerClick: function () {
                this.setValue('');
                usersDS.clearFilter();
            },
            id: 'usersfilter',
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
                            usersDS.clearFilter();
                            usersDS.filter('user_name', val, true, false);
                        }
                    }
                }
            }

        }],
        //this is the key to showing the GroupingStore
        view: new Ext.grid.GroupingView({
            forceFit: true,
            //custom grouping text template to display the number of items per group
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
        })
        /**/

    });
    usersDS.load();
    //usersGrid.addListener('afteredit', handleEdit); //give event name, handler (can use 'on' shorthand for addListener) 
    var viewport = new Ext.Viewport({
        stateId: 'viewport-stateid',
        stateful: true,
        layout: 'border',
        defaults: {
            collapsible: false,
            split: true
        },
        items: [
        {
            region: 'center',
            id: 'centerpanel',
			layout: 'fit',
			containerScroll: false,
            frame: false,
            border: false,
            autoScroll: true,
            items: [usersGrid]
        },
        {
            region: 'east',
            id: 'east',
            title: 'Employee Details',
            collapsible: true,
            collapseMode: 'mini',
            width: 440,
            frame: false,
            autoScroll: true,
            containerScroll: false,
            border: true,
            items: [eastPanel]
        }]
    });

    function basic_printGrid() {
        global_printer = new Ext.grid.XPrinter({
            grid: usersGrid,
            // grid object
            pathPrinter: './printer',
            // relative to where the Printer folder resides
            //logoURL: 'ext_logo.jpg', // relative to the html files where it goes the base printing
            pdfEnable: true,
            // enables link PDF printing (only save as)
            hasrowAction: false,
            localeData: {
                Title: 'Wall Systems Supply',
                subTitle: 'Employee Report',
                footerText: '&copy Wall Systems Supply, 2010 - Confidential and Proprietary',
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

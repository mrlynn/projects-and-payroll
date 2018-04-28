// reference local blank image
Ext.BLANK_IMAGE_URL = '/extjs/lib/resources/images/default/s.gif';

// create namespace
Ext.namespace('Test');

// create application
Test.app = function() {
  // do NOT access DOM from here; elements don't exist yet

  // private variables

  var Grid = {
    xtype: 'grid',
    isFormField: true, 
    fieldLabel: 'Projects',
    height: 100,
    width: 660,
    style: 'padding-bottom: 5px;',
    store: new Ext.data.JsonStore({
      fields : [ 'project_id','project_name' ],
      root   : 'projects',
      data: { projects: [ 
        { "id": 1, "name":"John Smith", "email":"jsmith@example.com"},
        { "id": 2, "name":"Anna Smith", "email":"asmith@example.com"}
      ]}
    }),
    columns: [
      {
        id: 'project_id', dataIndex: 'project_id', header: 'Project ID',
		},{
        id: 'project_name', dataIndex: 'project_name', header: 'Project Name'
      }
    ]
  };

  // private functions

  // public space
  return {
    // public properties, e.g. strings to translate
    
    // public methods
    init: function() {
    

  var Form = new Ext.form.FormPanel({
    renderTo: Ext.getBody(),
    id: 'FormPanel',
    title: 'Form',
    labelWidth: 60,
    width: 670,
	labelAlign: 'top',
    url: '/blackhole',
    bodyStyle: 'padding: 10px;',
    items: [
      {
        xtype: 'textfield',
		inputType: 'file',
        fieldLabel: 'Projects CSV',
		width: 500,
        name: 'csv'
      },
      Grid
    ],
    buttons: [{
      text: 'Submit',
      handler: function() {
        
        /* Add Projects as hidden fields */
        var store = Grid.store;
        
        for(i=0; i < store.data.length; i++)
        {
          var project = store.getAt(i);
          Ext.getCmp('FormPanel').add({
            xtype: 'hidden',
            name: 'projects[]',
            value: project.data.id
          });
        }
        
        Ext.getCmp('FormPanel').doLayout();
          
        Ext.getCmp('FormPanel').form.submit({
          waitMsg: 'Processing...',
          success: function(form,action){
            Ext.Msg.alert('Info',action.result.info);
          }
        });
        } // end of Main Button handler
      }
    ]
  });
  
    
    } // end of init
  };
}(); // end of app

Ext.onReady(Test.app.init, Test.app);


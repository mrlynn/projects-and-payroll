Ext.onReady(function(){
    Ext.QuickTips.init();

    var login = new Ext.FormPanel({ 
        labelWidth:80,
        url:'login.php', 
        frame:true, 
		iconCls: 'cog',
        title:'Wall Systems Supply - Please Login', 
        defaultType:'textfield',
		monitorValid:true,
	// Specific attributes for the text fields for username / password. 
	// The "name" attribute defines the name of variables sent to the server.
        items:[{ 
                fieldLabel:'Username', 
                name:'uname'
            },{ 
                fieldLabel:'Password', 
                name:'pass', 
                inputType:'password'
            },{
				xtype: 'hidden',
				name: 'action',
				value: 'login'
            //},envCombo
            }
		],
 
	// All the magic happens after the user clicks the button     
        buttons:[{ 
                text:'Login',
                // Function that fires when user clicks the button 
                handler:function(){ 
                    login.getForm().submit({ 
                        method:'POST', 
                        waitTitle:'Connecting', 
                        waitMsg:'Sending data...',
                        success:function(){ 
				window.location='home.php';
                        },
                        failure:function(form, action){ 
			    obj = Ext.util.JSON.decode(action.response.responseText); 
			    Ext.MessageBox.alert('Login Failed!', obj.message); 
                            login.getForm().reset(); 
                        } 
                    }); 
                } 
            }]
    });
 
 
	// This just creates a window to wrap the login form. 
	// The login object is passed to the items collection.       
    var win = new Ext.Window({
        layout:'fit',
        width:300,
        height:190,
        closable: false,
        resizable: false,
        plain: true,
        border: false,
        items: [login]
	});
	win.show();
});

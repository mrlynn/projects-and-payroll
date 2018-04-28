Ext.namespace('Ext.ux.layout');
Ext.ux.layout.TableFormLayout = Ext.extend(Ext.layout.TableLayout,
{
    renderAll : function(ct, target)
    {
        var items = ct.items.items;
        for (var i = 0, len = items.length; i < len; i++)
        {
            var c = items[0]; // use 0 index because the array shrinks by one after each call to renderItem()
            if (c && (!c.rendered || !this.isValidParent(c, target)))
            {
                this.renderItem(c, i, target);
            }
        }
    },

    renderItem : function(c, position, target){
        if (c && !c.rendered)
        {
			var td = this.getNextCell(c);
			var p = new Ext.Panel(Ext.apply(this.container.formConfig,
			{
				layout: 'form', // this is the tableform layout so force each cell panel to have a form layout
				items: c,
				renderTo: td
			}));
        }
    }
});
Ext.Container.LAYOUTS['tableform'] = Ext.ux.layout.TableFormLayout;

Ext.onReady(function()
{
	Ext.QuickTips.init();

	var p = new Ext.Panel(
	{
		layout: 'tableform',
		title: 'Table-Form Layout',
		bodyStyle: 'padding:6px',
		renderTo: Ext.getBody(),
		layoutConfig: {columns:3},
		formConfig: // config options to be applied to each panel in each table cell
		{
			layoutConfig:
			{
				labelSeparator: ''
			},
			bodyStyle: 'padding:0 3px',
			labelAlign: 'top',
			border: false
		},
		items:
		[
			{
				xtype: 'textfield',
				fieldLabel: 'Field 1',
				name: 'Field1',
				width: 115
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Field 2',
				name: 'Field2',
				width: 115
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Field 3',
				name: 'Field3',
				width: 115
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Field 4',
				name: 'Field4',
				width: 115
			},
			{
				colspan: 2,
				xtype: 'textfield',
				fieldLabel: 'Field 5',
				name: 'Field5',
				width: 236
			}
		]
	});
});

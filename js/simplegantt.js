Ext.ns('App');

Ext.onReady(function() {
    Ext.BLANK_IMAGE_URL = 'http://extjs.cachefly.net/ext-3.1.0/resources/images/default/s.gif';
    
    if (typeof console === 'undefined') {
        console = {
            log : Ext.log,
            error : Ext.log
        };
    }
    
    App.Scheduler.init();
});


App.Scheduler = {
    
    // Initialize application
    init : function() {
        
        var start = new Date();
        start.clearTime();
        
        // Make sure interval starts on a monday. 
        while (start.getDay() != 1) {
            start = start.add(Date.DAY, -1);
        }
        
        this.grid = this.createGrid();
        
        this.initStoreEvents();
        
        this.win = new Ext.Window({
            layout : 'border',
            height: 450,
            onEsc : Ext.emptyFn,
            width: 900,
            title : 'Simple Gantt Chart',
            items : [
                {
                    bodyStyle: 'padding:10px',
                    region:'north',
                    height:50
                    //html : '<p>Here\'s an example of how to create a simple Gantt look, using a custom renderer for the group header. Each project uses a different color for its tasks too, which is done using only CSS.' +
                           //' Note that the js for the example code is not minified so it is readable. See <a href="simplegantt.js">simplegantt.js</a>.</p>'
                },
                this.grid
            ]
        });
        
        this.win.show();
       
        this.grid.setView(start, start.add(Date.DAY, 42), 'week', Sch.ViewBehaviour.WeekView, this.renderer);

        this.grid.store.loadData(data);
        this.grid.eventStore.loadData(eventData);
    },
    
    initStoreEvents : function() {
        var g = this.grid;
        
        g.eventStore.on('update', g.view.refresh, g.view);
        
        g.eventStore.on('add', function (store, recs, e) {
            var r = recs[0];
            r.set('Id', Ext.id());
            store.onCreateRecords(true, r, r.data);
            g.view.refresh();
        }, this);

    },
        
    renderer : function (event, resource) {
        return {
            // add data here to be applied to the event template
            cls : resource.get('Category').replace(' ', '')
        };
    },
    
    createGrid : function() {
        
        // Store holding all the resources
        var resourceStore = new Ext.data.GroupingStore({
            groupField : 'Category',
            sortInfo:{field: 'Id', direction: "ASC"},
            reader : new Ext.data.JsonReader({
                    idProperty : 'Id'
                }, [
                    'Id', 
                    'Category',
                    'Name'
                ]
            )
        });
        
        // Store holding all the events/tasks
        var eventStore = new Ext.data.JsonStore({
            url : 'data.php',
			params: {task: 'getprojects'},
            sortInfo : {field: 'project_id', direction: "ASC"},
            idProperty : 'project_id', 
            fields : [
                // 4 mandatory fields
                {name:'project_id', type:'int'},
                {name:'project_name'},
                {name:'project_startdate', type : 'date', dateFormat:'time'},
                {name:'project_enddate', type : 'date', dateFormat:'time'}
                
                // Your task meta data goes here
                // ....
            ]
        });
        
        var g = new Sch.SchedulerPanel({
            region : 'center',
            
            // Setup your static columns
            columns : [
               {header : 'Tasks', sortable:true, width:170, dataIndex : 'Name'},
               {header : '', width:150, dataIndex : 'Category'}
            ],
            
            view: new Sch.SchedulerGroupingView({
                forceFit:true,
                showGroupName : false,
                hideGroupedColumn : true,
                groupHeaderTpl : new Ext.Template(
                    '{title}',
                    '<div class="groupHeaderLeft" style="width:{width}px;left:{left}px">',
                        '<div class="groupHeaderRight"></div>',
                    '</div>'
                ).compile(),
                groupHeaderRenderer : this.groupHeaderRenderer // Draws the grouping header bars
            }),
            
            store : resourceStore,
            eventStore : eventStore,
            border : false,
            
            bbar : [
                {
                    iconCls : 'icon-prev',
                    scope : this,
                    scale : 'medium',
                    handler : function() {
                        var s = g.getStart();
                        if (Ext.getCmp('span2').pressed) {
                            this.grid.setView(s.add(Date.DAY, -7), s, 'day', Sch.ViewBehaviour.DayView, this.renderer);
                        } else if (Ext.getCmp('span3').pressed) {
                            this.grid.setView(s.add(Date.DAY, -42), s, 'week', Sch.ViewBehaviour.WeekView, this.renderer);
                        } else {
                            this.grid.setView(s.add(Date.MONTH, -6), s, 'month', Sch.ViewBehaviour.MonthView, this.renderer);
                        }
                    }
                },
                '            ',
                {
                    id : 'span2',
                    enableToggle : true,
                    text: '1 week',
                    toggleGroup: 'span',
                    scope : this,
                    handler : function() {
                        var s = g.getStart();
                        while (s.getDay() != 1) s = s.add(Date.DAY, -1);
                        this.grid.setView(s, s.add(Date.DAY, 7), 'day', Sch.ViewBehaviour.DayView, this.renderer);
                    }
                },
                '            ',
                {
                    id : 'span3',
                    enableToggle : true,
                    text: '6 weeks',
                    pressed: true,
                    toggleGroup: 'span',
                    scope : this,
                    handler : function() {
                        var s = g.getStart();
                        while (s.getDay() != 1) {
                            s = s.add(Date.DAY, -1);
                        }
                        this.grid.setView(s, s.add(Date.DAY, 42), 'week', Sch.ViewBehaviour.WeekView, this.renderer);
                    }
                },
                '            ',
                {
                    id : 'span4',
                    enableToggle : true,
                    text: '6 months',
                    toggleGroup: 'span',
                    scope : this,
                    handler : function() {
                        var s = g.getStart();
                        s.setDate(1);
                        this.grid.setView(s, s.add(Date.MONTH, 6), 'month', Sch.ViewBehaviour.MonthView, this.renderer);
                    }
                },
                '->',
                {
                    iconCls : 'icon-next',
                    scope : this,
                    scale : 'medium',
                    handler : function() {
                        var s = g.getStart();
                        
                        if (Ext.getCmp('span2').pressed) {
                            this.grid.setView(s.add(Date.DAY, 7), s.add(Date.DAY, 14), 'day', Sch.ViewBehaviour.DayView, this.renderer);
                        } else if (Ext.getCmp('span3').pressed) {
                            this.grid.setView(s.add(Date.DAY, 42), s.add(Date.DAY, 84), 'week', Sch.ViewBehaviour.WeekView, this.renderer);
                        } else {
                            this.grid.setView(s.add(Date.MONTH, 6), s.add(Date.MONTH, 12), 'month', Sch.ViewBehaviour.MonthView, this.renderer);
                        }
                    }
                }
            ],
            
            listeners : {
                dragcreateend : {
                    fn : function(g, data, e) {
                        var b = new this.grid.eventStore.recordType({
                            ResourceId : data.record.get('Id'),
                            StartDate : data.startDate,
                            EndDate : data.endDate,
                            Duration : Date.getDurationInMinutes(data.startDate, data.endDate)
                        });
                        
                        this.grid.eventStore.add(b);
                    },
                    scope : this
                }
            },
            
            trackMouseOver : false
        });
        
        return g;
    },
    
    // Simple hack to show a ganttish grouping header
    groupHeaderRenderer : function(store, groupData) {
        var width, 
            left, 
            g = this.grid,
            viewStart = g.getStart(),
            viewEnd = g.getEnd(),
            headerStartDate = new Date(9999, 0, 1), 
            headerEndDate = new Date(0), 
            groupName = groupData.group,
            rs = groupData.rs,
            evtStart,
            evtEnd;
        
        g.eventStore.queryBy(function(r){
            if (rs.indexOf(store.getById(r.get('ResourceId'))) < 0) {
                return;
            }
            
            evtStart = r.get('StartDate');
            evtEnd = r.get('EndDate');
            
            if (Date.intersectSpans(evtStart, evtEnd, viewStart, viewEnd)) {
                if (evtStart < headerStartDate) {
                    headerStartDate = evtStart;
                }
                
                if (evtEnd > headerEndDate) {
                    headerEndDate = evtEnd;
                }
            }
        });
        
        if (headerStartDate.getFullYear() === 9999) return groupData.group;
        
        left = g.getXFromDate(Date.max(headerStartDate, viewStart));
        if (left < 0) return groupData.group;
        
        var endX = g.getXFromDate(headerEndDate);
        
        if (!endX) {
            endX = g.getXFromDate(viewEnd);
        }
        
        width = endX - left;
        
        return this.groupHeaderTpl.apply({
            title : groupData.group,
            width : width + 1, 
            left : left
        });
    }
};

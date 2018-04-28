<?php
?>
<html>
<head>
<title id='page-title'>Visual Planner</title>
<link rel='stylesheet' type='text/css' href='css/fullcalendar.css' />
    <link rel="stylesheet" href="extjs/resources/css/ext-all.css" />
    <script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="extjs/ext-all-debug.js"></script>

<script type='text/javascript' src='js/jquery.js'></script>
<script type='text/javascript' src='js/jquery/ui.core.js'></script>
<script type='text/javascript' src='js/jquery/ui.draggable.js'></script>
<script type='text/javascript' src='js/jquery/ui.resizable.js'></script>
<script type='text/javascript' src='js/fullcalendar.js'></script>
<script type='text/javascript'>

	$(document).ready(function() {
	
		$('#calendar').fullCalendar({
		
			editable: false,
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			defaultView: 'agendaDay',
			events: 'data.php?task=showTasksCalendar',
			
			eventDrop: function(event, delta) {
				alert(event.title + ' was moved ' + delta + ' days\n' +
					'(should probably update your database)');
			},
			
			loading: function(bool) {
				if (bool) $('#loading').show();
				else $('#loading').hide();
			}
			
		});
		
	});

</script>
<style type='text/css'>

	body {
		margin-top: 10px;
		text-align: center;
		font-size: 11px;
		font-family: "Lucida Grande",Helvetica,Arial,Verdana,sans-serif;
		}
		
	#loading {
		position: absolute;
		top: 5px;
		right: 5px;
		}

	#calendar {
		width: 90%;
		text-align:'left';
		margin: 10px auto;
		}


</style>

</head>
<body>
<div id='calendar'></div>
</body>
</html>

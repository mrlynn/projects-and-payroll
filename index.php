<?php
//session_start();
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Cache-Control: no-cache");
header("Pragma: no-cache");
require_once 'includes/defines.php';
require_once 'includes/database.php';
require_once 'includes/common.php';
$Auth= new Authorize();
$Auth->IsLoggedOn('login.php');

?>
<html>
<head>
	<title>Projects and Payroll</title>
	<link rel="stylesheet" href="css/custom.css" />
	<link rel="stylesheet" href="css/calendar.css" />
	<link rel="stylesheet" href="extjs/resources/css/ext-all.css" />
	<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="extjs/ext-all-debug.js"></script>
	<script type="text/javascript" src="js/ux/Ext.ux.tree.TreeFilterX.js"></script>
	<script type="text/javascript" src="js/ux/Ext.ux.tree.RemoteTreePanel.js"></script>
	<script type="text/javascript" src="js/ux/Ext.ux.form.DateTime.js"></script>
	<script type="text/javascript" src="js/ux/Ext.ux.SelectBox.js"></script>
	<script type="text/javascript" src="js/RowEditor.js"></script>
	<script type="text/javascript" src="js/ux/RowLayout.js"></script>
	<script type="text/javascript" src="js/calendar.js"></script>
	<script type="text/javascript" src="js/miframe.js"></script>
	<script type="text/javascript" src="js/application.js"></script>
	<script type="text/javascript" src="js/About.js"></script>
	<script type="text/javascript" src="printer/extjs_printer.js"></script>
	<script type="text/javascript" src="js/ux/Printer.js"></script>
	<script type="text/javascript" src="js/ux/renderers/Base.js"></script>
	<script type="text/javascript" src="js/ux/renderers/GridPanel.js"></script>
    <style>
        .ux-cal-highlight { background-color: gray; }
    </style>
</head>
<body>
    <div id="header"><h1>Projects and Payroll</h1></div>
<div id="loading-mask"></div>
<div id="loading">
  <div class="loading-indicator">
    Loading...
  </div>
</div>
    <div style="display:none;">
<div id="projects-details">
<!-- This text will display in the details planel -->
    <h2>Project Administration</h2>
    <p><h3>Current Status: <i>Under Development</i></h3></p>
    <p>Use <b>Project Administration</b> to maintain project level data.  The grid in the center panel will contain data for all projects.  Double-click a row to begin editing.
<p>The projects display grid is grouped into sections by company.  To minimize projects associated with a company, locate the minus sign and label associated with that company in the grid display and click it.
</div>
<div id="users-details">
    <h2>Employee Administration</h2>
    <p><h3>Current Status: <i>Under Development</i></h3></p>
    <p>Use <b>Employee Administration</b> to maintain user level data.  The grid in the center panel will contain data for all projects.  Double-click a row to begin editing.
</div>
<div id="companies-details">
    <h2>Company Administration</h2>
    <p><h3>Current Status: <i>Under Development</i></h3></p>
    <p>Use <b>Company Administration</b> to maintain company data.  The grid in the center panel will contain data for all projects.  Double-click a row to begin editing.
</div>
<div id="planner-details">
    <h2>Visual Planner </h2>
</div>

<div id="scheduling-details">
    <h2>Schedule Administration</h2>
	<p>To begin, select a date range from the date selector <img src=images/date_range.png> in the toolbar in the center section of the page.  Clicking OK in the date selector will tell cause scheduled tasks within that date range to display in the center grid.  If you wish to restrict the display to only a given company, select that company from the company dropdown <img src=images/select_company.png> prior to selecting a date range.
	<p>To add a schedule assignment, click the add schedule button <img src=images/add_schedule.png>.
</div>
<div id="timesheets-details">
    <h2>Timesheet Administration</h2>
    <p>Use <b>Timesheet Administration</b> to create and maintain employee timesheets.
</div>
<div id="map-details">
    <h2>Project Map</h2>
    <p><h3>Current Status: <i>Under Development</i></h3></p>
    <p>Use the <b>Project Map</b> to view a map of all projects.
</div>
<div id="settings-details">
    <h2>Settings Administration</h2>
    <p><h3>Current Status: <i>Under Development</i></h3></p>
    <p>Use <b>Settings Administration</b> to create and maintain important settings which control how the system works. <p id='caution'>EXERCISE EXTREME CAUTION WHEN EDITING THESE SETTINGS</p>
</div>
<div id="about-details">
    <h2>About WSS Payroll and Scheduling</h2>
<p>More information soon.</p>
</div>
<div id="payroll-details">
    <h2>About WSS Payroll and Scheduling</h2>
    <p><h3>Current Status: <i>Under Development</i></h3></p>
    <p>Use <b>Payroll Reporting</b> to create and view payroll reports.
</div>
<div id="labor-details">
    <h2>About WSS Payroll and Scheduling</h2>
    <p><h3>Current Status: <i>Under Development</i></h3></p>
    <p>Use <b>Labor Reporting</b> to create and view labor reports.
</div>
<div id="daysoff-details">
    <h2>About WSS Payroll and Scheduling</h2>
    <p><h3>Current Status: <i>Under Development</i></h3></p>
<p>Use <b>Days Off Reporting</b> to create and view employee days-off.
</div>

</div>
</body>
</html>
<?

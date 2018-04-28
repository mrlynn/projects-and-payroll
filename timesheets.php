<?php
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
<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
	<title id=page-title>Timesheets</title>
	<link rel="stylesheet" href="css/custom.css" />
	<link rel="stylesheet" href="css/page.css" />
	<link rel="stylesheet" href="css/calendar.css" />
	<link rel="stylesheet" href="extjs/resources/css/ext-all.css" />
	<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="extjs/ext-all-debug.js"></script>
	<script type="text/javascript" src="printer/extjs_printer.js"></script>
	<script type="text/javascript" src="js/ux/GroupSummary.js"></script>
	<script type="text/javascript" src="js/ux/printerfriendly/config.js"></script>
	<script type="text/javascript" src="js/ux/printerfriendly/init.js"></script>
    <script type="text/javascript" src="js/ux/ClearableComboBox.js"></script>
    <script type="text/javascript" src="js/ux/Ext.form.DateField.js"></script>
    <script type="text/javascript" src="js/ux/componentdataview.js"></script>
    <script type="text/javascript" src="js/ux/js/Ext.ux.grid.RowActions.js"></script>
	<script type="text/javascript" src="js/jsDate.js"></script>
	<script type="text/javascript" src="js/timesheets.js"></script>
</head>
<body>
<div id="loading-mask"></div>
<div id="loading">
  <div class="loading-indicator">
      Loading...
    </div>
</div>

<div id="ct-wrap">
<div id="ct">

<h1>Timesheets</h1>
<p>
Currently under redevelopment.  The system has been redesigned using a new menu and table maintenance interface.  A primary goal of the modifications was to increase ease of use.
<p>
<h1>Support and Contacts</h1>
<p>
To obtain support for this version of the Wall Systems Supply Payroll and Scheduling System, contact <a href=mailto:merlynn@gmail.com><img src=images/icons/user.png border=0>Mike Lynn</a> at (215) 932-0048.
<p>
</div>
</div>
</body>
</html>

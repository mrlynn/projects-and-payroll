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
	<title id=page-title>Scheduling</title>
	<link rel="stylesheet" href="css/custom.css" />
	<link rel="stylesheet" href="css/page.css" />
	<link rel="stylesheet" href="css/calendar.css" />
	<link rel="stylesheet" href="extjs/resources/css/ext-all.css" />
	<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="extjs/ext-all.js"></script>
	<script type="text/javascript" src="js/ux/Ext.form.DateField.js"></script>
	<script type="text/javascript" src="js/ux/RowLayout.js"></script>
	<script type="text/javascript" src="js/ux/ClearableComboBox.js"></script>
	<script type="text/javascript" src="js/calendar.js"></script>
	<script type="text/javascript" src="js/WSSGrid.js"></script>
	<script type="text/javascript" src="js/scheduling.js"></script>
</head>
<body>
<div id="ct-wrap">
<div id="ct">

<!--<h1>Scheduling</h1>
<p>
Currently under redevelopment.  The system has been redesigned using a new menu and table maintenance interface.  A primary goal of the modifications was to increase ease of use.
<p>
<h1>Support and Contacts</h1>
<p>
To obtain support for this version of the Wall Systems Supply Payroll and Scheduling System, contact <a href=mailto:merlynn@gmail.com><img src=images/icons/user.png border=0>Mike Lynn</a> at (215) 932-0048.
<p>
</div>
</div>-->

</body>
</html>

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
	<title id=page-title>Labor Reporting</title>
	<link rel="stylesheet" href="css/custom.css" />
	<link rel="stylesheet" href="css/page.css" />
	<link rel="stylesheet" href="css/calendar.css" />
	<link rel="stylesheet" href="extjs/resources/css/ext-all.css" />
	<script type="text/javascript" src="extjs/adapter/ext/ext-base-debug.js"></script>
	<script type="text/javascript" src="extjs/ext-all-debug.js"></script>
    <script type="text/javascript" src="js/ux/ClearableComboBox.js"></script>
    <script type="text/javascript" src="js/ux/Ext.ux.grid.GridSummary.js"></script>
    <script type="text/javascript" src="js/ux/GroupSummary.js"></script>
	<script type="text/javascript" src="js/labor.js"></script>
</head>
<body>
</body>
</html>

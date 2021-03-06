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
	<title id='page-title'>Employee Administration</title>
	<link rel="stylesheet" href="css/custom.css" />
	<link rel="stylesheet" href="css/page.css" />
	<link rel="stylesheet" href="css/calendar.css" />
	<link rel="stylesheet" href="extjs/resources/css/ext-all.css" />
	<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="extjs/ext-all-debug.js"></script>
        <script type="text/javascript" src="js/ux/FileUploadField.js"></script>
        <script type="text/javascript" src="js/ux/Ext.ux.md5.js"></script>
        <script type="text/javascript" src="js/ux/Printer.js"></script>
        <script type="text/javascript" src="printer/extjs_printer.js"></script>
	<script type="text/javascript" src="js/RowEditor.js"></script>
	<script type="text/javascript" src="js/calendar.js"></script>
	<script type="text/javascript" src="js/miframe.js"></script>
<script type='text/javascript' src='js/jquery.js'></script>
<script type='text/javascript' src='js/jquery/ui.core.js'></script>
<script type='text/javascript' src='js/jquery/ui.draggable.js'></script>
<script type='text/javascript' src='js/jquery/ui.resizable.js'></script>
<script type='text/javascript' src='js/fullcalendar.js'></script>

	<script type="text/javascript" src="js/users.js"></script>
    <style>
        .ux-cal-highlight { background-color: gray; }
    </style>


</head>
<body>
</body>
</html>

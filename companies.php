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
	<title id='page-title'>Company Administration</title>
	<link rel="stylesheet" href="css/custom.css" />
	<link rel="stylesheet" href="css/page.css" />
	<link rel="stylesheet" href="css/calendar.css" />
	<link rel="stylesheet" href="extjs/resources/css/ext-all.css" />
	<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="extjs/ext-all.js"></script>
	<script type="text/javascript" src="js/RowEditor.js"></script>
	<script type="text/javascript" src="js/calendar.js"></script>
	<script type="text/javascript" src="js/miframe.js"></script>
	<script type="text/javascript" src="printer/extjs_printer.js"></script>
	<script type="text/javascript" src="js/WSSGrid.js"></script>
	<script type="text/javascript" src="js/companies.js"></script>
    <style>
        .ux-cal-highlight { background-color: gray; }
    </style>


</head>
<body>
</body>
</html>

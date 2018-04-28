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
	<title id='page-title'>Project Administration</title>
	<link rel="stylesheet" href="css/custom.css" />
	<link rel="stylesheet" href="css/page.css" />
	<link rel="stylesheet" href="css/calendar.css" />
	<link rel="stylesheet" href="extjs/resources/css/ext-all.css" />
	<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="extjs/ext-all-debug.js"></script>
	<script type="text/javascript" src="js/ux/Ext.ux.renderer.js"></script>
	<script type="text/javascript" src="js/ux/Printer.js"></script>
	<script type="text/javascript" src="js/ux/ExportGridToExcel.js"></script>
	<script type="text/javascript" src="printer/extjs_printer.js"></script>
	<script type="text/javascript" src="js/RowEditor.js"></script>
	<script type="text/javascript" src="js/calendar.js"></script>
	<script type="text/javascript" src="js/miframe.js"></script>
	<script type="text/javascript" src="js/WSSGrid.js"></script>
	<script type="text/javascript" src="js/ux/Ext.ux.UploadForm.js"></script>
	<script type="text/javascript" src="js/projects.js"></script>
    <style>
        .ux-cal-highlight { background-color: gray; }
    </style>
</head>
<body>
<div id="loading-mask"></div>
<div id="loading">
  <div class="loading-indicator">
	  Loading...
	</div>
</div>

</body>
</html>

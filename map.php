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
	<title id='page-title'>Project Map</title>
	<link rel="stylesheet" href="css/custom.css" />
	<link rel="stylesheet" href="css/page.css" />
	<link rel="stylesheet" href="css/calendar.css" />
	<link rel="stylesheet" href="extjs/resources/css/ext-all.css" />
	<!--<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAdRqhaQduw0J4BFaF113zExQq5DADlavnsxwm_svRhDZVmhroOhTot5Dr0GZEYx4Lz841OkLVd7CX1Q" type="text/javascript"></script>-->
	<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAACWYfEH5e_hcCG62gFVqEjxRa9S0MuYldy-ixR5hIvZ4a_vS5VhRu1TRBPOCQ3ErxfQuGHGV8hkRG4A" type="text/javascript"></script>
	<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="extjs/ext-all-debug.js"></script>
	<script type="text/javascript" src="js/ux/Ext.ux.GMapPanel.js"></script>
<!--	<script type="text/javascript" src="js/miframe.js"></script>-->
	<script type="text/javascript" src="js/map.js"></script>
</head>
<body>
</body>
</html>

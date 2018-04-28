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
	<title id=page-title>Wall Systems Supply Payroll and Scheduling System - Statistics</title>
	<link rel="stylesheet" href="css/custom.css" />
	<link rel="stylesheet" href="css/page.css" />
	<link rel="stylesheet" href="css/calendar.css" />
    <link rel="stylesheet" href="extjs/resources/css/ext-all.css" />

	<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="extjs/ext-all.js"></script>
	<script type="text/javascript" src="js/ux/Portal.js"></script>
	<script type="text/javascript" src="js/ux/PortalColumn.js"></script>
	<script type="text/javascript" src="js/ux/Portlet.js"></script>
	<script type="text/javascript" src="js/stats.js"></script>
    <style type="text/css">
    #container {
        padding:10px;
    }
    #container .x-panel {
        margin:10px;
    }
    #container .x-panel-ml {
        padding-left:1px;
    }
    #container .x-panel-mr {
        padding-right:1px;
    }
    #container .x-panel-bl {
        padding-left:2px;
    }

    #container .x-panel-br {
        padding-right:2px;
    }
    #container .x-panel-body {

    }
    #container .x-panel-mc {
        padding-top:0;
    }
    #container .x-panel-bc .x-panel-footer {
        padding-bottom:2px;
    }
    #container .x-panel-nofooter .x-panel-bc {
        height:2px;
    }
    #container .x-toolbar {
        border:1px solid #99BBE8;
        border-width: 0 0 1px 0;
    }
    //.chart {
        //background-image: url(chart.gif) !important;
    //}
    </style>

</head>
<body>
<div id="container">
    
</div>

</body>

</html>



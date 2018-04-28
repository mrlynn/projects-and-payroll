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
	<title id=page-title>Days Off Reporting</title>
	<link rel="stylesheet" href="css/custom.css" />
	<link rel="stylesheet" href="css/page.css" />
	<link rel="stylesheet" href="css/calendar.css" />
	<link rel="stylesheet" href="css/ux/datepickerplus.css" />
	<link rel="stylesheet" href="extjs/resources/css/ext-all.css" />
    <script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="extjs/ext-all.js"></script>
    <script type="text/javascript" src="printer/extjs_printer.js"></script>
    <script type="text/javascript" src="js/ux/GroupSummary.js"></script>
    <script type="text/javascript" src="js/ux/printerfriendly/config.js"></script>
    <script type="text/javascript" src="js/ux/printerfriendly/init.js"></script>
    <script type="text/javascript" src="js/ux/ClearableComboBox.js"></script>
    <script type="text/javascript" src="js/ux/Ext.form.DateField.js"></script>
	<script type="text/javascript" src="js/daysoff.js"></script>
    <style type="text/css">
        .x-grid3-cell-inner {
            font-family:"segoe ui",tahoma, arial, sans-serif;
        }
        .x-grid-group-hd div {
            font-family:"segoe ui",tahoma, arial, sans-serif;
        }
        .x-grid3-hd-inner {
            font-family:"segoe ui",tahoma, arial, sans-serif;
            font-size:12px;
        }
        .x-grid3-body .x-grid3-td-cost {
            background-color:#f1f2f4;
        }
        .x-grid3-summary-row .x-grid3-td-cost {
            background-color:#e1e2e4;
        }
        .icon-grid {
            background-image:url(../shared/icons/fam/grid.png) !important;
        }
        .x-grid3-dirty-cell {
            background-image:none;
        }
#grid-example .x-grid-col-1 {
	text-align: right;
}
#grid-example .x-grid-col-2{
	text-align: right;
}
#grid-example .x-grid-col-3 {
	text-align: right;
}
#grid-example .x-grid-col-4 {
	text-align: right;
}
#grid-example.x-grid-mso{
	border: 1px solid #6593cf;
}
#grid-example.x-grid-vista{
	border: 1px solid #b3bcc0;
}
#xml-grid-example{
	border: 1px solid #cbc7b8;
	left: 0;
	position: relative;
	top: 0;
}
#editor-grid .x-grid-col-2{
    text-align:right;
}
.x-grid3-td-topic b {
    font-family:tahoma, verdana;
    display:block;
}
.x-grid3-td-topic b i {
    font-weight:normal;
    font-style: normal;
    color:#000;
}
.x-grid3-td-topic .x-grid3-cell-inner {
    white-space:normal;
}
.x-grid3-td-topic a {
    color: #385F95;
    text-decoration:none;
}
.x-grid3-td-topic a:hover {
    text-decoration:underline;
}
.details .x-btn-text {
    background-image: url(details.gif);
}
.x-resizable-pinned .x-resizable-handle-south{
    background:url(../../resources/images/default/sizer/s-handle-dark.gif);
    background-position: top;
}
    </style>

</head>
<body>
<!--<div id="ct-wrap">
<div id="welcome" class="col">

<h1>About WSS Payroll and Scheduling System</h1>
<p>
Currently under redevelopment.  The system has been redesigned using a new menu and table maintenance interface.  A primary goal of the modifications was to increase ease of use.
<p>
<h1>Support and Contacts</h1>
<p>
To obtain support for this version of the Wall Systems Supply Payroll and Scheduling System, contact <a href=mailto:merlynn@gmail.com><img src=images/icons/user.png border=0>Mike Lynn</a> at (215) 932-0048.
<p>

    
</div>
</div>
-->

</body>
</html>

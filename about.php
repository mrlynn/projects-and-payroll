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
	<title id=page-title>About Wall Systems Supply Payroll and Scheduling System</title>
	<link rel="stylesheet" href="css/custom.css" />
	<link rel="stylesheet" href="css/page.css" />
	<link rel="stylesheet" href="css/calendar.css" />
	<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="extjs/ext-all.js"></script>
	<script type="text/javascript" src="js/ux/Ext.ux.form.DateTime.js"></script>
	<script type="text/javascript" src="js/ux/Ext.ux.SelectBox.js"></script>
<script language="JavaScript">
function correctPNG()
{
   for(var i=0; i<document.images.length; i++)
   {
      var img = document.images[i]
      var imgName = img.src.toUpperCase()

      if (imgName.substring(imgName.length-3, imgName.length) == "PNG")
      {
         var imgID = (img.id) ? "id='" + img.id + "' " : ""
         var imgClass = (img.className) ? "class='" + img.className + "' " : ""
         var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
         var imgStyle = "display:inline-block;" + img.style.cssText

         if (img.align == "left") imgStyle = "float:left;" + imgStyle
         if (img.align == "right") imgStyle = "float:right;" + imgStyle
         if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle

         var strNewHTML = "<span " + imgID + imgClass + imgTitle
             + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;"
             + imgStyle + ";"      + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
             + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>"

         img.outerHTML = strNewHTML
         i = i-1
      }
   }
}
window.attachEvent("onload", correctPNG);
</script>
</head>
<body>
<div id="ct-wrap">
<p>
    <div style="float:left;margin-left:10px;" ><img src="images/mini_wss.png" /></div>
            <div style="margin-left:210px;">
<div id="welcome" class="col">

<h1>About WSS Payroll and Scheduling System</h1>
<p>
<blockquote>
This version of this system is Currently under redevelopment.  The system has been redesigned using a new menu and table maintenance interface.  A primary goal of the modifications was to increase ease of use.
</blockquote>
<p>
<h1>Features</h1>
<ul>
<li>Administration for projects, users, companies, schedules and timesheets.  </li>
<li>Graphical user interface, similar to windows desktop applications such as Outlook.</li>
<li>State management... The application saves the function you were last using for your next visit.  When you return, it restores your previous session.</li>
<li>Built-in Help / Info System.  Left "Info" Panel provides dynamic information for the current task.</li>
</ul>
<h1>Support and Contacts</h1>
<p>
<blockquote>
To obtain support for this version of the Wall Systems Supply Payroll and Scheduling System, contact <a href=mailto:wsspayrollhelp@gmail.com><img src=images/icons/user.png border=0>Mike Lynn</a> at (215) 932-0048.
</blockquote>
<p>

    
</div>
</div>

</body>
</html>

<?php
include('includes/database.php');
include_once('includes/JSON.php');
$json=new Services_JSON();
$arr = array();
$rs = mysql_query("SELECT * FROM project"); 
$tmp = array();
$projects=array();
while($arr= mysql_fetch_array($rs)) {
	$projects[]=$arr;
}
print $json->encode($projects);

?>

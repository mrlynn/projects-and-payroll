<?
$user='payroll';   //user
$pw='payr0ll';     //user password
$db='wss_payroll_prod1';     //name of database
$table=''; //name of table data stored in
//make database connection
$connection = mysql_connect("localhost", $user, $pw) or
   die("Could not connect: " . mysql_error());
mysql_select_db($db) or die("Could not select database");

?>

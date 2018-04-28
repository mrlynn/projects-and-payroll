<?php

 error_reporting(E_ALL);
 ini_set("display_errors", 0);
//database parameters
$user='payroll';   //user
$pw='payr0ll';     //user password
$db='wss_payroll_prod';     //name of database
$table=''; //name of table data stored in
//make database connection
$connection = mysql_connect("localhost", $user, $pw) or
   die("Could not connect: " . mysql_error());
mysql_select_db($db) or die("Could not select database");



include_once('includes/functions.php');
$password = (isset($_POST['md5_password']) ? $_POST['md5_password'] : $_GET['md5_password']);
$user_id = (isset($_POST['user_id']) ? $_POST['user_id'] : $_GET['user_id']);
$sql="UPDATE user SET user_pass='$password' WHERE user_id='$user_id'";
$result=mysql_query($sql);
echo "{success:true}";
?>

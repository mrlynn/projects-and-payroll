<?php
//database parameters
$user='payroll';   //user
$pw='payr0ll';     //user password
$db='payroll';     //name of database
$table=''; //name of table data stored in

include_once('includes/functions.php');
//make database connection
$connection = mysql_connect("localhost", $user, $pw) or
   die("Could not connect: " . mysql_error());
mysql_select_db($db) or die("Could not select database");

$sql="SELECT stats_id,date_format(stats_date,'%Y-%m-%d') as stats_date,total_companies,total_users,total_projects,total_regularpay,total_otbpay from stats";
    $res=mysql_query($sql);
    $data=array();
    $total=mysql_num_rows($res);
    while ($obj=mysql_fetch_object($res)) {
        $data[]=$obj;
    }
	$result= new stdClass();
	$result->success=true;
	$result->data=$data;
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($result);  //encode the data in json format
    } else
    {
        $data = json_encode($result);  //encode the data in json format
    }
	echo $data;

?>

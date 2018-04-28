<?php

 error_reporting(E_ALL);
 ini_set("display_errors", 0);
//database parameters
$user='payroll';   //user
$pw='payr0ll';     //user password
//DEV:
$db='wss_payroll_prod1';     //name of database
//PROD: $db='payroll';     //name of database
$table=''; //name of table data stored in

include_once('includes/functions.php');
//make database connection
$connection = mysql_connect("localhost", $user, $pw) or die("Could not connect: " . mysql_error());
mysql_select_db($db) or die("Could not select database");

    $sql="SELECT * FROM company";
	$result=mysql_query($sql);
	$arr=array();
	while($obj=mysql_fetch_object($result)) {
		$children=get_users($obj->company_id);
		if ($children) {
			$tmp=array();
			$tmp['id']=$obj->company_name.$obj->company_id;
			$tmp['text']=$obj->company_name;
			$tmp['icon']='images/icons/building.png';
			$tmp['parent']=true;
			$tmp['leaf']=false;
			$tmp['children']=$children;
			$arr[]=$tmp;
		}
	}
//print_r($arr);
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }
	print $data;
exit;
function get_users($company_id) {
    $sql="SELECT * FROM user where company_id='$company_id'";
    $result=mysql_query($sql);
    $arr1=array();
	if (mysql_num_rows($result) > 0) {
    while ($obj=mysql_fetch_object($result)) {
        $tmp1=array();
        $tmp1['id']		=$obj->user_firstname.'-'.$obj->user_lastname.'-'.$obj->user_id;
        $tmp1['text']	=$obj->user_firstname.' '.$obj->user_lastname;
		if ( $obj->user_gender=='male' ) {
			$icon='user.png';
		} else {
			$icon='user_female.png';
		}
        $tmp1['icon']	='images/icons/'.$icon;
        $tmp1['leaf']	=true;
        $arr1[]			=$tmp1;
	}
	return $arr1;
	} else {
		return false;
	}
}
?>

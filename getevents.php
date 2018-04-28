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

$sql="SELECT * from assign ";
    $res=mysql_query($sql);
    $data=array();
    $total=mysql_num_rows($res);
    while ($obj=mysql_fetch_object($res)) {
        $data[]=$obj;
    }
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($data);  //encode the data in json format
    } else
    {
        $data = json_encode($data);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';
     //echo $cb . '({"total":"' . $total. '","data":' . $data . '})';
     echo $cb . '({"data":' . $data . '})';

?>

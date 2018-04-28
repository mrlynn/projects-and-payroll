<?php   

//database parameters
$user='payroll';   //user
$pw='payr0ll';     //user password
$db='payroll';     //name of database
$table=''; //name of table data stored in

//make database connection
$connection = mysql_connect("localhost", $user, $pw) or
   die("Could not connect: " . mysql_error());
mysql_select_db($db) or die("Could not select database");

	$sql="select hour.hour_id,task.task_id, task.task_name,project.project_name,project.project_id from hour join task on hour.task_id=task.task_id join project on task.project_id=project.project_id";

    $result = mysql_query($sql);

    while($rec = mysql_fetch_array($result, MYSQL_ASSOC)){
		$project_id=$rec['project_id'];
		$project_name=$rec['project_name'];
		$hour_id=$rec['hour_id'];
		print "Updating Hour Record ".$hour_id." with project id ".$project_id." ".$project_name."\n";
		$sql1="update hour set project_id='".$project_id."' where hour_id='".$hour_id."'";
		$results1=mysql_query($sql1);
    };

?>

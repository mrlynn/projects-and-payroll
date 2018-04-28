<?php
error_reporting(E_ALL);
ini_set("display_errors", 0);
#2010-06-10 03:53:50 www.wallsystemssupply.com /payroll/v2/project_import.php  DATA[0]=6305322
#2010-06-10 03:53:50 www.wallsystemssupply.com /payroll/v2/project_import.php  DATA[1]=11805
#2010-06-10 03:53:50 www.wallsystemssupply.com /payroll/v2/project_import.php  DATA[2]=3950 Bedford Avenue
#2010-06-10 03:53:50 www.wallsystemssupply.com /payroll/v2/project_import.php  DATA[3]=3950 Bedford Avenue
#2010-06-10 03:53:50 www.wallsystemssupply.com /payroll/v2/project_import.php  DATA[4]=
#2010-06-10 03:53:50 www.wallsystemssupply.com /payroll/v2/project_import.php  DATA[5]=Brooklyn
#2010-06-10 03:53:50 www.wallsystemssupply.com /payroll/v2/project_import.php  DATA[6]=NY
#2010-06-10 03:53:50 www.wallsystemssupply.com /payroll/v2/project_import.php  DATA[7]=00000
#2010-06-10 03:53:50 www.wallsystemssupply.com /payroll/v2/project_import.php  DATA[8]=2429.42
#2010-06-10 03:53:50 www.wallsystemssupply.com /payroll/v2/project_import.php  DATA[9]=
include_once("includes/db.php");
include_once('includes/functions.php');
$now=date('Y-m-d-h:i:s');
$target_path = 'uploads/' . basename( $_FILES['csv']['name']).'_'.$now; 
$failonerror = $_POST['failonerror'];
logit("failonerror: ".$failonerror);
if(move_uploaded_file($_FILES['csv']['tmp_name'], $target_path)) {
	$handle = fopen($target_path, "r");
	$exists=0;
	$new=0;
	$cols=array();
	while (($data = fgetcsv($handle, 10000, "\t")) !== FALSE)
	{

		foreach($data as $key=>$value) {
			$data[$key]=addslashes(trim($value));
logit("DATA[$key]=".$data[$key]);
		}

		$cnt=count($data);	
		$project_num=$data[1];
logit("Project: [".$project_num."]");
		if ($project_num=='+0' || $project_num=='BT2') {
			// skip
		} else {
		
			$sql="SELECT * FROM project WHERE project_num='".$project_num."'";
logit($sql);
			$res=mysql_query($sql);
			$rows=mysql_num_rows($res);
			$obj=mysql_fetch_object($res);
			if ($rows > 0) {
				$exists+=1;
				$materials_cost=$obj->project_cost + $data[8]; // add to existing
logit("data[8]=".$data[8]);
logit("obj->project_cost=".$obj->project_cost);
				backup($obj);
				$isql = "UPDATE project SET project_cost='".$materials_cost."' WHERE project_num='".$project_num."'";
logit("Updating Project $project_num with ".$materials_cost);
				$res=mysql_query($isql);
			} else {
				if ($project_num=='+0' || $project_num=='BT2') {
					// skip
				} else {
logit("Found a new project: $project_num");
					if (!isint($project_num)) {
						// skip - invalid project_num
logit("Skipping [".$project_num."]");
logit(isint($project_num));
					} else {
						$new+=1;
						$newlist.=" ".$project_num;
						$obj->project_id='';
						$obj->company_id='2';
						$obj->project_num=$project_num;
						$obj->project_name=$data[2];
						$obj->address=$data[3];
						$obj->city=$data[5];
						$obj->state=$data[6];
						$obj->zipcode=$data[7];
						$obj->project_cost=$data[8];
						backup($obj,'new');
						$isql = "INSERT into project (project_id,company_id,project_num,project_name,address,city,state,zipcode,project_cost) values ('','2','$project_num','$obj->project_name','$obj->address','$obj->city','$obj->state','$obj->zipcode','$obj->project_cost')";
						logit("Project: [$project_num]\n");
						$res=mysql_query($isql);
						if (!$res) {
							echo "{success: false,message:'Unable to upload".$_FILES['csv']['name']."<BR>Import died with error: ".mysql_error($res)."'}";
							exit;
						}
					}
				}
			}
			}
		}

		fclose($handle);
		echo "{success:true,message:'$new New Project Records<br>$newlist<br>$exists Records Updated<br>'}";
	} else {
	    echo "{success: false,message:'Unable to upload".$_FILES['csv']['name']."'}";
		exit;
	}
function backup($obj,$action) {
    $now=date('Y-m-d h:m:s');
	$sql="INSERT INTO project_import_history ( import_id,import_datetime,project_id,company_id,project_name,project_initials,project_startdate,project_enddate,project_cost,project_num,address,city,state,zipcode,project_status,latlon,hide,update_date,color,project_description,import_action) VALUES ( '','$now','$obj->project_id','$obj->company_id','$obj->project_name','$obj->project_initials','$obj->project_startdate','$obj->project_enddate','$obj->project_cost','$obj->project_num','$obj->address','$obj->city','$obj->state','$obj->zipcode','$obj->project_status','$obj->latlon','$obj->hide','$obj->update_date','$obj->color','$obj->project_description','$action')";
	$res=mysql_query($sql);
}
function logit($text) {
    $now=date('Y-m-d h:i:s');
    $debug_data=debug_backtrace();
    $function_name=$debug_data[1]['function'];
    $out=$now.' '.$_SERVER['SERVER_NAME'].' '.$_SERVER['PHP_SELF'].' '.$function_name.' '.$text."\n";
    file_put_contents('debug.log',$out,FILE_APPEND);
}

function isint( $mixed )
{
    return ( preg_match( '/^\d*$/'  , $mixed) == 1 );
}

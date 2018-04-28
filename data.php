<?php   

 error_reporting(E_ALL);
 ini_set("display_errors", 0); 
//database parameters
include_once('includes/functions.php');
include_once('includes/db.php');
$task = (isset($_POST['task']) ? $_POST['task'] : $_GET['task']);

// Debug
$debug=true;
//switchboard for the CRUD task requested
switch($task){
    case "weekGrid":
        weekGrid($_POST['week'],$_POST['uid']);
        break;
    case "showLabor":
        showLabor();
        break;
    case "addUser":
        addUser();
        break;
    case "upload":
        picupload();
        break;
    case "getmaps":
        getmaps();
        break;
    case "weekDropDown":
        weekDropDown();
        break;
	case "weekForm":
		weekForm();
		break;
    case "payroll_company":
        payrollReport('company');
        break;
    case "daysoff":
	    $start= (isset($_POST['startDate']) ? $_POST['startDate'] : $_GET['startDate']);
	    $end= (isset($_POST['endDate']) ? $_POST['endDate'] : $_GET['endDate']);
	    $company_id= (isset($_POST['company_id']) ? $_POST['company_id'] : $_GET['company_id']);
        daysoff($start,$end,$company_id,'all','json');
        break;
    case "payroll_employee":
        payrollReport('user');
        break;
    case "getTimesheets":
        getTimesheets();
        break;
    case "getEnvironments":
        getEnvironments();
        break;
    case "getCompany":
        getCompany();
        break;
    case "updateCompany":
        updateCompany();
        break;
    case "createProject":
        addData();
        break;
    case "showUsers_tree":
        showUsers();
        break;
    case "showUsers":
        showUsers();
        break;
    case "loadUserForm":
        loadUserForm();
        break;
    case "showProjects":
        showProjects();
        break;
    case "showTasks":
        showTasks();
        break;
    case "showTasksCalendar":
        showTasksCalendar();
        break;
    case "saveUser":
        saveUser();
        break;
    case "addTimeSheet":
	    $task = (isset($_POST['task']) ? $_POST['task'] : $_GET['task']);
	    $scheduledate = (isset($_POST['scheduledate']) ? $_POST['scheduledate'] : $_GET['scheduledate']);
	    $hour_num = (isset($_POST['hour_num']) ? $_POST['hour_num'] : $_GET['hour_numdate']);
		if ($task=='addTimeSheet') {
			$addtimesheet='on';
		} else {
			$addtimesheet = (isset($_POST['addtimesheet']) ? $_POST['addtimesheet'] : $_GET['addtimesheet']);
		}
	    $project_id = (isset($_POST['project_id']) ? $_POST['project_id'] : $_GET['project_id']);
	    $user_id = (isset($_POST['user_id']) ? $_POST['user_id'] : $_GET['user_id']);
        scheduleTask($scheduledate,$hour_num,$user_id,$project_id,$addtimesheet,'day');
        break;
    case "scheduleTask":
	    $task = (isset($_POST['task']) ? $_POST['task'] : $_GET['task']);
	    $scheduledate = (isset($_POST['scheduledate']) ? $_POST['scheduledate'] : $_GET['scheduledate']);
	    $hour_num = (isset($_POST['hour_num']) ? $_POST['hour_num'] : $_GET['hour_numdate']);
		if ($task=='addTimeSheet') {
			$addtimesheet='on';
		} else {
			$addtimesheet = (isset($_POST['addtimesheet']) ? $_POST['addtimesheet'] : $_GET['addtimesheet']);
		}
	    $project_id = (isset($_POST['project_id']) ? $_POST['project_id'] : $_GET['project_id']);
	    $user_id = (isset($_POST['user_id']) ? $_POST['user_id'] : $_GET['user_id']);
        scheduleTask($scheduledate,$hour_num,$user_id,$project_id,$addtimesheet,'day');
        break;
    case "readHour":
        showData('hour');
        break;
    case "readIndustry":
        getData('industry');
        break;
    case "updateProject":
        saveProject();
        break;
    case "update":
        saveData();
        break;
    case "get_hour_field":
        getHours($_POST['date'],$_POST['uid']);
        break;
    case "get_scheduled_hours":
        get_week_hours($_POST['week'],$_POST['uid'],'scheduled');
        break;
    case "get_week_hours":
        get_week_hours($_POST['week'],$_POST['uid'],'worked');
        break;
    case "delete":
        removeData();
        break;
    case "calcTax":
        getTax();
        break;
    case "getStats":
        getStats();
        break;
    default:
        echo "{success:false}";
        break;
}//end switch

function getFunctionName() {
	$backtrace = debug_backtrace();
	return $backtrace[2]['function'];
}
function logit($text) {
	$now=date('Y-m-d h:m:s');
	$debug_data=debug_backtrace();
	$function_name=$debug_data[1]['function'];
	$out=$now.' '.$_SERVER['SERVER_NAME'].' '.$_SERVER['PHP_SELF'].' '.$function_name.' '.$text."\n";
	file_put_contents('debug.log',$out,FILE_APPEND);
}
function picupload() {
    $photo = (isset($_POST['photo']) ? $_POST['photo'] : $_GET['photo']);
//print $photo;
	echo '{success:true,"data":' . $photo . '}';
	return;
}
function updateStats() {
	$today=date('Y-m-d H:i:s',time());
	$sql="select count(project_id) as total_projects from project where project_status='active'";
	$res=mysql_query($sql);
	while($obj=mysql_fetch_object($res)) {
		$total_projects=$res->total_projects;
	}
	$sql="select count(user_id) as total_users from user where user_status='active'";
	$res=mysql_query($sql);
	while($obj=mysql_fetch_object($res)) {
		$total_users=$res->total_users;
	}
	$sql="select count(company_id) as total_companies from company where company_status='active'";
	$res=mysql_query($sql);
	while($obj=mysql_fetch_object($res)) {
		$total_companies=$res->total_companies;
	}
	$sql="select sum(user_regularpay) as total_regularpay from user where user_status='active'";
	$res=mysql_query($sql);
	while($obj=mysql_fetch_object($res)) {
		$total_regularpay =$res->total_regularpay;
	}
	$sql="select sum(user_otbpay) as total_otbpay from user where user_status='active'";
	$res=mysql_query($sql);
	while($obj=mysql_fetch_object($res)) {
		$total_otbpay =$res->total_otbpay;
	}
	$sql="INSERT INTO stats (stats_id,stats_date,total_companies,total_employees,total_projects,total_regularpay,total_otbpay) VALUES ('','$today','$total_companies','$total_employees','$total_projects','$total_regularpay','$total_otbpay')";
	$res=mysql_query($sql);
}

function weekForm() {
	$addtimesheet='on';
	$fail=0;
	foreach ($_POST as $key => $value) {
    	$$key = addslashes(trim($value));
		list($field,$date,$user_id)=split('-',$key);
		list($month,$day,$year)=split('/',$date);
		if ($field=='hour_num') {
			$hour_num=$value;
			if ($hour_num > 0) {
				$project_id=$_POST['project_id-'.$month.'/'.$day.'/'.$year.'-'.$user_id];
				$scheduledate=$year.'-'.number_pad($month,2).'-'.number_pad($day,2);
				$scheduled = scheduleTask($scheduledate,$hour_num,$user_id,$project_id,$addtimesheet,'week');
				if (! $scheduled) {
					$fail+=1;
				}
			}
		}
  	}
	if ($fail>0) {
		print "{success:false}";
	} else {
		print "{success:true}";
	}
}
function weekDropDown() {
    $today = strtotime(date('Y-01-01'));
	$seconds_per_day = 86400;
	$days_per_week = 7;
	$weeks_per_year = 52;

    $dayofweek = date('w', $today);
    $firstday = $today - 86400 * ($dayofweek - 4);
    $start = $firstday - 86400 * 7 * 52;
    $end = $firstday + 86400 * 7 * 104;
    //$firstday = $today - 259200 * ($dayofweek - 4);
    $firstday = $today - ($seconds_per_day) * ($dayofweek - 4);
    $start = $firstday - ($seconds_per_day * 7 * 52) * 2;
    $end = $firstday + 259200 * 7 * 104;

logit("Firstday = ".$firstday);
logit("Start = ".$start);
logit("end = ".$end);
logit("dayofweek = ".$dayofweek);
    $week = array();
	class weeks {};
    for($i = $start; $i <= $end; $i += 86400 * 7){
		$weeks->date=date('Y-m-d', $i);
		$weeks->week=date('M j, Y', $i);
//logit($weeks->week);
		//$week[]=$weeks;
		$week[]=array('date'=>date('Y-m-d',$i), 'week'=>date('F j, Y', $i));
    }
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($week);  //encode the data in json format
    } else
    {
        $data = json_encode($week);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';
	echo $cb . '({success:true,"data":' . $data . '})';
}
function project_name($project_id) {
	$sql="select * from project where project_id='".$project_id."'";
	$result=mysql_query($sql);
	if ($result) {
		$rec=mysql_fetch_object($result);
		return $rec->project_name;
	} else {
		return (false);
	}
}

function scheduleTask($scheduledate,$hour_num,$user_id,$project_id,$addtimesheet,$type) {
    //$type is either 'week' or 'day' to account for multiple assignments coming from the weekly timesheet form
	$sql="select * from project where project_id='".$project_id."'";
	$result=mysql_query($sql);
	if ($result) {
		$rec=mysql_fetch_object($result);
		$task_description=$rec->project_name;
	} else {
		echo "{success:false,msg:'failed to fetch project name',sql:'$sql'}";	
		return;
	}
	$sql= "INSERT INTO task (task_id,project_id,user_id, task_name, task_description, task_startdate,task_enddate,task_duration) VALUES ('','$project_id','$user_id','$task_description','$task_description','$scheduledate','$scheduledate',$hour_num)";
	$result=mysql_query($sql);
	if ($result) {
		$task_id=mysql_insert_id();
	} else {
		//echo "{success:false,msg:'failed to insert task',sql:'$sql'}";
		echo "{success:false,msg:'failed to insert task'}";
		return;
	}
	$sql= "INSERT INTO assign (assign_id,task_id,user_id,assign_date,assign_num ) VALUES ('','$task_id','$user_id','$scheduledate',$hour_num)";
	$result=mysql_query($sql);
	if (!$result) {
		echo "{success:false,msg:'failed to insert assign',sql:'$sql'}";
	} 
	if ($addtimesheet=='on') {
		$sql="INSERT INTO hour (hour_id,user_id,task_id,hour_date,hour_num,project_id) VALUES ('','$user_id','$task_id','$scheduledate',$hour_num,$project_id)";
		$result=mysql_query($sql);
		if ($result) {
			if ($type=='week') {
				return true;
			} else {
				echo "{success:true}";
			}
		} else {
			if ($type=='week') {
				return false;
			} else {
				echo "{success:false,msg:'failed to insert timesheet',sql:'$sql'}";
			}
		}
	} else {
		if ($type=='week') {
			return true;
		} else {
			echo "{success:true}";
		}
	}
	return true;
}
function getmaps() {
    $mode = (isset($_POST['mode']) ? $_POST['mode'] : $_GET['mode']);
	if ($mode=='active') {
		$sql="SELECT project_id as id,address,city,state,zipcode,project_name as marker,latlon from project where project_status not like 'complete'";
	} else {
		$sql="SELECT project_id as id,address,city,state,zipcode,project_name as marker,latlon from project";
	}
    $res=mysql_query($sql);
    $data=array();
    $total=mysql_num_rows($res);
    while ($obj=mysql_fetch_object($res)) {
	    list($lat,$long)=explode(',',$obj->latlon);
		if (!$lat) {
			if (!$obj->address) {
				$obj->address=$obj->project_name;
				$obj->city="Brooklyn";
				$obj->state="NY";
			}
			$where = stripslashes($obj->address.','.$obj->city.', '.$obj->state);
			$whereurl = urlencode($where);
			$location = file("http://maps.google.com/maps/geo?q=$whereurl&output=csv&key=ABQIAAAAdRqhaQduw0J4BFaF113zExQq5DADlavnsxwm_svRhDZVmhroOhTot5Dr0GZEYx4Lz841OkLVd7CX1Q");
			list ($stat,$acc,$lat,$long) = explode(",",$location[0]);
		}
		$obj->lat=$lat;
		$obj->long=$long;
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

	$cb = isset($_GET['callback']) ? $_GET['callback'] : '';
	echo $cb . '({"total":"' . $total. '","data":' . $data . '})';
}
function number_pad($number,$n) {
return str_pad((int) $number,$n,"0",STR_PAD_LEFT);
}
function weekGrid($week,$uid) {
    $sdate=strftime("%Y-%m-%d",strtotime($week));
    $edate=strftime("%Y-%m-%d",strtotime("+6 days",strtotime($week)));
	$sql="SELECT assign.*,project.project_name from assign,task,project where assign.task_id=task.task_id and task.project_id=project.project_id and assign_date>='$sdate' and assign_date<='$edate' AND assign.user_id='$uid'";
	$result = mysql_query($sql);
	$total=mysql_num_rows($result);
	$arr = array();
	while($obj=mysql_fetch_object($result)) {
		$arr[]=$obj;
	}
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';
    echo $cb . '({"total":"' . $total. '","results":' . $data . '})';
}

function get_week_hours($week,$uid,$type) {
	$sdate=strftime("%Y-%m-%d",strtotime($week));
	$edate=strftime("%Y-%m-%d",strtotime("+6 days",strtotime($week)));
	if ($type=='worked') {
		$table='hour';
	} else {
		$table='assign';
	}
    $sql="SELECT hour_num as hours from $table WHERE ".$table."_date>='$sdate' and ".$table."_date<='$edate' AND user_id='$uid'";
    $res=mysql_query($sql);
    $data=array();
    $total=mysql_num_rows($res);
    while ($obj=mysql_fetch_object($res)) {
        $data['hours']+=$obj->hours;
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
    echo $cb . '({"total":"' . $total. '","results":' . $data . '})';
}

function getHours($date,$uid) {
	list($m,$d,$y) = split('/',$date);
	$mdate = $y.'-'.number_pad($m,2).'-'.number_pad($d,2);
	$sql="SELECT hour_num as hours from hour WHERE hour_date='$mdate' AND user_id='$uid'";
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
    echo $cb . '({"total":"' . $total. '","results":' . $data . '})';
}
function getStats() {
	$sql="SELECT * from stats";
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
     echo $cb . '({"total":"' . $total. '","data":' . $data . '})';
}	
function getTimesheets() {
	$company_id= (isset($_POST['company_id']) ? $_POST['company_id'] : $_GET['company_id']);
	$start= (isset($_POST['startDate']) ? $_POST['startDate'] : $_GET['startDate']);
	$end= (isset($_POST['endDate']) ? $_POST['endDate'] : $_GET['endDate']);
	$sql="select hour.hour_id,hour.hour_date,hour.hour_num,user.user_firstname,user.user_lastname,task.task_name,company.company_name from hour,user,task,company where hour.user_id=user.user_id and hour.task_id=task.task_id and user.company_id=company.company_id AND ";
	if ($company_id!='' && $company_id!='all') { 
		$sql.="user.company_id='".$company_id."' AND hour.hour_date >= '$start' and hour.hour_date <= '$end' ";
	} else {
		$sql.="hour.hour_date >= '$start' and hour.hour_date <= '$end' ";

	}
//print $sql;
    $result_count = mysql_query($sql);
    $rows = mysql_num_rows($result_count);

    $result = mysql_query($sql);
    $arr=array();
    while($rec=mysql_fetch_object($result)) {
	//	if ($rec->user_regularpay==0) {
			//$rate=$rec->user_otbpay;
			//$rec->user_regularpay=$rec->user_otbpay;
		//} else {
			//$rate=$rec->user_regularpay;
		//}
		//	
		//$cost=$rate * $rec->hour_num;
		//$rec->cost=$cost;
        $arr[]=$rec;
    }
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';
     echo $cb . '({"total":"' . $rows . '","results":' . $data . '})';
}
function get_user_company($user_id) {
	$sql="select user.company_id from user where user_id='".$user_id."'";
	$res=mysql_query($sql);
	while($obj=mysql_fetch_object($res)){ 
		$company_id=$obj->company_id;
	}
	return $company_id;
}
function pto_days_used_this_year($user_id,$date) {
	$this_year=strftime('%G',time());
	$sql = "SELECT sum(hour.hour_num) as hour_num,project.project_name from hour, project WHERE user_id='$user_id' AND YEAR(hour_date)='$this_year' AND hour.project_id=project.project_id AND (project.project_name='Vacation' OR project.project_name='Sick Days') GROUP BY hour.user_id";
	$result = mysql_query( $sql );
	while ( $obj = mysql_fetch_object( $result ) ) {
		$total_hours+=$obj->hour_num;
	}
	if ($total_hours > 0 ) {
		return $total_hours / 8;
	} else {
		return 0;
	}
}

function daysoff($start,$end,$company_id,$user_id,$type) {
	if ($user_id=='all') {
		$sql="select user.user_lastname,user.user_firstname,user.company_id,company.company_name,hour.hour_num,hour.user_id,project.project_name from hour,project,user,company where hour.user_id=user.user_id and user.company_id=company.company_id and hour.project_id=project.project_id and hour.hour_date >= '$start' AND hour.hour_date <= '$end' ";		
	} else {
		$sql="select user.user_lastname,user.user_firstname,user.company_id,company.company_name,hour.hour_num,hour.user_id,project.project_name from hour,project,user,company where hour.user_id=user.user_id and user.company_id=company.company_id and hour.project_id=project.project_id and hour.hour_date >= '$start' AND hour.hour_date <= '$end' and user_id='$user_id'";
	}
    $result_count = mysql_query($sql);
    $rows = mysql_num_rows($result_count);
    $result = mysql_query($sql);
    $arr=array();
	$total_hours=0;
    while($rec=mysql_fetch_object($result)) {
		$user_company=get_user_company($rec->user_id);
        if(($company_id!='' && $user_company==$company_id) || $company_id=='') {
			if ($rec->project_name=='Vacation' || $rec->project_name=='Holiday' || $rec->project_name=='Time Off') {
				$arr[]=$rec;
			}
        }
    }
	if ( $type=='json' ) {
	    if (version_compare(PHP_VERSION,"5.2","<"))
	    {
	        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
	        $json = new Services_JSON();//instantiate new json object
	        $data=$json->encode($arr);  //encode the data in json format
	    } else
	    {
	        $data = json_encode($arr);  //encode the data in json format
	    }
	    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';
	    echo $cb . '({"total":"' . $rows . '","results":' . $data . '})';
	} else {
		return $arr;
	}

}
function payrollReport($group) {
    $print= (isset($_POST['print']) ? $_POST['print'] : $_GET['print']);    
    $start_num= (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);    
    $limit= (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);    
    $start= (isset($_POST['startDate']) ? $_POST['startDate'] : $_GET['startDate']);    
    $end= (isset($_POST['endDate']) ? $_POST['endDate'] : $_GET['endDate']);    
    $company_id= (isset($_POST['company_id']) ? $_POST['company_id'] : $_GET['company_id']);    
    $project_id= (isset($_POST['project_id']) ? $_POST['project_id'] : $_GET['project_id']);    
	$sql="select hour.hour_id,
	 sum(hour.hour_num) as hour_num,
	 user.user_id,
	 user.user_otbpay,
	 user.user_regularpay,
	 user.user_paytype,
	 user.user_sickdays,
	 user.user_vacdays,
	 user.user_weekhours,
	 user.user_firstname,
	 user.user_lastname,
	 company.company_name FROM hour left join user on hour.user_id=user.user_id join company on user.company_id=company.company_id WHERE ";
	if ($project_id!='' && $project_id!='all') {
		$sql.="hour.project_id='".$project_id."' ";
	}
	if ($company_id!='' && $company_id!='all') {
		if ($project_id!='' && $project_id!='all') {
			$sql.="AND ";
		}
		$sql.="company.company_id='".$company_id."' AND hour.user_id=user.user_id AND hour.hour_date >= '$start' AND hour.hour_date <= '$end' ";
	} else {
		if ($project_id!='' && $project_id!='all') {
			$sql.="AND ";
		}
		$sql.="hour.user_id=user.user_id AND hour.hour_date >= '$start' AND hour.hour_date <= '$end' ";
	}
    if ($group=='company') {
		//$sql.="GROUP BY company.company_name";
	} else {
		//$sql.="GROUP BY user.user_id ORDER BY company.company_id, user.user_lastname limit $start_num, $limit";
		$sql.="GROUP BY user.user_id ORDER BY company.company_id, user.user_lastname";
	}
    $result_count = mysql_query($sql);
    $rows = mysql_num_rows($result_count);
    $result = mysql_query($sql);
    $arr=array();
	$otb_hours=0;
	$reg_hours=0;
	$total_due=0;
    while($rec=mysql_fetch_object($result)) {
		$rec->user_pto = ($rec->user_vacdays + $rec->user_sickdays);
		if ($rec->user_paytype=='hourly') {
			$rec->user_regularpay=0;
			$rec->otb_hours=$rec->hour_num;
			$rec->otb_pay=($rec->hour_num * $rec->user_otbpay);
			$rec->total_due=($rec->otb_pay)+($rec->regular_pay);
		} else {
// Salary Payroll Calculation
// $total=(max*48)
// $reg=$min*40
// $otb=$max-min

// if user works < weekhours then
//   if user has pto left then
//      pay user based on weekhours
//   else 
//      pay user based on hours worked
//
			$rec->otb_hours=0;
			$rec->otb_pay=0;
			$hours=0;
			if ($rec->hour_num > $rec->user_weekhours) {
// Salary worker working enough hours.
				$hours=$rec->user_weekhours;
				$rec->regular_hours=40;
				$rec->otb_pay=($rec->user_otbpay * $hours)-($rec->user_regularpay * 40);
			} else {
// Salary worker working less than regular week... need to determine if they've used pto time.
				$allotted_pto = ( $rec->user_sickdays + $rec->user_vacdays );
				$used_pto = pto_days_used_this_year( $rec->user_id, $start );
				$rec->user_pto_used = $used_pto;
				$available_pto = $allotted_pto - $used_pto; 
				//if ( $available_pto > 0 ) {
					//$hours=$rec->user_weekhours;  // base the calculation on the users' regular work week hours
					//$rec->unpaid_hours = 0;
					//$rec->otb_pay=($rec->user_otbpay * $hours)-($rec->user_regularpay * $hours);
					//$rec->regular_hours=$hours;
				//} else {
					$hours=$rec->hour_num; // base the calculation on the users' actual worked hours because they don't have any pto left
					//$rec->unpaid_hours = $rec->user_weekhours - $hours;
					//$rec->otb_pay=($rec->user_otbpay * $hours)-($rec->user_regularpay * $hours);
					$rec->otb_pay=($rec->user_otbpay * 48)-($rec->user_regularpay * 40);
					$rec->regular_hours=$rec->hour_num;
				//}
			}
			$rec->total_due=($rec->user_otbpay * $hours);
			$rec->regular_pay=(40 * $rec->user_regularpay);
			$rec->otb_pay=($rec->total_due) - ($rec->regular_pay);
			$rec->otb_hours=($rec->otb_pay / $rec->user_otbpay);
		}
        $arr[]=$rec;
    }
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

	if ($print==1) {
		print '<html><link rel="stylesheet" href="css/print.css" type="text/css" media="print"  /><body>';
		print "<div id=noprint class=noprint>Click Here To <input type=button name=print value='Send to Printer' onClick='javascript:window.print()'></div>";
		print "<h1>Employee Payroll Report for $start through $end</h1>";
		print "<table width=100% border=0 cellpadding=1>\n";
		$co='';
		$ctotals = array();
		$gtotals = array();
		foreach($arr as $row) {
			if($co!=$row->company_name || $co=='') {
				if($co!='') {
					print "<tr><td colspan=4 align=right><b>".$co."</b><td style='border-top: solid;' align=right><b>$".number_format($ctotals['regular_pay'],2)."</b></td><td style='border-top: solid;' align=right><b>$".number_format($ctotals['otb_pay'],2)."</b></td></td><td style='border-top: solid;' align=right><b>$".number_format($ctotals['total_due'],2)."</b></td></tr>";
					$ctotals['otb_pay']=0;
					$ctotals['regular_pay']=0;
					$ctotals['total_due']=0;
				}
				print "<tr><td colspan=7><h2>".$row->company_name."</h2></td></tr>";
				print "<tr id=print_head><th>Employee</th><th>Total hours</th><th>Regular Hours</th><th>OT Hours</th><th>Regular Pay</th><th>OT Pay</th><th>Total</th></tr>";
				$co=$row->company_name;
			}
			print "<tr id=print_row>";
			print "<td>".$row->user_firstname." ".$row->user_lastname."</td>";
			print "<td align=right>$row->hour_num</td><td align=right>".number_format($row->regular_hours,0)."</td><td align=right>".number_format($row->otb_hours,0)."</td><td align=right>$".number_format($row->regular_pay,2)."</td><td align=right>$".number_format($row->otb_pay,2)."</td><td align=right>$".number_format($row->total_due,2)."</td></tr>";
			print "</tr>\n";
			$ctotals['otb_pay']+=$row->otb_pay;
			$ctotals['regular_pay']+=$row->regular_pay;
			$gtotals['otb_pay']+=$row->otb_pay;
			$gtotals['regular_pay']+=$row->regular_pay;
			$ctotals['total_due']+=$row->total_due;
			$gtotals['total_due']+=$row->total_due;
		}
		print "<tr><td colspan=4 align=right><b>".$co."</b></td><td style='border-top: solid;' align=right><b>$".number_format($ctotals['regular_pay'],2)."</b></td><td style='border-top: solid;' align=right><b>$".number_format($ctotals['otb_pay'],2)."</b></td><td style='border-top: solid;' align=right><b>$".number_format($ctotals['total_due'],2)."</b></td></tr>";
		print "<tr><td colspan=4 align=right><b>"."All Companies"."</b></td><td style='border-top: solid;' align=right><b>$".number_format($gtotals['regular_pay'],2)."</b></td><td style='border-top: solid;' align=right><b>$".number_format($gtotals['otb_pay'],2)."</b></td><td style='border-top: solid;' align=right><b>$".number_format($gtotals['total_due'],2)."</b></td></tr>";
		print "</table>";
	} else {
		$cb = isset($_GET['callback']) ? $_GET['callback'] : '';
		echo $cb . '({"total":"' . $rows . '","results":' . $data . '})';
	}

}
function getEnvironments() {
    $sql="SELECT * FROM environments";
    $result=mysql_query($sql);
	$rows=mysql_num_rows($result);
    $arr=array();
    while($obj=mysql_fetch_object($result)) {
		$arr[]=$obj;
    }
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }
    echo '({"total":"' . $rows . '","results":' . $data . '})';
}

function getCompany() {
    $start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
    $end = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
    $sql="select company_id, company_name from company";

    $result_count = mysql_query($sql);
    $rows = mysql_num_rows($result_count);
    $sql = $sql . ' LIMIT ' . $start . ', '. $end;
    $result = mysql_query($sql);
    $arr=array();
	while($rec=mysql_fetch_object($result)) {
		$arr[]=$rec;
	}
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';
     echo $cb . '({"total":"' . $rows . '","results":' . $data . '})';
}
function showLabor() {
    $startDate = (isset($_POST['startDate']) ? $_POST['startDate'] : $_GET['startDate']);    
	$endDate = (isset($_POST['endDate']) ? $_POST['endDate'] : $_GET['endDate']);
    $start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);    
	$end = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
	$project_id = (integer) (isset($_POST['project_id']) ? $_POST['project_id'] : $_GET['project_id']);
	$print= (isset($_POST['print']) ? $_POST['print'] : $_GET['print']);    
	$arr=array();
//logit($startDate);
//logit($endDate);

	if ($project_id) {
		$project_name=project_name($project_id);
$sql1="select user.user_firstname,user.user_lastname,user.user_otbpay,user.user_regularpay, user.user_paytype, hour.user_id,sum(hour.hour_num) as hours,min(hour.hour_date) as first_date, max(hour.hour_date) as last_date,hour.project_id,project.project_cost,project.project_num,project.project_name from user,hour left join project on hour.project_id=project.project_id WHERE hour.hour_date>='$startDate' and hour.hour_date <= '$endDate' and project.project_id='$project_id' AND user.user_id=hour.user_id GROUP BY hour.user_id";

	} else {
		$sql1="select user.user_firstname,user.user_lastname,user.user_otbpay,user.user_regularpay, user.user_paytype, hour.user_id,sum(hour.hour_num) as hours,min(hour.hour_date) as first_date, max(hour.hour_date) as last_date,hour.project_id,project.project_cost,project.project_num,project.project_name from user,hour left join project on hour.project_id=project.project_id WHERE hour.hour_date>='$startDate' and hour.hour_date <= '$endDate' and user.user_id=hour.user_id GROUP BY hour.user_id";
	}
	#$sql1="select user.user_firstname,user.user_lastname,user.user_otbpay,user.user_regularpay, user.user_paytype, hour.hour_date, hour.user_id,sum(hour.hour_num) as hours,min(hour.hour_date) as first_date, max(hour.hour_date) as last_date,hour.project_id,project.project_cost,project.project_num,project.project_name from user,hour left join project on hour.project_id=project.project_id WHERE hour.hour_date >= '$startDate' and hour.hour_date <= '$endDate' and project.project_id='$project_id' AND user.user_id=hour.user_id GROUP BY hour.user_id ";
logit($sql1);
	$result1 = mysql_query($sql1);
	$rows = mysql_num_rows($result1);
logit($rows);
	while($obj1 = mysql_fetch_object($result1)) {
		if ($obj1->user_paytype=='hourly') {
			$obj1->cost=$obj1->user_otbpay * $obj1->hours;
		} else { 
			//$obj1->cost=$obj1->user_regularpay * $obj1->hours;
			$obj1->cost=$obj1->user_otbpay * $obj1->hours;
		}
		$arr[] = $obj1;
	};

    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

	if ($print==1) {
		print '<html><link rel="stylesheet" href="css/print.css" type="text/css" media="print"  /><body>';
		print "<div id=noprint class=noprint>Click Here To <input type=button name=print value='Send to Printer' onClick='javascript:window.print()'></div>";
		print "<h1>Labor Report for $project_name</h1>";
		print "<table width=100% border=0 cellpadding=1>\n";
		$co='';
		$ctotals = array();
		$ptotals = array();
		foreach($arr as $row) {
			if($co!=$row->project_name || $co=='') {
//logit('project name'.$row->project_name);
//logit('co'.$co);
				if($co!='') {
					print "<tr><td colspan=8 align=right><b>".$co."</b></td><td style='border-top: solid;' align=right><b>$".number_format($ctotals['total_due'],2)."</b></td></tr>";
					$ctotals['total_due']=0;
				}
				print "<tr id=print_head><th>Employee</th><th>Project</th><th>First Date</th><th>Last Date</th><th>Total hours</th><th>Labor Cost</th><th>Materials Cost</th></tr>";
				$co=$row->project_name;
			}
			print "<tr id=print_row>";
			print "<td>".$row->user_firstname." ".$row->user_lastname."</td>";
			print "<td>(".$row->project_num.") ".$row->project_name."</td>";
			print "<td>".$row->first_date."</td>";
			print "<td>".$row->last_date."</td>";
			print "<td align=right>".number_format($row->hours,0)."</td>";
			print "<td align=right>$".number_format($row->cost,2)."</td>";
			print "<td align=right>$".number_format($row->project_cost,2)."</td>";
			print "</tr>\n";
			$ptotals['total_materials']=$row->project_cost;
			$ptotals['total_hours']+=$row->hours;
			$ptotals['total_labor']+=$row->cost;
		}
		print "<tr><td colspan=4 align=right><b>Total for ".$co."</b></td><td style='border-top: solid;' align=right><b>".number_format($ptotals['total_hours'],0)."</b></td><td style='border-top: solid;' align=right><b>$".number_format($ptotals['total_materials'],2)."</b></td><td style='border-top: solid;' align=right><b>$".number_format($ptotals['total_labor'],2)."</b></td></tr>";
		print "</table>";
	} else {
	    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';
	    echo $cb . '({"total":"' . $rows . '","results":' . $data . '})';
	}
}//end showLabor


function showProjects()
{
    $start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
    $end = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
    $showProjectNum = isset($_POST['showProjectNum']) ? $_POST['showProjectNum'] : $_GET['showProjectNum'];
    //$sql="select project.*,company.company_id,company.company_name from project,company where project.company_id=company.company_id and project.project_status not like 'deleted' order by project_num DESC";
    $sql="select project.*,company.company_id,company.company_name from project,company where project.company_id=company.company_id and project.project_status not like 'deleted' order by project_num DESC";
    $result_count = mysql_query($sql);
    $rows = mysql_num_rows($result_count);
    $sql = $sql . ' LIMIT ' . $start . ', '. $end;
    $result = mysql_query($sql);
    //$result = $result_count;
    $arr=array();
    $ii = 0;
//while ($row = mysql_fetch_object($result_count)) {
        //logit("ID: ".$row->project_id."  Name: ".$row->company_id);
    //}
    while ($rec = mysql_fetch_object($result)) {
    //while ($rec = mysql_fetch_object($result, MYSQL_NUM) && $ii <= $rows){
		$ii+=1;
		$labor_cost=getlabor($rec->project_id);
		if ($labor_cost) {
			$rec->labor_cost=$labor_cost;
		} else {
			$rec->labor_cost=0;
		}
		if ($showProjectNum==1) {
			$rec->project_name="(".$rec->project_num.") ".$rec->project_name;
		} 
        $arr[] = $rec;
        mysql_free_result($rec);
    };

    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';

     echo $cb . '({"total":"' . $rows . '","results":' . $data . '})';

}//end showData
function showTasksCalendar() {
    //$user_id = (isset($_POST['user_id']) ? $_POST['user_id'] : $_GET['user_id']);
    //$sql="select assign.assign_id as id,assign.assign_date as start, assign.assign_date as end,task.task_name as title from assign,user,task where user.user_id='".$user_id."' AND assign.user_id=user.user_id and assign.task_id=task.task_id";
    $sql="select assign.assign_id,assign.assign_date as start, concat(user.user_firstname,' ',user.user_lastname,': ',task.task_name) as title, assign.assign_num from assign,user,task where assign.user_id=user.user_id and assign.task_id=task.task_id order by task.task_name,user.user_lastname";
//print $sql;
    $result_count = mysql_query($sql);
    $rows = mysql_num_rows($result_count);
    $result = mysql_query($sql);
    $arr=array();
    while($rec = mysql_fetch_object($result)){
		if ($rec->assign_num<8) {
			$temp=$rec->start;
			$rec->start=$temp." 09:00:00";
			$rec->end=$temp." ".(9+$rec->assign_num).":00:00";
			$rec->allDay=false;
		} else {
			$rec->end=$rec->start;
			$rec->allDay=true;
		}
        $arr[] = $rec;
    };
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';

     echo "{$data}";
}//end showData


function showTasks()
{
    $startDate = (isset($_POST['startDate']) ? $_POST['startDate'] : $_GET['startDate']);
    $endDate = (isset($_POST['endDate']) ? $_POST['endDate'] : $_GET['endDate']);
    $start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
    $end = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
    $company_id = (isset($_POST['company_id']) ? $_POST['company_id'] : $_GET['company_id']);
    $sql="select assign.assign_id,assign.assign_date,assign.assign_num,user.user_firstname,user.user_lastname,task.task_name,company.company_name from assign,user,task,company where assign.user_id=user.user_id and assign.task_id=task.task_id and user.company_id=company.company_id AND ";
    if ($company_id!='' && $company_id!='all') {
        $sql.="user.company_id='".$company_id."' AND assign.assign_date >= '$startDate' and assign.assign_date <= '$endDate' ";
    } else {
        $sql.="assign.assign_date >= '$startDate' and assign.assign_date <= '$endDate' ";

    }
	$sql.=" ORDER BY user.user_id,assign.assign_date";
    $result_count = mysql_query($sql);
    $rows = mysql_num_rows($result_count);
    $sql = $sql . ' LIMIT ' . $start . ', '. $end;
    $result = mysql_query($sql);
    $arr=array();
    while($rec = mysql_fetch_object($result)){
        $arr[] = $rec;
    };

    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';

     echo $cb . '({"total":"' . $rows . '","results":' . $data . '})';
}//end showData

function get_company_id($value) {
	$sql="select company_id from company where company_name='".$value."'";
	$result=mysql_query($sql);
	if ($result) {
		$arr=mysql_fetch_array($result);
		return $arr['company_id'];
	}
}
function get_company_name($id) {
	$sql="select company_name from company where company_id='".$id."'";
	$result=mysql_query($sql);
	if ($result) {
		$arr=mysql_fetch_array($result);
		return $arr['company_name'];
	}
}
function loadUserForm() {
    $user_id= (isset($_POST['user_id']) ? $_POST['user_id'] : $_GET['user_id']);
    $sql="select user.*,concat(user.user_lastname,', ',user.user_firstname) as username from user left join company on user.company_id=company.company_id  where user.user_id='".$user_id."'";
   $result_count = mysql_query($sql);
    $rows = mysql_num_rows($result_count);
	$arr=array();
	$result=mysql_query($sql);
	if(!$result) {
		echo "{success:failure,errorMsg:'Unable to find user ".$user_id."'}";
		exit;
	}
	while ($rec=mysql_fetch_object($result)) {
		$arr[]=$rec;
	}
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';

    echo $cb . '({"total":"' . $rows . '","results":' . $data . '})';
}

	
	
function showUsers()
{
    $start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
    $end = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
    $query = (isset($_POST['query']) ? $_POST['query'] : $_GET['query']);
	if ($query) {
		$sql="select user.*,concat(user.user_lastname,', ',user.user_firstname) as username from user WHERE user.user_lastname like '$query' order by user.company_id,user.user_lastname";
	} else {
		$sql="select user.*,concat(user.user_lastname,', ',user.user_firstname) as username from user order by user.company_id,user.user_lastname";
	}
    $result_count = mysql_query($sql);
    $rows = mysql_num_rows($result_count);
    $sql = $sql . ' LIMIT ' . $start . ', '. $end;
    $result = mysql_query($sql);
    $arr=array();
    while($rec = mysql_fetch_object($result)){
		$rec->company_name=get_company_name($rec->company_id);
        $arr[] = $rec;
    };

    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';

     echo $cb . '({"total":"' . $rows . '","results":' . $data . '})';

}//end showData
function showUsers_tree() {
	$sql="SELECT * FROM user";
	$result=mysql_query($sql);
	$arr=array();
	while ($obj=mysql_fetch_object($result)) {
		$tmp=array();
		$tmp['id']=$obj->user_id;
		$tmp['text']=$obj->user_firstname.' '.$obj->user_lastname;
		$tmp['icon']='images/icons/user.png';
		$tmp['parent']=false;
		$arr[]=$tmp;
	}
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

}


function getlabor($project_id) {
	$sql="select project_name,sum(hour.hour_num*user.user_regularpay) as labor from project,hour join user on hour.user_id=user.user_id where project.project_id='".$project_id."' and project.project_id=hour.project_id group by project_name";
	$total=0;
	$result=mysql_query($sql);
	while($rec = mysql_fetch_array($result, MYSQL_ASSOC)) {
		$total+=$rec['labor'];
	}
	return $total;

}
    
function showData($table) 
{
     /* By specifying the start/limit params in ds.load 
      * the values are passed here
      * if using ScriptTagProxy the values will be in $_GET
      * if using HttpProxy      the values will be in $_POST (or $_REQUEST)
      * the following two lines check either location, but might be more
      * secure to use the appropriate one according to the Proxy being used
      */
    $start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
    $end = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);  
    
    $sql_count = 'SELECT * FROM ' . $table;
	switch($table) {
		case "project":
			$sql="select project.*,company.company_name from project,company where project.company_id=company.company_id";
			break;
		case "user":
			$sql="select user.*,company.company_name from user,company where user.company_id=company.company_id";
			break;
		case "company":
			$sql="select * from company";
			break;
		case "task":
		case "hour":
			$sql="select hour.*, concat(user.user_firstname, ' ', user.user_lastname) as user_name, user.user_id, user.company_id, task.project_id, task.task_name, project.project_name,company.company_name from hour join user on hour.user_id=user.user_id join task on hour.task_id=task.task_id join company on user.company_id=company.company_id inner join project on task.project_id=project.project_id";
			break;
	}
 
    $result_count = mysql_query($sql);
    $rows = mysql_num_rows($result_count);
    $sql = $sql . ' LIMIT ' . $start . ', '. $end;
    $result = mysql_query($sql);
    
    while($rec = mysql_fetch_array($result, MYSQL_ASSOC)){
        
        $arr[] = $rec;
    };

    if (version_compare(PHP_VERSION,"5.2","<"))
    {    
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';
       
     echo $cb . '({"total":"' . $rows . '","results":' . $data . '})';

}//end showData



function getData($table) 
{

    $sql = 'SELECT * FROM ' . $table;
    $result = mysql_query($sql);

    while($rec = mysql_fetch_array($result, MYSQL_ASSOC)){
        $arr[] = $rec;
    };

    if (version_compare(PHP_VERSION,"5.2","<"))
    {    
        require_once("./JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($arr);  //encode the data in json format
    } else
    {
        $data = json_encode($arr);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';
       
     echo $cb . '({"results":' . $data . '})';

}//end getData

function saveUser()
{
    $user_id = (integer) mysql_real_escape_string($_POST['user_id']);
    $newRecord = $user_id == 0 ? 'yes' : 'no';                   
	$fields="user_name,user_firstname,user_lastname,user_email,company_name,user_type,user_active,user_regularpay,user_otbpay,user_paytype,user_weekhours,user_address,user_city,user_state,user_zip,user_homephone,user_otherphone,user_birthdate,user_emerg_contact,user_sickdays,user_vacdays,user_paiddays,user_ssn,user_photo";
	$fieldarray=explode(',',$fields);
	foreach($fieldarray as $fieldname) {
        $value = isset($_POST["$fieldname"]) ? $_POST["$fieldname"] : '';
		if ($value > '') {
			if ($fieldname=='company_name') {
				$company_name = mysql_real_escape_string($_POST["$fieldname"]);
				$fieldname='company_id';
				$newValue=get_company_id($company_name);
			} else {
				$newValue = mysql_real_escape_string($_POST["$fieldname"]);
				if ($fieldname=='user_paytype') {
					$newValue=strtolower($_POST["$fieldname"]);
				}
			}
			if($newRecord=='yes') {
				$oldValue='';
			} else {
				$sql="SELECT user.".$fieldname." FROM user WHERE user_id='".$user_id."'";
				$result=mysql_query($sql);
				if ($result) {
					while($rec=mysql_fetch_array($result)) {
						$oldValue=$rec[$fieldname];
					}
				} else {
					$oldValue='';
				}
			}	
			$update=false;
			if ($newRecord=='yes') { 
				$update=true;
				$sql="INSERT into user ('$fieldname') VALUES ('$newValue')";
			} else {
				if ($oldValue!=$newValue) {
					$update=true;
					$sql="UPDATE user SET $fieldname='".$newValue."' WHERE user_id='".$user_id."'";
				}	
			}
			if ($update) {
//print $sql."<br>\n";
				$result=mysql_query($sql);
				if (!$result) {
					echo "{success:false,errmsg:'unable to update user table ".addslashes($fieldname)." ".addslashes(mysql_error($result))."'}";
					exit;
				} 
			} 
		}
	}
	echo "{success:true}";
	return;
}

function saveData()
{
    /*
     * $key:   db primary key label
     * $id:    db primary key value
     * $field: column or field name that is being updated (see data.Record mapping)
     * $value: the new value of $field
     */ 

    global $table;
    //$key = $_POST['key'];
    $id    = (integer) mysql_real_escape_string($_POST['keyID']);
    $table = $_POST['xtable'];
    $field = $_POST['field'];
    $value = $_POST['value'];
    $newRecord = $id == 0 ? 'yes' : 'no';                   
    
	if ($field=='company_name'&&$table=='user') {
		$field='company_id';
		$value=get_company_id($value); // transform company name to company id
	}
    //should validate and clean data prior to posting to the database

    if ($newRecord == 'yes'){
        //INSERT INTO `stock` (`company`) VALUES ('a new company');
        $query = 'INSERT INTO `'.$table.'` (`'.$field.'`) VALUES (\''.$value.'\')';
    } else {
        $query = 'UPDATE '.$table.' SET '.$field.' = \''.$value.'\' WHERE '.$table.'_id = '.$id;
    }

    //save data to database                                                    
    $result = mysql_query($query);
    $rows = mysql_affected_rows();
    
    if ($rows > 0) {
        if($newRecord == 'yes'){
            $newID = mysql_insert_id();
            echo "{success:true, newID:$newID}";
        } else {
            echo "{success:true}";
        }
    } else {
        echo "{success:false, sql:'$query'}"; //if we want to trigger the false block we should redirect somewhere to get a 404 page
    }
}//end saveData

function saveProject()
{
    /*
     * $key:   db primary key label
     * $id:    db primary key value
     * $field: column or field name that is being updated (see data.Record mapping)
     * $value: the new value of $field
     */

    global $table;
    $key = $_POST['keyID'];
    $id    = (integer) mysql_real_escape_string($_POST['keyID']);
    $field = $_POST['field'];
    $value = $_POST['value'];
    $newRecord = $id == 0 ? 'yes' : 'no';

    //should validate and clean data prior to posting to the database

    if ($key == ''){
        $query = 'INSERT INTO project (`'.$field.'`) VALUES (\''.$value.'\')';
    } else {
        $query = 'UPDATE `project` SET `'.$field.'` = \''.$value.'\' WHERE `project_id` = '.$id;
    }

    //save data to database
    $result = mysql_query($query);
    $rows = mysql_affected_rows();

    if ($rows > 0) {
        if($newRecord == 'yes'){
            $newID = mysql_insert_id();
            echo "{success:true, newID:$newID}";
        } else {
            echo "{success:true}";
        }
    } else {
        echo "{success:false}"; //if we want to trigger the false block we should redirect somewhere to get a 404 page
    }
}//end saveData

function addUser() {
	$table = $_POST['xtable'];
	$firstname = $_POST['firstname'];
	$lastname = $_POST['lastname'];
	$sql="INSERT INTO user (user_id,user_firstname,user_lastname) VALUES ('','$firstname','$lastname');";
	$result = mysql_query($sql);
	if ($result) {
		echo "{success:true}";
	} else {
		echo "{success:false}";
	}

}
function removeData()
{
    /*
     * $key:   db primary key label
     * $id:    db primary key value
     */ 

    global $table;
    $key = $_POST['xkey'];
    $table = $_POST['xtable'];
    $arr    = $_POST['xid'];
    $count = 0;

//print "Table: $table";
//print "Record: $key";
//print_r($arr);

    if (version_compare(PHP_VERSION,"5.2","<"))
    {    
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $selectedRows = $json->decode(stripslashes($arr));//decode the data from json format
    } else
    {
        $selectedRows = json_decode(stripslashes($arr));//decode the data from json format
    }
    //should validate and clean data prior to posting to the database
    //foreach($selectedRows as $row_id)
    //{
        //$id = (integer) $row_id;
		$sql="DELETE FROM ".$table." WHERE ".$key."='".$arr."'";
        $result = mysql_query($sql); //returns number of rows deleted
        if ($result) $count++;
    //}
    
    if ($count) { //only checks if the last record was deleted, others may have failed

        /* If using ScriptTagProxy:  In order for the browser to process the returned
           data, the server must wrap te data object with a call to a callback function,
           the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
           If using HttpProxy no callback reference is to be specified*/
        $cb = isset($_GET['callback']) ? $_GET['callback'] : '';
           
        $response = array('success'=>$count, 'del_count'=>$count);


        if (version_compare(PHP_VERSION,"5.2","<"))
        {    
            $json_response = $json->encode($response);
        } else
        {
            $json_response = json_encode($response);
        }

        echo $cb . $json_response;
    } else {
        echo '{success: false}';
    }
}//end saveData

/**
 * Get Tax
 * Determine tax based on price
 */
function getTax()
{                              
    $price = $_POST['price'];

    if ($price >= 0) {
        global $taxRate;

        $tax = round($price * ($taxRate),2);

        $cb = isset($_GET['callback']) ? $_GET['callback'] : '';

        $response = array('success'=>'true', 'tax'=>$tax);

        if (version_compare(PHP_VERSION,"5.2","<"))
        {    
            require_once("./JSON.php"); //if php<5.2 need JSON class
            $json = new Services_JSON();//instantiate new json object
            $json_response = $json->encode($response);
        } else
        {
            $json_response = json_encode($response);
        }

        echo $cb . $json_response;
    } else {
        echo '{failure: true}';
    }
}//end getTotal
?>


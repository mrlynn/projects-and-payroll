<?php
include('includes/defines.php');
$json=new Services_JSON();
$arr = array();
switch($_POST['xtable']) {
	case "project":
		$q="select project.*,company.company_name from project,company where project.company_id=company.company_id";
		break;
	case "user":
		$q="select user.*,company.company_name from user,company where user.company_id=company.company_id";
		break;
	case "company":
		$q="select * from company";
		break;
	case "hour":
		break;
}
$rs = db_query("$q");
$total=mysql_num_rows($rs);
$tmp = array();
$data=array();
while($arr= db_fetch_assoc($rs)) {
	$data[]=$arr;
}
print '{total:'.$total.',success:true,data:'.$json->encode($data)."}";
?>

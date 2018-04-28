<?php
//database parameters
include_once('includes/database.php');
include_once('includes/functions.php');
//make database connection
$connection = mysql_connect("localhost", $user, $pw) or die("Could not connect: " . mysql_error());
mysql_select_db($db) or die("Could not select database");

    $today=date('Y-m-d H:i:s',time());
    $sql="select count(project_id) as total_projects from project where project_status='active'";
    $res=mysql_query($sql);
    while($obj=mysql_fetch_object($res)) {
        $total_projects=$obj->total_projects;
    }
    $sql="select count(user_id) as total_users from user where user_active='Y'";
    $res=mysql_query($sql);
    while($obj=mysql_fetch_object($res)) {
        $total_users=$obj->total_users;
    }
    $sql="select count(company_id) as total_companies from company where company_status='active'";
    $res=mysql_query($sql);
    while($obj=mysql_fetch_object($res)) {
        $total_companies=$obj->total_companies;
    }
    $sql="select sum(user_regularpay) as total_regularpay from user where user_active='Y'";
    $res=mysql_query($sql);
    while($obj=mysql_fetch_object($res)) {
        $total_regularpay =$obj->total_regularpay;
    }
    $sql="select sum(user_otbpay) as total_otbpay from user where user_active='Y'";
    $res=mysql_query($sql);
    while($obj=mysql_fetch_object($res)) {
        $total_otbpay =$obj->total_otbpay;
    }
    $sql="INSERT INTO stats (stats_id,stats_date,total_companies,total_users,total_projects,total_regularpay,total_otbpay) VALUES ('','$today','$total_companies','$total_users','$total_projects','$total_regularpay','$total_otbpay')";
    $res=mysql_query($sql);
	if (!$res) {
		echo "Error processing stats ".mysql_error($res);
	}

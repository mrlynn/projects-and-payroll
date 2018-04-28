<?php
include_once('includes/JSON.php');
$json=new Services_JSON();
$arr = array();
$menu= array();
$menu['id']='1';
$menu['iconCls']='project';
$menu['text']='Projects';
$menu['leaf']=true;
$arr[]=$menu;
$menu['id']='2';
$menu['iconCls']='user';
$menu['text']='Users';
$menu['leaf']=true;
$arr[]=$menu;
$menu['id']='3';
$menu['iconCls']='company';
$menu['text']='Company';
$menu['leaf']=true;
$arr[]=$menu;
print $json->encode($arr);
?>

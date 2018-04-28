<?php
require_once('includes/defines.php');

if(isset($_POST['action']) && ($_POST['action'] == 'login'))
{
	session_destroy();
	session_start();
	$_SESSION = array();
        // Check if User is Authorized
        $Auth= new Authorize();
	if ($Auth->Login($_POST['uname'], $_POST['pass'],'index.php')) {;
		$data['success']=true;
		$_COOKIE['WSS_Username']=$_POST['uname'];
	} else {
		$data['success']=false;
		$data['message']= 'Login Failed, Check Username and/or Password.';
	}
	echo JEncode($data);
}
else
{
        $Auth= new Authorize();
        $Auth->logout();
?>
<html>
<head>
	<title>Wall Systems Supply</title>
	<link rel="stylesheet" href="extjs/resources/css/ext-all.css" />
	<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="extjs/ext-all.js"></script>
	<script type="text/javascript" src="js/login.js"></script>
</head>


</head>
<body>
</body>
</html>
<?
}

?>

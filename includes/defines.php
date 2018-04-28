<?php
error_reporting(E_ALL);
session_start();
require_once('includes/JSON.php');
require_once('includes/common.php');
require_once('includes/configure.php');
require_once('includes/database.php');
require_once('includes/functions.php');
require_once('includes/Authorize.class.php');
require_once('includes/LibMail.class.php');
db_connect() or die('Unable to connect to database server!');
?>

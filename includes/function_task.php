<?php
/*********************************************************
*********************************************************/
function task_count($_GET, $link = 'db_link'){
	$where = "1 = 1 ";
	if($_GET['task_name'] != '')
	{
		$where .= "AND task_name LIKE '%".addslashes($_GET['task_name'])."%' ";
	}
	if($_GET['done'] == 'Y')
	{
		$where .= "AND task_percent = 100 ";
	}
	if($_GET['done'] == 'N')
	{
		$where .= "AND task_percent != 100 ";
	}
	if($_GET['user_id'] != '')
	{
		$where .= "AND user_id = '".$_GET['user_id']."' ";
	}
	if($_GET['task_pointsapproved'] != '')
	{
		$where .= "AND task_pointsapproved = '".$_GET['task_pointsapproved']."' ";
	}
	$query = "SELECT ".
				"COUNT(*) as total ".
			"FROM ".
				"task ".
			"WHERE ".
				$where;
	$result = db_query($query, $link);
	$row = db_fetch_assoc($result);
	return $row['total'];
}

/*********************************************************
*********************************************************/
function get_tasks($_GET, $link = 'db_link'){
	$where = "1 = 1 ";
	if($_GET['task_name'] != '')
	{
		$where .= "AND task_name LIKE '%".addslashes($_GET['task_name'])."%' ";
	}
	if($_GET['done'] == 'Y')
	{
		$where .= "AND task_percent = 100 ";
	}
	if($_GET['done'] == 'N')
	{
		$where .= "AND task_percent != 100 ";
	}
	if($_GET['user_id'] != '')
	{
		$where .= "AND user_id = '".$_GET['user_id']."' ";
	}
	if($_GET['task_pointsapproved'] != '')
	{
		$where .= "AND task_pointsapproved = '".$_GET['task_pointsapproved']."' ";
	}
	$query = "SELECT ".
				"* ".
			"FROM ".
				"task ".
			"WHERE ".
				$where.
			"ORDER BY ".
				"task_name ".
			"LIMIT ".
				NUMBER_VIEWED .", ". NUMBER_PER_PAGE;
	return db_query($query, $link);
}

/*********************************************************
*********************************************************/
function sendinitialtask($task_id = 0)
{
	return false;
	$listeners = '';
	$query = "SELECT ".
				"* ".
			"FROM ".
				"tasklisten, user ".
			"WHERE ".
				"tasklisten.user_id = user.user_id AND ".
				"tasklisten.task_id = ".$task_id;
	$result = db_query($query);
	while($row = db_fetch_assoc($result))
	{
		$listeners .= $row['user_firstname'].' '.$row['user_lastname'].',';
	}

	$query = "SELECT ".
				"* ".
			"FROM ".
				"project, task, user ".
			"WHERE ".
				"project.project_id = task.project_id AND ".
				"task.user_id = user.user_id AND ".
				"task_id = ".$task_id;
	$result = db_query($query);
	if($row = db_fetch_assoc($result))
	{
		$message = 'TASK DESCRIPTION<br>';
		$message .= str_replace("\n","<br>",$row['task_description'])."<br><br>";
		$message .= "Listeners : ".$listeners;

		$m = new LibMail();
		$m->From('initialtask@trinnovations.com');
		$m->To($row['user_email']);
		$m->Bcc('afaulds@trinnovations.com');
		$m->Subject('NEW - '.$row['project_name'].' - '.$row['task_name'].' - '.$row['task_id']);
		$m->HtmlBody($message);
		$m->Send();
	}
}

/*********************************************************
*********************************************************/
function senddonetask($task_id = 0)
{
	return false;
	$toemail = '';
	$query = "SELECT ".
				"* ".
			"FROM ".
				"tasklisten, user ".
			"WHERE ".
				"tasklisten.user_id = user.user_id AND ".
				"tasklisten.task_id = ".$task_id;
	$result = db_query($query);
	while($row = db_fetch_assoc($result))
	{
		$toemail .= $row['user_email'].',';
	}

	if($toemail == '')
	{
		return false;
	}
	else
	{
		$query = "SELECT ".
					"* ".
				"FROM ".
					"project, task, user ".
				"WHERE ".
					"project.project_id = task.project_id AND ".
					"task.user_id = user.user_id AND ".
					"task_id = ".$task_id;
		$result = db_query($query);
		if($row = db_fetch_assoc($result))
		{
			$message = '---------------------------------------------------------------------------------------<br>';
			$message .= 'Please take a second to check the work and then click on the appropriate link.<br><br>';
			$message .= '<a href="http://www.trinnovations.com/trinntask/task_approve.php?t='.int_encrypt($task_id).'">Click here to approve</a><br><br>';
			$message .= '<a href="http://www.trinnovations.com/trinntask/task_reject.php?t='.int_encrypt($task_id).'">Click here to reject</a><br><br>';
			$message .= '---------------------------------------------------------------------------------------<br>';
			$message .= 'TASK DESCRIPTION<br>';
			$message .= str_replace("\n","<br>",$row['task_description']).'<br><br>';

			$m = new LibMail();
			$m->From('donetask@trinnovations.com');
			$m->To($toemail);
			$m->Bcc('afaulds@trinnovations.com');
			$m->Subject('DONE - '.$row['project_name'].' - '.$row['task_name'].' - '.$row['task_id']);
			$m->HtmlBody($message);
			$m->Send();
			return true;
		}
		return true;
	}
}

/*********************************************************
*********************************************************/
function sendapprovetask($task_id = 0)
{
	return false;
	$listeners = '';
	$query = "SELECT ".
				"* ".
			"FROM ".
				"tasklisten, user ".
			"WHERE ".
				"tasklisten.user_id = user.user_id AND ".
				"tasklisten.task_id = ".$task_id;
	$result = db_query($query);
	while($row = db_fetch_assoc($result))
	{
		$listeners .= $row['user_firstname'].' '.$row['user_lastname'].',';
	}

	$query = "SELECT ".
				"* ".
			"FROM ".
				"project, task, user ".
			"WHERE ".
				"project.project_id = task.project_id AND ".
				"task.user_id = user.user_id AND ".
				"task_id = ".$task_id;
	$result = db_query($query);
	if($row = db_fetch_assoc($result))
	{
		$message = 'TASK DESCRIPTION<br>';
		$message .= str_replace("\n","<br>",$row['task_description'])."<br><br>";
		$message .= "Listeners : ".$listeners;

		$m = new LibMail();
		$m->From('approvetask@trinnovations.com');
		$m->To($row['user_email']);
		$m->Subject('APPROVED - '.$row['project_name'].' - '.$row['task_name'].' - '.$row['task_id']);

		$m->HtmlBody($message);
		$m->Bcc('afaulds@trinnovations.com');
		$m->Send();
	}
}

/*********************************************************
*********************************************************/
function sendrejecttask($task_id = 0)
{
	return false;
	$listeners = '';
	$query = "SELECT ".
				"* ".
			"FROM ".
				"tasklisten, user ".
			"WHERE ".
				"tasklisten.user_id = user.user_id AND ".
				"tasklisten.task_id = ".$task_id;
	$result = db_query($query);
	while($row = db_fetch_assoc($result))
	{
		$listeners .= $row['user_firstname'].' '.$row['user_lastname'].',';
	}

	$query = "SELECT ".
				"* ".
			"FROM ".
				"project, task, user ".
			"WHERE ".
				"project.project_id = task.project_id AND ".
				"task.user_id = user.user_id AND ".
				"task_id = ".$task_id;
	$result = db_query($query);
	if($row = db_fetch_assoc($result))
	{
		$message = 'TASK DESCRIPTION<br>';
		$message .= str_replace("\n","<br>",$row['task_description'])."<br><br>";
		$message .= "Listeners : ".$listeners;

		$m = new LibMail();
		$m->From('rejecttask@trinnovations.com');
		$m->To($row['user_email']);
		$m->Subject('REJECTED - '.$row['project_name'].' - '.$row['task_name'].' - '.$row['task_id']);

		$m->HtmlBody($message);
		$m->Bcc('afaulds@trinnovations.com');
		$m->Send();
	}
}
?>
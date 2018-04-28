<?php
/*********************************************************
*********************************************************/
function point_count($_GET, $link = 'db_link'){
	$where = "point.user_id = user.user_id ";
	if($_GET['point_description'] != '')
	{
		$where .= "AND point_description LIKE '%".addslashes($_GET['point_description'])."%' ";
	}
	if($_GET['user_id'] != '')
	{
		$where .= "AND user.user_id = '".$_GET['user_id']."' ";
	}
	$query = "SELECT ".
				"COUNT(*) as total ".
			"FROM ".
				"point, user ".
			"WHERE ".
				$where;
	$result = db_query($query, $link);
	$row = db_fetch_assoc($result);
	return $row['total'];
}

/*********************************************************
*********************************************************/
function get_points($_GET, $link = 'db_link'){
	$where = "point.user_id = user.user_id ";
	if($_GET['point_description'] != '')
	{
		$where .= "AND point_description LIKE '%".addslashes($_GET['point_description'])."%' ";
	}
	if($_GET['user_id'] != '')
	{
		$where .= "AND user.user_id = '".$_GET['user_id']."' ";
	}
	$query = "SELECT ".
				"* ".
			"FROM ".
				"point, user ".
			"WHERE ".
				$where.
			"ORDER BY ".
				"point_description ".
			"LIMIT ".
				NUMBER_VIEWED .", ". NUMBER_PER_PAGE;
	return db_query($query, $link);
}
?>
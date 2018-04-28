<?php
/*********************************************************
*********************************************************/
function project_count($_GET, $link = 'db_link'){
	$where = '';
	$query = "SELECT ".
				"COUNT(*) as total ".
			"FROM ".
				"project";
	$result = db_query($query, $link);
	$row = db_fetch_assoc($result);
	return $row['total'];
}

/*********************************************************
*********************************************************/
function get_projects($_GET, $link = 'db_link'){
	$query = "SELECT ".
				"* ".
			"FROM ".
				"project ".
			"INNER JOIN ".
				"company ".
			"ON ".
				"company.company_id = project.company_id ".
			"ORDER BY ".
				"project_num DESC, project_name ".
			"LIMIT ".
				NUMBER_VIEWED .", ". NUMBER_PER_PAGE;
	return db_query($query, $link);
}

/*********************************************************
*********************************************************/
function projects_dropdown($name,$user_type,$firstoption = '',$selected = '',$style = ''){
	$query = "SELECT ".
				"project_id AS id, ".
				"concat(project_num, ' - ', project_name) AS name ".
			"FROM ".
				"project ".
			"ORDER BY ".
				"project_num DESC, project_name";
	return dropdown($name, $query, $firstoption, $selected, $style);
}
?>
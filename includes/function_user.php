<?php
/*********************************************************
*********************************************************/
function user_count($_GET){
	$where = '';
	$query = "SELECT ".
				"COUNT(*) as total ".
			"FROM ".
				"user ".
		"WHERE ".
			"user_type = 'employee' ";
	$result = db_query($query);
	$row = db_fetch_assoc($result);
	return $row['total'];
}

/*********************************************************
*********************************************************/
function get_users($_GET){
	$query = "SELECT ".
			"* ".
		"FROM ".
			"user ".
		"WHERE ".
			"user_type = 'employee' ".
		"ORDER BY ".
			"user_firstname, user_lastname ".
		"LIMIT ".
			NUMBER_VIEWED .", ". NUMBER_PER_PAGE;
	return db_query($query);
}

/*********************************************************
*********************************************************/
function users_dropdown($name,$user_type,$firstoption = '',$selected = '',$style = ''){
	$where = "";
	if($user_type != '')
	{
		$where .= "user_type IN ('".str_replace(",", "','", $user_type)."') AND ";
	}
	$query = "SELECT ".
				"company.company_id AS id1, ".
				"company.company_name AS name1, ".
				"user_id AS id2, ".
				"concat(user_firstname, ' ', user_lastname) AS name2 ".
			"FROM ".
				"user ".
			"LEFT JOIN ".
				"company ".
				"ON ".
					"company.company_id = user.company_id ".
			"WHERE ".
				$where.
				"user_active = 'Y' ".
			"ORDER BY ".
				"name1, name2";
	return dropdown2subonly($name, $query, $firstoption, $selected, $style);
}
?>
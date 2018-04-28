<?php
/*********************************************************
*********************************************************/
function company_count($_GET, $link = 'db_link'){
	$where = '';
	$query = "SELECT ".
				"COUNT(*) as total ".
			"FROM ".
				"company";
	$result = db_query($query, $link);
	$row = db_fetch_assoc($result);
	return $row['total'];
}

/*********************************************************
*********************************************************/
function get_companys($_GET, $link = 'db_link'){
	$query = "SELECT ".
				"* ".
			"FROM ".
				"company ".
			"ORDER BY ".
				"company_name ".
			"LIMIT ".
				NUMBER_VIEWED .", ". NUMBER_PER_PAGE;
	return db_query($query, $link);
}
?>
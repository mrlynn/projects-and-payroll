<?php
/*********************************************************
************** GENERIC ARRAY DROP DOWN *******************
*********************************************************/

function users_json() {
	$query="SELECT * from users";

	$result = db_query($query);
	$user_array = array();

	while ( $row = db_fetch_assoc($result) )
	{
		$user_array[]=$row;
	}
	return JEncode($user_array);
}

	
function dropdown_array($name,$options,$firstoption = '',$selected = '',$style = '')
{
    $returnval = '';

    $returnval .= '<select id="'.$name.'" name="'.$name.'" '.$style.'>';
    if ( $firstoption != '' )
    {
        $returnval .= '<option value="">'.$firstoption.'</option>';
    }

    foreach ( $options as $id => $name )
    {
        if ( $selected == $id )
        {
            $returnval .= '<option value="'.$id.'" SELECTED>' . htmlentities(trim($name),ENT_QUOTES) . '</option>';
        }
        else
        {
            $returnval .= '<option value="'.$id.'">' . htmlentities(trim($name),ENT_QUOTES) . '</option>';
        }
    }
    $returnval .= '</select>';
    return $returnval;
}

//CMD LINE REPORTING
/*********************************************************
*********** GENERIC ARRAY MULTI DROP DOWN ****************
*********************************************************/
function multidropdown_array($name,$options,$firstoption = '',$selected = '',$style = '')
{
    $returnval = '';

    $returnval .= '<select id="'.$name.'" name="'.$name.'" ' . $style. ' size="' . sizeof($options) . '" ' . 'MULTIPLE>';
    if ( $firstoption != '' )
    {
        $returnval .= '<option value="">'. $firstoption . '</option>';
    }

    foreach ( $options as $id => $name )
    {
        if ( $selected == $id )
        {
            $returnval .= '<option value="' . $id . '" SELECTED>' . $name . '</option>';
        }
        else
        {
            $returnval .= '<option value="' . $id . '">' . $name . '</option>';
        }
    }
    $returnval .= '</select>';
    return $returnval;
}

/*********************************************************
***************** GENERIC DROP DOWN **********************
*********************************************************/
function dropdown($name,$query,$firstoption = '',$selected = '',$style = '')
{
    $returnval = '';

    $returnval .= '<select id="'.$name.'" name="'.$name.'" '.$style.'>';
    if ( $firstoption != '' )
    {
        $returnval .= '<option value="">'.$firstoption.'</option>';
    }
    $result = db_query($query);

    while ( $row = db_fetch_assoc($result) )
    {
        if ( $selected == $row['id'] )
        {
            $returnval .= '<option value="'.$row['id'].'" SELECTED>'.$row['name'].'</option>';
        }
        else
        {
            $returnval .= '<option value="'.$row['id'].'">'.$row['name'].'</option>';
        }
    }
    $returnval .= '</select>';
    return $returnval;
}

/*********************************************************
***************** GENERIC DROP DOWN **********************
*********************************************************/
function dropdownmulti($name,$query,$firstoption = '',$selected = array(),$style = '')
{
    $returnval = '';

    $returnval .= '<select id="'.$name.'" name="'.$name.'" id="'.$name.'" '.$style.' MULTIPLE>';

    if ( $firstoption != '' && $selected[0] == '' )
    {
        $returnval .= '<option value="" selected>'.$firstoption.'</option>';
    }
	else if ( $firstoption != '' )
	{
		$returnval .= '<option value="">'.$firstoption.'</option>';
	}

    $result = db_query($query);

    while ( $row = db_fetch_assoc($result) )
    {
        if ( in_array($row['id'], $selected) )
        {
            $returnval .= '<option value="'.$row['id'].'" SELECTED>'.$row['name'].'</option>';
        }
        else
        {
            $returnval .= '<option value="'.$row['id'].'">'.$row['name'].'</option>';
        }
    }
    $returnval .= '</select>';
    return $returnval;
}

/*********************************************************
**************** TWO LEVEL DROP DOWN *********************
*********************************************************/
function dropdown2($name,$query,$firstoption = '',$selected = '',$style = '')
{
    $returnval = '';

    $returnval .= '<select id="'.$name.'" name="'.$name.'" '.$style.'>';
    if ( $firstoption != '' )
    {
        $returnval .= '<option value="">'.$firstoption.'</option>';
    }
    $result = db_query($query);

    $prevname = '';
    while ( $row = db_fetch_assoc($result) )
    {
        if ( $prevname != $row['name1'] )
        {
            if ( $selected == $row['id1'] )
            {
                $returnval .= '<option value="'.$row['id1'].'" SELECTED>'.$row['name1'].'</option>';
            }
            else
            {
                $returnval .= '<option value="'.$row['id1'].'">'.$row['name1'].'</option>';
            }
            $prevname = $row['name1'];
        }
        if ( $row['id2'] != '' )
        {
            if ( $selected == $row['id2'] )
            {
                $returnval .= '<option value="'.$row['id2'].'" SELECTED>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'.$row['name1'].' : '.$row['name2'].'</option>';
            }
            else
            {
                $returnval .= '<option value="'.$row['id2'].'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'.$row['name1'].' : '.$row['name2'].'</option>';
            }
        }
    }
    $returnval .= '</select>';
    return $returnval;
}

/*********************************************************
********** TWO LEVEL DROP DOWN CHILD ONLY ****************
*********************************************************/
function dropdown2subonly($name,$query,$firstoption = '',$selected = '',$style = '')
{
    $returnval = '';

    $returnval .= '<select name="'.$name.'" '.$style.'>';
    if ( $firstoption != '' )
    {
        $returnval .= '<option value="">'.$firstoption.'</option>';
    }
    $result = db_query($query);

    $prevname = '';
    while ( $row = db_fetch_assoc($result) )
    {
        if ( $prevname != $row['name1'] )
        {
            $returnval .= '<optgroup label="'.$row['name1'].'"/>';
            $prevname = $row['name1'];
        }
        if ( $row['id2'] != '' )
        {
        	if(is_array($selected) && in_array($row['id2'], $selected))
        	{
                $returnval .= '<option value="'.$row['id2'].'" SELECTED>'.$row['name2'].'</option>';
        	}
            else if(!is_array($selected) && $selected == $row['id2'] )
            {
                $returnval .= '<option value="'.$row['id2'].'" SELECTED>'.$row['name2'].'</option>';
            }
            else
            {
                $returnval .= '<option value="'.$row['id2'].'">'.$row['name2'].'</option>';
            }
        }
    }
    $returnval .= '</select>';
    return $returnval;
}

/*********************************************************
********** TWO LEVEL DROP DOWN CHILD ONLY ****************
*********************************************************/
function dropdown2subonly_special($name,$query,$firstoption = '',$selected = '',$style = '')
{
    $returnval = '';

    $returnval .= '<select id="'.$name.'" name="'.$name.'" id="'.$name.'" '.$style.'>';
    if ( $firstoption != '' )
    {
        $returnval .= '<option value="">'.$firstoption.'</option>';
    }
    $result = db_query($query);

    $prevname = '';
    while ( $row = db_fetch_assoc($result) )
    {
        if ( $prevname != $row['name1'] )
        {
            $returnval .= '<optgroup label="'.$row['name1'].'"/>';
            $prevname = $row['name1'];
        }
        if ( $row['id2'] != '' )
        {
            if ( $selected == $row['id2'] )
            {
                $returnval .= '<option value="'.$row['id2'].'" SELECTED>'.$row['name2'].'</option>';
            }
            else
            {
                $returnval .= '<option value="'.$row['id2'].'">'.$row['name2'].'</option>';
            }
        }
    }
    $returnval .= '</select>';
    return $returnval;
}
/*********************************************************
******************** GET VARIABLE ************************
*********************************************************/
function get_variable($name,$default)
{
    if ( isset($_GET[$name]) )
    {
		return $_GET[$name];
	}
	else if ( isset($_POST[$name]) )
	{
		return $_POST[$name];
	}
	else
	{
		return $default;
	}
}
/*********************************************************
******************** GET VARIABLE ************************
*********************************************************/
function get_arg($pos)
{
	global $argv;
	if($argv[$pos] == '_'){
		return '';
	}else{
		return $argv[$pos];
	}
}
/*********************************************************
******************** GET VARIABLE ************************
*********************************************************/
function get_postvariable($name,$default)
{
	if ( isset($_POST[$name]) )
	{
		return $_POST[$name];
	}
	else
	{
		return $default;
	}
}
/*********************************************************
******************** GET VARIABLE ************************
*********************************************************/
function get_getvariable($name,$default)
{
	if ( isset($_GET[$name]) )
	{
		return $_GET[$name];
	}
	else
	{
		return $default;
	}
}

/*********************************************************
******************** GET SESSION *************************
*********************************************************/
function get_session($name,$default)
{
	if ( isset($_SESSION[$name]) )
	{
		return $_SESSION[$name];
	}
	else
	{
		return $default;
	}
}

/*********************************************************
***************** CLEAN COMMA DELIM **********************
*********************************************************/
function cleancommadelim($str)
{
	$str = ereg_replace("[\t\n\r ,]+",',',$str);
	if ( substr($str,0,1) == ',' )
	{
		$str = substr($str,1);
	}
	if ( substr($str,-1) == ',' )
	{
		$str = substr($str,0,-1);
	}
	return $str;
}

/*********************************************************
********************* STOP WATCH *************************
*********************************************************/
function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}

/*********************************************************
****************** MONTH DROP DOWN ***********************
*********************************************************/
function month_dropdown($name,$firstoption = '',$selected = '',$style = '')
{
	$monthname = array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
	$month = array();
	for($i = 1;$i < 13;$i++){
		$month[$i] = $monthname[$i - 1];
	}
	return dropdown_array($name,$month,$firstoption,$selected,$style);
}

/*********************************************************
******************* DAY DROP DOWN ************************
*********************************************************/
function day_dropdown($name,$firstoption = '',$selected = '',$style = ''){
	$day = array();
	for($i = 1;$i < 32;$i++){
		$day[$i] = $i;
	}
	return dropdown_array($name,$day,$firstoption,$selected,$style);
}

/*********************************************************
****************** YEAR DROP DOWN ************************
*********************************************************/
function year_dropdown($name,$firstoption = '',$selected = '',$style = ''){
	$year = array();
	for($i = 2004;$i < date('Y')+2;$i++){
		$year[$i] = $i;
	}
	return dropdown_array($name,$year,$firstoption,$selected,$style);
}

/*********************************************************
****************** YEAR DROP DOWN ************************
*********************************************************/
function week_dropdown($name,$firstoption = '',$selected = '',$style = '')
{
	$today = strtotime(date('Y-01-01'));

	$dayofweek = date('w', $today);
	$firstday = $today - 86400 * ($dayofweek - 4);
	$start = $firstday - 86400 * 7 * 52;
	$end = $firstday + 86400 * 7 * 104;

	$week = array();
	for($i = $start; $i <= $end; $i += 86400 * 7){
		$week[date('Y-m-d',$i)] = date('M j, Y',$i);
	}
	return dropdown_array($name,$week,$firstoption,$selected,$style);
}

/*********************************************************
****************** WEEKDAY DROP DOWN *********************
*********************************************************/
function weekday_dropdown($name,$firstoption = '',$selected = '',$style = ''){
	$today = time();

	$dayofweek = date('w', $today);
	$firstday = $today - 86400 * ($dayofweek - 4);
	$start = $firstday - 86400 * 7 * 12;
	$end = $firstday + 86400 * 7 * 2;

	$week = array();
	for($i = $start; $i <= $end; $i += 86400 * 7){
		$week[date('Y-m-d',$i)] = date('M j, Y',$i);
	}
	return dropdown_array($name,$week,$firstoption,$selected,$style);
}

/*********************************************************
******************** CREATE URL **************************
*********************************************************/
function createurl($_GET){
	$url = '';
	foreach($_GET as $key => $value){
		if(is_array($value)){
			foreach($value as $key2 => $value2){
				$url .= $key . '[]=' . $value2 . '&';
			}
		}else{
			if($key != 'action' && $key != 'message' && $key != 'page' && $key != 'letter'){
				$url .= $key . '=' . $value . '&';
			}
		}
	}
	$url = substr($url, 0 , -1);
	return $url;
}

/*********************************************************
****************** TEMPLATE REPLACE **********************
*********************************************************/
function templatereplace($str,$arr){

	$return_str = $str;
    foreach($arr as $key => $value){
      $return_str = str_replace("<<$key>>",$value,$return_str);
    }
	return $return_str;
}

/*********************************************************
****************** BINARY SEARCH *************************
*********************************************************/
function binary_search($array, $element) {
	/** Returns the found $element or -1 */
	$low = 0;
	$high = count($array) - 1;
	$pos = -1;
	while ($low <= $high) {
		$mid = floor(($low + $high) / 2);  // C floors for you
		if ($element == $array[$mid]) {
			return $mid;
		}else{
			if ($element < $array[$mid]) {
				$high = $mid - 1;
			}else{
				$low = $mid + 1;
			}
		}
	}
	return $pos;  // $element not found
}

/*********************************************************
********************* DATE RANGE *************************
*********************************************************/
function get_daterange($fromyear, $frommonth, $fromday, $toyear, $tomonth, $today) {
   $from_date = date("Y-m-d", mktime(0,0,0, $frommonth, $fromday, $fromyear));
   $to_date = date("Y-m-d", mktime(0,0,0, $tomonth, $today, $toyear));

   $dif = ((strtotime($to_date) - strtotime($from_date)) / 86400);

   $tmp_date = $from_date;

   for($i= 0; $i < ($dif+1); $i++) {
     if($i == 0)
	   $x[] = date("Y-m-d", mktime(0,0,0, substr($tmp_date,5,2),substr($tmp_date,-2,2),substr($tmp_date,0,4)));
     else
	   $x[] = date("Y-m-d", mktime(0,0,0, substr($tmp_date,5,2),(substr($tmp_date,-2,2)+1),substr($tmp_date,0,4)));
     $tmp_date = $x[$i];
   }
   return $x;

}

/*********************************************************
********************** SITE NAME *************************
*********************************************************/
function get_sitename($id)
{
    $query = db_query("select
	                          *
					   from
					          site
					   where
					          site_id = $id");
	$row = db_fetch_assoc($query);

	return $row['site_name'];
}

/*********************************************************
******************** TABLE FIELDS ************************
*********************************************************/
function get_table($table)
{
    $query = db_query("DESCRIBE " . $table);

	while ( $row = db_fetch_assoc($query) )
	{
	    if ( $row['Field'] != $table . "_id" )
		{
		    $tableFields[] = $row['Field'];
		}
	}

	return $tableFields;
}

/*********************************************************
*************** CLIENT COST PER LEAD *********************
*********************************************************/
function get_clientcpl($client_id)
{
    $ret = 0;
    $query = db_query("select
	                          *
					   from
					          costperlead
					   where
					          client_id = $client_id
					   order by
					          startdate");

	$row = db_fetch_assoc($query);

	if ( ($num = db_num_rows($query)) > 0 )
	{
		$ret = $row['amount'];
	}

	return $ret;
}


/*********************************************************
*************** CLIENT COST PER LEAD *********************
*********************************************************/
function get_invalidstatus()
{
    $ret = '(1=0';
    $query = db_query("select
	                          *
					   from
					          status
					   where
					          valid = 'N'");

	while($row = db_fetch_assoc($query)){
		$ret .= " OR status = '" . $row['status']."'";
	}
    $ret .= ')';

	return $ret;
}

/*********************************************************
*************** CLIENT COST PER LEAD *********************
*********************************************************/
function get_validstatus()
{
    $ret = '(1=0';
    $query = db_query("select
	                          *
					   from
					          status
					   where
					          valid = 'Y'");

	while($row = db_fetch_assoc($query)){
		$ret .= " OR status = '" . $row['status']."'";
	}
    $ret .= ')';

	return $ret;
}

/*********************************************************
*************** CLIENT COST PER LEAD *********************
*********************************************************/
function get_invalidstatus_in()
{
    $ret = 'student_client.status IN (';
    $query = db_query("select
	                          *
					   from
					          status
					   where
					          valid = 'N'");

	while ( $row = db_fetch_assoc($query) )
	{
		$ret .= "'" . $row['status']."',";
	}
	$ret .= "'0')";

	return $ret;
}

/*********************************************************
*************** CLIENT COST PER LEAD *********************
*********************************************************/
function get_validstatus_in()
{
    $ret = 'student_client.status IN (';
    $query = db_query("select
	                          *
					   from
					          status
					   where
					          valid = 'Y'");

	while ( $row = db_fetch_assoc($query) )
	{
		$ret .= "'" . $row['status']."',";
	}
    $ret .= "'0')";

	return $ret;
}

$validstatuses = array();
function isvalidstatus($status)
{
	if(count($validstatuses) == 0)
	{
		$query = db_query("SELECT * FROM status");
		while($row = db_fetch_assoc($query))
		{
			$validstatuses[$row['status']] = $row['valid'];
		}
	}
	if($validstatuses[$status] == 'Y')
	{
		return true;
	}
	else
	{
		return false;
	}
}
/*********************************************************
************* Uncompressing Zip Files ********************
*********************************************************/
function unzip($dir, $file, $verbose = 0) {

   $dir_path = "$dir$file";
   $zip_path = "$dir$file.zip";
   $directory_created = "false";

   $ERROR_MSGS[0] = "OK";
   $ERROR_MSGS[1] = "Zip path $zip_path doesn't exists.";
   $ERROR_MSGS[2] = "Directory $dir_path for unzip the pack already exists, please check  your file.";
   $ERROR_MSGS[3] = "Error while opening the $zip_path file.";

   $ERROR = 0;

   if (file_exists($zip_path)) {  // Checks for zip file
/*
   		if (!file_exists($dir_path)) { // Checks for zip's dir w/ same name as file to unzip too. if not found then create
        	mkdir($dir_path);
        	if (($link = zip_open($zip_path))) { // Opens the zip file
          		while (($zip_entry = zip_read($link)) && (!$ERROR)) { // Grab handle on first file
               		if (zip_entry_open($link, $zip_entry, "r")) { // Attempting to open a file for reading
						$data = zip_entry_read($zip_entry, zip_entry_filesize($zip_entry)); // Returns the data string read
						$dir_name = dirname(zip_entry_name($zip_entry)); // Retrieves the name of the directory entry
						$name = zip_entry_name($zip_entry); // Retrieves the name of file

						// Debug Code
						/* echo "DIR NAME = ".$dir_name."\n";
						echo "NAME OF FILE = ".$name."\n";
						echo "DATA TO BE ENTERED = ".$data."\n";
						echo "NAME - 1 = ".$name[strlen($name)-1]; */
/*
						$base = "$dir_path/".$dir_name;
                 		if ( !file_exists($base) ) { //Building the directories structure
							mkdir($base);
						}
						if ( file_exists($base) && $name[strlen($name)-1] != '/' ) {  // Opening filel to write to it
                     		$name = "$dir_path/$name";

                     		if ($verbose)
                       			echo "extracting: $name<br>";

                   			$stream = fopen($name, "w"); // opening file if not create it.
                   			fwrite($stream, $data);
							fclose($stream);
                 		}
                 		zip_entry_close($zip_entry);

               		} else
                 		$ERROR = 4;
             	} // End While Loop
             	zip_close($link);

			if(
           	} else
             	$ERROR = "3";
       	} else
         	$ERROR = 2;
*/
			exec("unzip -o $zip_path -d $dir_path");
   	} else
       $ERROR = 1;

   return $ERROR_MSGS[$ERROR];

}

/*********************************************************
********** Recursively Removes Dir/Files *****************
*********************************************************/
function SureRemoveDir($dir) {
   if(!$dh = @opendir($dir)) return;
   while (($obj = readdir($dh))) {
     if($obj=='.' || $obj=='..') continue;
     if (!@unlink($dir.'/'.$obj)) {
         SureRemoveDir($dir.'/'.$obj);
     } else {
         $file_deleted++;
     }
   }
   @closedir($dh);
   if (@rmdir($dir)) $dir_deleted++;
}

/*********************************************************
***************** Relative Day Drop Down *****************
*********************************************************/
function relativeday_dropdown($name,$firstoption = '',$selected = '',$style = '')
{
	$day = array();
	for($i = 1;$i < 32;$i++){
		$day[$i] = $i;
	}
	$day['yesterday'] = 'yesterday';
	$day['last week'] = 'last week';
	$day['this month'] = 'this month';
	$day['last month'] = 'last month';
	return dropdown_array($name,$day,$firstoption,$selected,$style);
}

/*********************************************************
************************ SET PAGES ***********************
*********************************************************/
function set_pages($function,$vals)
{
	$_SESSION['letter'] = $vals['letter'];
	$_SESSION['page'] = $vals['page'];

	define('CURRENT_PAGE', $vals['page']);
	define('NUMBER_VIEWED', ((CURRENT_PAGE-1) * NUMBER_PER_PAGE));

	$num_results = $function($vals);

	if ( $num_results > 0 )
	{
		define('TOTAL_PAGES', ceil($num_results/NUMBER_PER_PAGE));
	}
	else
	{
		define('TOTAL_PAGES', 1);
	}

	if ( $vals['page'] > TOTAL_PAGES )
	{
		$vals['page'] = 1;
	}

	if ( $_SESSION['page'] > TOTAL_PAGES )
	{
		$vals['page'] = 1;
		$_SESSION['page'] = 1;
	}
	return $vals['page'];
}

/*********************************************************
*********************** SUMMARY **************************
*********************************************************/
function summary($str, $length){
	if(strlen($str) <= $length)
	{
		return $str;
	}
	else
	{
		return substr($str, 0, $length).'...';
	}
}
/*********************************************************
*********************************************************/
function send_mail($to, $subject, $message, $additional_headers = '', $additional_parameters = '')
{
	mail($to, $subject, $message, $additional_headers, $additional_parameters);
}

/*********************************************************
*********************************************************/
function email_cleaner($email_list)
{
	$clean_list = "";
	//replace any semicolon with comma
	if( $email_list != '' )
	{
		$clean_list = str_replace( ";", ",", $email_list );
	}

	return $clean_list;
}
/*********************************************************
*********************************************************/
function create_querystring($array, $omit = array())
{
	foreach($array as $key => $value)
	{
		$use = true;
		for($i = 0; $i < count($omit); $i++)
		{
			if ( $key == $omit[$i] )
			{
				$use = false;
			}
		}
		if($use && $value != '')
		{
			$querystring .= $key.'='.$value.'&';
		}
	}
	return $querystring;
}
/*********************************************************
*********************************************************/
function userhours($user_id, $startdate, $enddate)
{
	$query = "SELECT sum(hour_num) AS total_hours FROM hour WHERE user_id = ".$user_id." AND hour_date >= '".$startdate."' AND hour_date < '".$enddate."'";
	$result = db_query($query);
	if($row = db_fetch_assoc($result))
	{
		return $row['total_hours'] + 0;
	}
	else
	{
		return 0;
	}
}
/*********************************************************
*********************************************************/
function companyproject_dropdown($name,$firstoption = '',$selected = '',$style = '')
{
	$query = "SELECT ".
			"company.company_id AS id1, ".
			"company.company_name AS name1, ".
			"project.project_id as id2, ".
			"project.project_name as name2 ".
		"FROM ".
			"project ".
		"INNER JOIN ".
			"company ".
		"ON ".
			"project.company_id = company.company_id ".
		"ORDER BY ".
			"company_name, project_name";
	return dropdown2subonly($name, $query, $firstoption, $selected, $style);
}
/*********************************************************
*********************************************************/
function company_dropdown($name,$firstoption = '',$selected = '',$style = '')
{
	$query = "SELECT ".
			"company.company_id AS id, ".
			"company.company_name AS name ".
		"FROM ".
			"company ".
		"ORDER BY ".
			"company_name";
	return dropdown($name, $query, $firstoption, $selected, $style);
}
/*********************************************************
*********************************************************/
function payrolldate_dropdown($name,$firstoption = '',$selected = '',$style = '')
{
	$today = strtotime(date('Y-01-01'));

	$dayofweek = date('w', $today);
	$firstday = $today - 86400 * ($dayofweek - 4);
	$start = $firstday - 86400 * 7 * 52;
	$end = $firstday + 86400 * 7 * 104;

	$week = array();
	for($i = $start; $i <= $end; $i += 86400 * 7)
	{
		$key = date('Y-m-d',$i).' '.date('Y-m-d',$i + 86400 * 6);
		$value = date('M j, Y',$i) . ' - ' . date('M j, Y',$i + 86400 * 6);
		if($selected == '' && $today >= $i && $today < ($i + 86400 * 6))
		{
			$selected = $key;
		}
		$week[$key] = $value;
	}
	return dropdown_array($name,$week,$firstoption,$selected,$style);
}
/*********************************************************
*********************************************************/
function format_date($str)
{
	//Friday Jan 5, 2008 - (2 days ago)
	$now = strtotime(date('Y-m-d'));
	$time = strtotime($str);
	$days = number_format(($time - $now) / 86400, 0);
	$str = date('l M j, Y', $time);
	/*
	if($days == 0)
	{
		$str .= ' (today)';
	}
	else if($days > 0)
	{
		$str .= ' ('.$days.' days from now)';
	}
	else
	{
		$str .= ' ('.abs($days).' days ago)';
	}
	*/
	return $str;
}
/*********************************************************
*********************************************************/
function int_encrypt($id)
{
	return ($id - 5) * 47;
}
/*********************************************************
*********************************************************/
function int_decrypt($id)
{
	return round($id / 47 + 5);
}
?>

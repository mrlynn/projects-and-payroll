<?php

  function db_connect($server = "localhost", $username = "payroll", $password = "payr0ll", $database = "wss_payroll_prod1", $link = 'db_link') {
    global $$link;

    $$link = mysql_connect($server, $username, $password, true);

    if ($$link) mysql_select_db($database, $$link);

    return $$link;
  }

  function db_close($link = 'db_link') {
    global $$link;

    return mysql_close($$link);
  }

  function db_error($query, $errno, $error) {
	$tmp = "";
	$tmp .= "SERVER:\n";
	foreach($_SERVER as $key => $value){
      $tmp .= "$key = $value\n";
    }
	$tmp .= "POST:\n";
	foreach($_POST as $key => $value){
      $tmp .= "$key = $value\n";
    }
	$tmp .= "GET:\n";
	foreach($_GET as $key => $value){
      $tmp .= "$key = $value\n";
    }
    mail("error@mlynn.org", "MySQL Error", $tmp."\n" . $errno . ' - ' . $error . "\n\n" . $query);
    die('<font color="#000000"><b>' . $errno . ' - ' . $error . '<br><br>' . $query . '<br><br></b></font>');

  }

  function db_query($query,$descript='',$link = 'db_link') {
    global $$link;
	$tmp = substr($query, 0, 6);

print $query;
    $result = mysql_query($query, $$link) or db_error($query, mysql_errno($$link), mysql_error($$link));

    return $result;
  }

  function db_perform($table, $data, $action = 'insert', $link = 'db_link') {
    $columns = Array();

    $query= "describe ".$table;
    $result= db_query($query);

    while($row = db_fetch_assoc($result)){
      if(isset($data[$row['Field']]) && $row['Field'] != 'id'){
        $columns[] = $row['Field'];
      }
    }

    if ($action == 'insert') {
      $query = 'insert into ' . $table . ' (';
      foreach($columns as $field){
        $query .= $field . ', ';
      }
      $query = substr($query, 0, -2) . ') values (';
      foreach($columns as $field){
        switch ((string)$data[$field]) {
          case 'now()':
            $query .= 'now(), ';
            break;
          case 'createdate':
            $query .= 'now(), ';
            break;
          case 'null':
		  case 'NULL':
		  case '\n':
			$query .= 'NULL, ';
            break;
          default:
            $query .= '\'' . db_input($data[$field]) . '\', ';
            break;
        }
      }
      $query = substr($query, 0, -2) . ')';
    } elseif ($action == 'update') {
      $query = 'update ' . $table . ' set ';
      foreach($columns as $field){
        switch ((string)$data[$field]) {
          case 'now()':
            $query .= $field . ' = now(), ';
            break;
          case 'null':
		  case 'NULL':
		  case '\n':
			$query .= $field . ' = NULL, ';
            break;
          default:
            $query .= $field . ' = \'' . db_input($data[$field]) . '\', ';
            break;
        }
      }
      $query = substr($query, 0, -2) . ' where '.$table.'_id = ' . $data['id'];
    } elseif ($action == 'replace') {
      $query = 'replace into ' . $table . ' (';
      foreach($columns as $field){
        $query .= $field . ', ';
      }
      $query = substr($query, 0, -2) . ') values (';
      foreach($columns as $field){
        switch ((string)$data[$field]) {
          case 'now()':
            $query .= 'now(), ';
            break;
          case 'null':
			$query .= '\'\', ';
            break;
          default:
            $query .= '\'' . db_input($data[$field]) . '\', ';
            break;
        }
      }
      $query = substr($query, 0, -2) . ')';
    }
    return db_query($query,'',$link);
  }

  function db_fetch_row($db_query) {
    return mysql_fetch_row($db_query);
  }

  function db_fetch_array($db_query) {
    return mysql_fetch_array($db_query);
  }

  function db_fetch_assoc($db_query) {
    return mysql_fetch_assoc($db_query);
  }

  function db_num_rows($db_query) {
    return mysql_num_rows($db_query);
  }

  function db_data_seek($db_query, $row_number) {
    return mysql_data_seek($db_query, $row_number);
  }

  function db_insert_id() {
    return mysql_insert_id();
  }

  function db_affected_rows() {
    return mysql_affected_rows();
  }

  function db_free_result($db_query) {
    return mysql_free_result($db_query);
  }

  function db_fetch_fields($db_query) {
    return mysql_fetch_field($db_query);
  }

  function db_output($string) {
    return htmlspecialchars($string);
  }

  function db_input($string) {
    return addslashes($string);
//    return $string;
  }

  function db_prepare_input($string) {
    if (is_string($string)) {
      return trim(sanitize_string(stripslashes($string)));
    } elseif (is_array($string)) {
      reset($string);
      while (list($key, $value) = each($string)) {
        $string[$key] = db_prepare_input($value);
      }
      return $string;
    } else {
      return $string;
    }
  }

  function db_delete($table, $id = '', $descript = 'delete' ,$link = 'db_link') {
	$query = 'DELETE FROM '. $table .' WHERE '.$table.'_id = '.$id;
    return db_query($query,$descript,$link);
  }

  function db_select($table, $id = '', $link = 'db_link') {
    $query = 'SELECT * FROM '.$table.' WHERE '.$table.'_id = '.$id.' LIMIT 1';
    $result = db_query($query,'',$link);

    return db_fetch_assoc($result);
  }

  function db_insert($table, $data, $link = 'db_link') {
    db_perform($table, $data, 'insert', $link);
    return db_insert_id();
  }

  function db_replace($table, $data, $link = 'db_link') {
    db_perform($table, $data, 'replace', $link);
    return db_insert_id();
  }

  function db_update($table, $data, $link = 'db_link') {
    return db_perform($table, $data, 'update', $link);
  }

  function db_count($table, $parameters = '', $link = 'db_link'){
    $query = "SELECT COUNT(*) as total FROM ".$table;
    if($parameters != ''){
    	$query .= " WHERE ".$parameters;
    }
    $result = db_query($query,'',$link);

    $row = db_fetch_assoc($result);
    return $row['total'];
  }

  function db_info($link = null){
   $link? $strInfo = mysql_info($link) : $strInfo = mysql_info();

   $return = array();
   ereg("Records: ([0-9]*)", $strInfo, $records);
   ereg("Duplicates: ([0-9]*)", $strInfo, $dupes);
   ereg("Warnings: ([0-9]*)", $strInfo, $warnings);
   ereg("Deleted: ([0-9]*)", $strInfo, $deleted);
   ereg("Skipped: ([0-9]*)", $strInfo, $skipped);
   ereg("Rows matched: ([0-9]*)", $strInfo, $rows_matched);
   ereg("Changed: ([0-9]*)", $strInfo, $changed);

   $return['records'] = $records[1];
   $return['duplicates'] = $dupes[1];
   $return['warnings'] = $warnings[1];
   $return['deleted'] = $deleted[1];
   $return['skipped'] = $skipped[1];
   $return['rows_matched'] = $rows_matched[1];
   $return['changed'] = $changed[1];

   return $return;
}

?>

<?php
//database parameters
$user='payroll';   //user
$pw='payr0ll';     //user password
$db='payroll';     //name of database
$table=''; //name of table data stored in

include_once('includes/functions.php');
//make database connection
$connection = mysql_connect("localhost", $user, $pw) or
   die("Could not connect: " . mysql_error());
mysql_select_db($db) or die("Could not select database");

   $sql="SELECT project_id as id,address,city,state,zipcode,project_name as marker,latlon from project";
    $res=mysql_query($sql);
    $data=array();
    $total=mysql_num_rows($res);
    while ($obj=mysql_fetch_object($res)) {
        list($lat,$long)=explode(',',$obj->latlon);
        if (!$obj->address) {
            $obj->address=$obj->marker;
            $obj->city="Brooklyn";
            $obj->state="NY";        
		}
        if ($lat=='') {
            $where = stripslashes($obj->address.','.$obj->city.', '.$obj->state);
            $whereurl = urlencode($where);
            $location = file("http://maps.google.com/maps/geo?q=$whereurl&output=csv&key=ABQIAAAAdRqhaQduw0J4BFaF11
3zExQq5DADlavnsxwm_svRhDZVmhroOhTot5Dr0GZEYx4Lz841OkLVd7CX1Q");
            list ($stat,$acc,$lat,$long) = explode(",",$location[0]);
			if ($acc > 0) {
				$sql="UPDATE project SET latlon='".$lat.','.$long."' WHERE project_id='".$obj->id."'";
				echo $sql."\n";
				$result=mysql_query($sql);
				echo "Updated latlon for project ".$obj->marker."\n\n";
			};
        }
	}


?>

<?
function JEncode($arr){
        if (version_compare(PHP_VERSION,"5.2","<"))
        {
                require_once("includes/JSON.php"); //if php<5.2 need JSON class
                $json = new Services_JSON();//instantiate new json object
                $data=$json->encode($arr);  //encode the data in json format
        } else
        {
                $data = json_encode($arr);  //encode the data in json format
        }
        return $data;
}


function ping($host) {
 // $str=exec("ping -c 1 -w 1 $host 2>&1 1> /dev/null",$a,$a1);
  $str=exec("ping -c 1 -w 1 $host 2>/dev/null",$a,$a1);
  if(strlen($str)>1){
     return 0;
  }else{
     return 1;
  }
}
function get_data_proxy($servername) {
	$rs="SELECT servercategory FROM serverdyn WHERE servername='$servername'";
	$obj=mysql_fetch_object($rs);
	if (strtoupper($obj->servercategory)=='PROD' || strtoupper($obj->servercategory=='CNR') || strtoupper($obj->servercategory=='DR')) {
// Production Proxy
		return 'ltt-sadmin2.lvt.us.ml.com';
	} else {
// Pre-Production Proxy
		return 'mercury1.hew.us.ml.com';
	}
}
function servercount($condition) {
	if ($condition) {
		$condition="WHERE serverstat not like 'decom%' and ignoreserver!='Y' and ignoreserver!='D' and $condition";
	} else {
		$condition="WHERE serverstat not like 'decom%' and ignoreserver!='Y' and ignoreserver!='D'";
	}
	$rs=mysql_query("SELECT servername from serverdyn $condition");
	if (!$rs) {
		return;
	} else {
		return mysql_num_rows($rs);
	}
}
function dnpos() {
	$rs=mysql_query("select distinct s.servername,o.dnpstate from serverdyn s ,oseosl o where s.serverbuildver=o.buildver and o.dnpstate='2' group by s.servername");
	return mysql_num_rows($rs);
}
function dnphw() {
	$rs=mysql_query("select distinct s.servername,h.dnpstate from serverdyn s,hweosl h where s.servermodel=h.model and h.dnpstate='2' group by s.servername");
	return mysql_num_rows($rs);
}
function hwdnpstatus($servername) {
	$sql="SELECT distinct dnpstate as hwdnp from hweosl h join serverdyn s on s.servermodel=h.model where s.servername='$servername'";
	$rs=mysql_query("$sql");
	if (!$rs) {
		return -1;
	} else {
		$obj=mysql_fetch_object($rs);
		return $obj->hwdnp;
	}
	
}
function osdnpstatus($servername) {
        $sql="SELECT distinct o.dnpstate as osdnp from oseosl o join serverdyn s on s.serverbuildver=o.buildver where s.servername='$servername'"; 
        $rs=mysql_query("$sql");
        if (!$rs) {
                return -1;
        } else {
                $obj=mysql_fetch_object($rs);
                return $obj->osdnp;
        }

}
function compliant($serverbuildver) {
        switch ($serverbuildver) {
                case preg_match ("^RHCP-5\.[2|3]",$serverbuildver,$matches):
                        return true;
                        break;
                case preg_match ("^RHEL-5\.[2|3]",$serverbuildver,$matches):
                        return true;
                        break;
                case preg_match ("^SOLS-10\.[2|3]",$serverbuildver,$matches):
                        return true;
                        break;
                default:
                        return false;

        }

}
function stats() {

	$rs=mysql_query("select count(servername) as scnt FROM serverdyn where ignoreserver!='Y'");
	$obj=mysql_fetch_object($rs);
	return $obj->scnt.' servers.';
	
	
}
function checkField($tableName,$columnName)
{
	$tableFields = mysql_list_fields("unixdb",$tableName);
	for($i=0;$i<mysql_num_fields($tableFields);$i++){
		if(mysql_field_name($tableFields, $i)==$columnName) {
			print mysql_field_name($tableFields,$i);
			return 1;
		}
	} 
}
?>

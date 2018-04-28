<?php
$date='2010-02-10';
weekdays($date);
function weekdays($date) {
    for( $i=0; $i<6; $i+=1 ) {
		print add_date($date,$i)."\n";
    }
}

function add_date($givendate,$day=0,$mth=0,$yr=0) {
	$cd = strtotime($givendate);
	$newdate = date('Y-m-d h:i:s', mktime(date('h',$cd),
    date('i',$cd), date('s',$cd), date('m',$cd)+$mth,
    date('d',$cd)+$day, date('Y',$cd)+$yr));
	return $newdate;
}

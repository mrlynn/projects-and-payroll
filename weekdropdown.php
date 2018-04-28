<?php
    $today = strtotime(date('Y-01-01'));

    $dayofweek = date('w', $today);
    $firstday = $today - 86400 * ($dayofweek - 4);
    $start = $firstday - 86400 * 7 * 52;
    $end = $firstday + 86400 * 7 * 104;

    $week = array();
    class weeks {};
    for($i = $start; $i <= $end; $i += 86400 * 7){
        $weeks->date=date('Y-m-d', $i);
        $weeks->week=date('M j, Y', $i);
        $week[]=array('date'=>date('Y-m-d',$i), 'week'=>date('F j, Y', $i));
    }
    if (version_compare(PHP_VERSION,"5.2","<"))
    {
        require_once("./includes/JSON.php"); //if php<5.2 need JSON class
        $json = new Services_JSON();//instantiate new json object
        $data=$json->encode($week);  //encode the data in json format
    } else
    {
        $data = json_encode($week);  //encode the data in json format
    }

    /* If using ScriptTagProxy:  In order for the browser to process the returned
       data, the server must wrap te data object with a call to a callback function,
       the name of which is passed as a parameter by the ScriptTagProxy. (default = "stcCallback1001")
       If using HttpProxy no callback reference is to be specified*/
    $cb = isset($_GET['callback']) ? $_GET['callback'] : '';
    echo $cb . '({success:true,"data":' . $data . '})';
?>

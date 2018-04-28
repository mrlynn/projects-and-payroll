<?php

/* A demonstration which allows you to enter a place name
or even a more detailed address and get Google to give you
a latitude and longitude back */
if ($_REQUEST[where]) {
        $where = stripslashes($_REQUEST[where]);
        $whereurl = urlencode($where);
// Note - Google key is domain specific!
$location = file("http://maps.google.com/maps/geo?q=$whereurl&output=csv&key=ABQIAAAAdRqhaQduw0J4BFaF113zExQq5DADlavnsxwm_svRhDZVmhroOhTot5Dr0GZEYx4Lz841OkLVd7CX1Q");
// Sample - $location[0]="200,8,51.369318,-2.133457";
        list ($stat,$acc,$north,$east) = explode(",",$location[0]);
        $html = "Information for ".htmlspecialchars($where)."<br>";
        $html .= "North: $north, East: $east<br>";
        $html .= "Accuracy: $acc, Status: $stat<br>";
} else {
        $html = "Space reserved for your report when form completed";
}

?>
<html>
<head>
<title>Geocodeing demo - from place information to Latitude
/ Longitude</title>
</head>
<body>
<h3>This page demonstrates the use of Google's geocoding
interface</h3>
Enter a place name / address and a latitude and longitude is
returned.<hr>
<?php print $html; ?><hr>
<form method=post>Place: <input name=where size=40>
<input type=submit value=go></form>
</body>
</html>

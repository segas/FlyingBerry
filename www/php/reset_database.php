<?php

include('./db_connection.php'); //load config

$postdata = file_get_contents("php://input");
$flightname = json_decode($postdata);

mysql_fetch_object(mysql_query("UPDATE sensordata SET flight='" . $flightname . "' WHERE flight='aktuell';"));

?>

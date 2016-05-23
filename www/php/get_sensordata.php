<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST,GET,OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

include('./db_connection.php'); //load config

$result = mysql_query("SELECT datetime, temperature, humidity, pressure, altitude FROM sensordata WHERE flight='".$_GET['flight']."' ORDER BY datetime ASC");
$counter = 0;

$json = [];
while($row = mysql_fetch_assoc($result)){
  $json[] = $row;
}

echo json_encode($json);
//echo ('{"flights":'.json_encode($flights).', "error": {"code": "000","message": "Flüge konnten erfolgreich in der Datenbank gefunden werden."}}');
?>

<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST,GET,OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

include('./db_connection.php'); //load config

$result = mysql_query("SELECT DISTINCT flight FROM sensordata ORDER BY flight ASC");

$json = [];
while($row = mysql_fetch_assoc($result)){
  $json[] = $row['flight'];
}

echo ('{"flights":'.json_encode($json).', "error": {"code": "000","message": "Flüge konnten erfolgreich in der Datenbank gefunden werden."}}');
?>

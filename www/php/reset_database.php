<?php
include('./db_connection.php'); //load config

$flightname = file_get_contents("php://input");

$result = mysql_query("UPDATE sensordata SET flight=" . $flightname . " WHERE flight='aktuell'");
if (!$result) {
	// Umbenennen hat nicht funktioniert
	echo('{"Flugname":'.json_encode($flightname).', "error": {"code":"005", "message": "Flight renaming failed!"}}');
	die('Invalid query: ' . mysql_error());
}else{
	// Umbenennen hat funktioniert
	echo ('{"Flugname":'.json_encode($flightname).', "error": {"code": "000","message": "Flight renamed successfully."}}');
}
?>

<?php
include('./db_connection.php'); //load config

$postdata = file_get_contents("php://input");
$flightname = json_decode($postdata);
$newFlightName = (string)$flightname->newName;
$oldFlightName = (string)$flightname->oldName;

$query = "UPDATE sensordata SET flight='".$newFlightName."' WHERE flight='".$oldFlightName."'";
$result = mysql_query($query);

if (!$result) {
	// Umbenennen hat nicht funktioniert
	echo('{"Flugname":'.json_encode($flightname).', "error": {"code":"005", "message": "Flight renaming failed!"}}');
	die('Invalid query: ' . mysql_error());
}else{
	// Umbenennen hat funktioniert
	echo ('{"Flugname":'.json_encode($flightname).', "error": {"code": "000","message": "Flight renamed successfully."}}');
}
?>

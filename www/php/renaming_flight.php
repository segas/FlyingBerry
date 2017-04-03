<?php
//include('./db_connection.php'); //load config

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST,GET,OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

$mysql_hostname = "192.168.1.17";
$mysql_user = "flyingberry";
$mysql_password = "Cherry@2";
$mysql_database = "flyingberry";

$con = mysqli_connect($mysql_hostname, $mysql_user, $mysql_password, $mysql_database) or die("Login error! Code: 001"); // Connect to database server(localhost) with username and password.


$postdata = file_get_contents("php://input");
$flightname = json_decode($postdata);
$newFlightName = (string)$flightname->newName;
$oldFlightName = (string)$flightname->oldName;

$query = "UPDATE sensordata SET flight='".$newFlightName."' WHERE flight='".$oldFlightName."'";
$result = mysqli_query($con, $query);

if (!$result) {
	// Umbenennen hat nicht funktioniert
	echo('{"Flugname":'.json_encode($flightname).', "error": {"code":"005", "message": "Flight renaming failed!"}}');
	die('Invalid query: ' . mysqli_error());
}else{
	// Umbenennen hat funktioniert
	echo ('{"Flugname":'.json_encode($flightname).', "error": {"code": "000","message": "Flight renamed successfully."}}');
}
?>

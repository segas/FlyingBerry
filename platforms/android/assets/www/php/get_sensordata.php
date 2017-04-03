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


$result = mysqli_query($con, "SELECT datetime, temperature, humidity, pressure, altitude FROM sensordata WHERE flight='".$_GET['flight']."' ORDER BY datetime ASC");
$counter = 0;

$json = [];
while($row = mysqli_fetch_assoc($result)){
  $json[] = $row;
}

echo json_encode($json);
//echo ('{"flights":'.json_encode($flights).', "error": {"code": "000","message": "Flüge konnten erfolgreich in der Datenbank gefunden werden."}}');
?>

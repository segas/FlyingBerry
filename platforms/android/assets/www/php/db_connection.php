<?php
/**
 * Created by PhpStorm.
 * User: Stefan
 * Date: 15.02.2016
 * Time: 11:26
 */

// Verbindung mit Datenbank aufbauen
// Falls Datenbank nicht erreichbar ist gibt er eine Fehlermeldung aus

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST,GET,OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

$mysql_hostname = "88.84.20.245";
$mysql_user = "flyingberry";
$mysql_password = "Cherry@2";
$mysql_database = "flyingberry";

mysqli_connect($mysql_hostname, $mysql_user, $mysql_password, $mysql_database) or die("Login error! Code: 001"); // Connect to database server(localhost) with username and password.
?>

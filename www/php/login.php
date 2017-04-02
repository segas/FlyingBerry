<?php
//include('./db_connection.php'); //load config

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST,GET,OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

$mysql_hostname = "88.84.20.245";
$mysql_user = "flyingberry";
$mysql_password = "Cherry@2";
$mysql_database = "flyingberry";

$con = mysqli_connect($mysql_hostname, $mysql_user, $mysql_password, $mysql_database) or die("Login error! Code: 001"); // Connect to database server(localhost) with username and password.


$postdata = file_get_contents("php://input");
$loginData = json_decode($postdata);
$username = $loginData->username;
$password = $loginData->password;

$userData = array('correct' => '',
                'userid' => '',
				'firstname' => '',
				'lastname' => '',
				'username' => '',
				'active' => '');

$query = "SELECT userid, firstname, lastname, username, passwd FROM user WHERE username='".$username."' AND passwd='".$password."' LIMIT 1;";

$results = mysqli_query($con, $query) or die("Login error! Code: 003");
$match  = mysqli_num_rows($con, $results);


if(!empty($username) && !empty($password)){

	//echo($username.'  '.$password);

	$username = mysqli_real_escape_string($con, $username);
	$password = mysqli_real_escape_string($con, $password);

	$results = mysqli_query("SELECT userid, firstname, lastname, username, active FROM user WHERE username='".$username."' AND passwd='".$password."' LIMIT 1") or die("Login error! Code: 003");
	$match  = mysqli_num_rows($con, $results);

	$res = mysqli_fetch_assoc($con, $results);

    echo $res[''];

	if($match > 0 ){
			// login success
            		$userData['correct'] = 'True';
			$userData['userid'] = $res['userid'];
			$userData['firstname'] = $res['firstname'];
			$userData['lastname'] = $res['lastname'];
			$userData['username'] = $res['username'];
			$userData['active'] = $res['active'];
			echo ('{"userData":'.json_encode($userData).', "error": {"code": "000","message": "The email or password you entered is correct."}}');
	}else{
		// login failed
        $userData['correct'] = 'False';
		echo ('{"userData":'.json_encode($userData).', "error": {"code": "002","message": "The email or password you entered is incorrect."}}');
	}
} else {
	// something failed with submitting data, should never get here!
	echo('{"userData":'.json_encode($userData).', "error": {"code":"005", "message": "Login error! Code: 005"}}');
}
?>

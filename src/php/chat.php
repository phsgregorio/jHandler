<?php

	/**
	 * @name jServer
	 * @description jHandler Server Event Oriented, php script to handle the server sdie,
	 * @warning remember setting timeout parameter on jServer to renew the connection,
	 * some servers create parameters like max_execution_time, so set the timeout parameter to a value < max_execution_time
	 * @author Pedro Gregorio
	 */

	$filename = "../chat/chat.txt";
	$last_modified = $_GET["time"];
	$filetime = filemtime($filename);

	while($filetime <= $last_modified){
		usleep(10000);
		clearstatcache();
		$filetime = filemtime($filename);
	}
	
	list($user,$message) = explode("=",file_get_contents($filename));
?>

	{ 
		ev : { 
			name : "write",
			args : ["<?=$message?>","<?=$user?>"]
	  	},
	  
	  	param : { time : <?=$filetime?> }
	}
<?php

	/**
	 * @name jServer
	 * @description jHandler Server Event Oriented, php script to handle the server sdie,
	 * @author Pedro Gregorio
	 */

	if($_GET["message"]){
		
		$filename = "../chat/chat.txt";
		$message = $_GET["user"]."=".$_GET["message"];

		file_put_contents($filename,$message);
	}
?>
<?php

$input = file_get_contents("php://input");
$params = json_decode($input);

if(! isset($_GET{'level'}))
{
    http_response_code(402); // Bad Request
    exit;
}

$level = intval($_GET{'level'});
if(($level < 1)||($level > MAX_LEVEL))
{
    http_response_code(403); // Bad Request
    exit;
}

$data = null;
if (($data = @file_get_contents("level".$level.".json")) === false) {
    http_response_code(404); // Bad Request
    exit;
} 

header('Content-Type: application/json; charset=utf-8');
echo $data;
?>
<?php

define('MAX_LEVEL', 12);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // The request is using the POST method
    include("post-high-scores.php");
}
else
{
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // The request is using the GET method
    include("get-high-scores.php");
   }
   else{
    http_response_code(401); // Bad Request
   }
}
?>
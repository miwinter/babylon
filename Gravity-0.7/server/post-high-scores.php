<?php

$input = file_get_contents("php://input");
$params = json_decode($input);
if ($params === null) {
    http_response_code(405); // Bad Request
    exit;
}

if((! isset($params->{'level'}))||
    (! isset($params->{'new_score'}))||
    (! isset($params->{'name'})))
{
    http_response_code(406); // Bad Request
    exit;
}

$level = intval($params->{'level'});
if(($level < 1)||($level > MAX_LEVEL))
{
    http_response_code(407); // Bad Request
    exit;
}

$scoreTableData = null;
if (($scoreTableData = @file_get_contents("level".$level.".json")) === false) {
    http_response_code(408); // Bad Request
    exit;
} 
 
$new_score = intval(filter_var( $params->{'new_score'}, FILTER_SANITIZE_NUMBER_INT));
$new_name = filter_var( $params->{'name'}, FILTER_SANITIZE_STRING);
$new_name = substr($new_name, 0, 9);

try{
    $scoreTable = json_decode($scoreTableData,true);
} catch (Exception $e) {
    http_response_code(409); // Bad Request
    exit;
}

if ($scoreTable === null) {
    http_response_code(410); // Bad Request
    exit;
}

if($new_score < $scoreTable[10]['score'])
{
    http_response_code(411); // Bad Request
    exit;
}
else{

    $current_rank = 9;

    while(($scoreTable[$current_rank]['score'] < $new_score) && ($current_rank >= 1))
    {
        $scoreTable[$current_rank+1]['score'] = $scoreTable[$current_rank]['score'];
        $scoreTable[$current_rank+1]['name'] = $scoreTable[$current_rank]['name'];
        $current_rank --;
    }

    $scoreTable[$current_rank+1]['score'] = $new_score;
    $scoreTable[$current_rank+1]['name'] = $new_name;
}

$scoreTableData = json_encode($scoreTable);

//write json to file
if (file_put_contents("level".$level.".json", $scoreTableData) === false) {
    http_response_code(412); // Bad Request
}

header('Content-Type: application/json; charset=utf-8');
echo $scoreTableData;
?>
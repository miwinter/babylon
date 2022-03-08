<?php

$string = file_get_contents("level1.json");

//$debug = var_export($_SERVER, true);
$debug = file_get_contents("php://input");
$obj = json_decode($debug);

header('Content-Type: application/json; charset=utf-8');
if($obj->{'title'} == "foo")
    echo json_encode($debug);
else
    echo json_encode("{toto:'taat'}");
//echo $string;
return;

if ($string === false) {
    // deal with error...
}

$json_a = json_decode($string, true);
if ($json_a === null) {
    // deal with error...
}

//print_r($argv);
$new_score = filter_var( $argv[1], FILTER_SANITIZE_NUMBER_INT);
$new_name = filter_var( $argv[2], FILTER_SANITIZE_STRING);
$new_name = substr($new_name, 0, 9);


if($new_score < $json_a[9]['score'])
{
    echo "pas un meilleur score" . PHP_EOL;
}
else{
    $current_rank = 8;

    while(($json_a[$current_rank]['score'] < $new_score) && ($current_rank >= 1))
    {
        $json_a[$current_rank+1]['score'] = $json_a[$current_rank]['score'];
        $json_a[$current_rank+1]['name'] = $json_a[$current_rank]['name'];
        $current_rank --;
    }

    $json_a[$current_rank+1]['score'] = $new_score;
    $json_a[$current_rank+1]['name'] = $new_name;

}

foreach ($json_a as $rank => $score_line) {
    echo $rank . " : " . $score_line['score'] . " : " . $score_line['name'] . PHP_EOL;
}

/*
$arr = array(1 => array('score' => 112, 'name' => 'toto'),
    2 => array('score' => 110, 'name' => 'toto2'),
    3 => array('score' => 11, 'name' => 'toto3'),
    4 => array('score' => 1, 'name' => 'toto4'),
);
*/
$json_string = json_encode($json_a);
file_put_contents("level1.json", $json_string);

?>

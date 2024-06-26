<?php
/**
 *
 * Получить окончание слова после числительного.
 * @number      - number     -- числительное
 * @endingArray - array      -- массив с окончаниями
 *
 */

function getNumEnding(int $number, array $endingArray): string
{
    $number = $number % 100;
    if ($number >= 11 && $number <= 19) {
        $ending = $endingArray[2];
    } else {
        $i = $number % 10;
        switch ($i) {
            case (1):
                $ending = $endingArray[0];
                break;
            case (2):
            case (3):
            case (4):
                $ending = $endingArray[1];
                break;
            default:
                $ending = $endingArray[2];
        }
    }
    return $ending;
}

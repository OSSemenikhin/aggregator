<?php

namespace App\Services;

use Exception;
use Intervention\Image\Facades\Image;

class ImageService
{
    public const EXTENTIONS = [
        "image/png" => 'png',
        "image/jpeg" => 'jpg',
        "image/jpg" => 'jpg',
        "image/webp" => 'webp'
    ];

    public const SIZES = [
        'sm' => 576,
        'md' => 992,
        'lg' => 1200,
    ];

    public static function saveToStorage($image, string $folderPath): array|bool
    {
        try {
            $name = hash('sha256', (string)microtime(true));
            $image = Image::make($image);
            $extention = self::EXTENTIONS[$image->mime()];
            $additionalType = $extention != 'webp' ? 'webp' : 'jpg';

            self::saveImage(clone $image, $name, $folderPath . '/', $extention);
            self::saveImage(( clone $image )->encode($additionalType), $name, $folderPath . '/', $additionalType);
            $sizes = self::createWidthSet(clone $image, $name, $folderPath, $additionalType);

            return [ 'name' => $extention != 'webp' ? $name . '.' . $extention : $name . '.' . $additionalType,
                'sizes' => $sizes
            ];

        } catch (Exception $error) {
            $path = $folderPath . '/' . $name . '.';

            self::removeImage($path . $extention);
            self::removeImage($path . $additionalType);

            foreach (self::SIZES as $sizeName => $size) {
                $path = $folderPath . '/' . $sizeName . '/' . $name . '.';
                self::removeImage($path . $extention);
                self::removeImage($path . $additionalType);
            }

            \App\Helpers::log($error->getMessage(), __DIR__ . '/ImageServiceErrors');
        }

        return false;
    }

    private static function createWidthSet($image, string $name, string $folderPath, string $additionalType): array
    {

        $width = +$image->width();

        $sizesArr = [];
        foreach (self::SIZES as $sizeName => $size) {
            if (!($width > $size)) continue;
            $path = $folderPath . '/' . $sizeName;

            self::saveImage(
                ( clone $image )->widen($size),
                $name,
                $path,
                self::EXTENTIONS[$image->mime()]
            );

            self::saveImage(
                ( clone $image )->encode($additionalType)->widen($size),
                $name,
                $path,
                $additionalType
            );
            $sizesArr[] = $sizeName;
        }

        return $sizesArr;
    }

    private static function saveImage($image, string $name, string $path, string $type): void
    {
        $fullName = $name . '.' . $type;
        if (!file_exists($path)) mkdir($path, 0755, true);
        $imagePath = $path . '/' . $fullName;
        $image->interlace(true)->save($imagePath, 80);
    }

    private static function removeImage(string $path): void
    {
        if (file_exists($path)) {
            unlink($path);
        }
    }
}

<?php

namespace ClarkWinkelmann\IpsumAutocomplete;

use Faker\Factory;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class LoremIpsumController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $paragraphs = max((int)Arr::get($request->getQueryParams(), 'paragraphs'), 1);

        $faker = Factory::create();

        return new JsonResponse([
            'text' => implode("\n\n", $faker->paragraphs($paragraphs)),
        ]);
    }
}

<?php

namespace ClarkWinkelmann\IpsumAutocomplete;

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    new Extend\Locales(__DIR__ . '/locale'),

    (new Extend\Routes('api'))
        ->get('/lorem-ipsum-autocomplete', 'ipsum-autocomplete', LoremIpsumController::class),

];

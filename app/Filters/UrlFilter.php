<?php

namespace App\Filters;

use App\Filters\AppFilter;

class UrlFilter extends AppFilter
{
  protected $safeParams = ['long_url', 'code'];
}

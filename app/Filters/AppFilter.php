<?php

namespace App\Filters;

use Illuminate\Http\Request;

class AppFilter
{
  protected $safeParams = [];

  protected $columnMap = [];

  public function transform(Request $request)
  {
    $eloQuerty = [];

    foreach ($this->safeParams as $param) {
      $query = $request->get($param);

      if (!isset($query)) {
        continue;
      }

      $param = isset($this->columnMap[$param]) ? $this->columnMap[$param] : $param;

      $eloQuerty[$param] = $query;
    }

    return $eloQuerty;
  }
}

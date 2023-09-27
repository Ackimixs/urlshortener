<?php

namespace App\Controller;

use App\Repository\UrlRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;

class UrlRedirectController extends AbstractController
{
  #[Route('/r/{code}', name: 'url_redirect')]
  public function index(UrlRepository $urlRepository, string $code): RedirectResponse
  {
    $url = $urlRepository->findOneByCode($code);

    if (!$url) {
      throw $this->createNotFoundException('The url does not exist');
    }

    return $this->redirect($url->getLongUrl(), 301);
  }
}

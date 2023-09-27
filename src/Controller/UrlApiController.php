<?php

namespace App\Controller;

use App\Entity\Url;
use App\Repository\UrlRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class UrlApiController extends AbstractController
{
    #[Route('/api/url', name: "url_show", methods: ['GET'])]
    public function index(UrlRepository $urlRepository): JsonResponse
    {
        $url = $urlRepository->findAll();

        $data = array();

        foreach ($url as $u) {
            $data[] = $u->getAll();
        }

        return new JsonResponse(['body' => ['url' => $data]]);
    }

    #[Route('/api/url/{code}', name: "url_show_code", methods: ['GET'])]
    public function show(string $code, UrlRepository $urlRepository): JsonResponse
    {
        $url = $urlRepository->findOneByCode($code);

        if (!$url) {
            return new JsonResponse(['error' => 'Url not found'], 404);
        }

        return new JsonResponse(['body' => ['url' => $url->getAll()]]);
    }

    #[Route('/api/url', name: "url_create", methods: ['POST'])]
    public function create(Request $requets, EntityManagerInterface $entityManager): JsonResponse
    {

        $data = json_decode($requets->getContent(), true);

        if (empty($data['code']) || empty($data['long_url'])) {
            return new JsonResponse(['error' => 'Missing required parameters'], 404);
        }

        $url = new Url();
        $url->setCode($data['code']);
        $url->setLongUrl($data['long_url']);

        $entityManager->persist($url);

        $entityManager->flush();

        return new JsonResponse(['body' => ['url' => $url->getAll()]]);
    }

    #[Route('/api/url/{id}', name: "url_delete", methods: ['DELETE'])]
    public function delete(int $id, UrlRepository $urlRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $url = $urlRepository->findOneById($id);

        if (!$url) {
            return new JsonResponse(['error' => 'Url not found'], 404);
        }

        $entityManager->remove($url);
        $entityManager->flush();

        return new JsonResponse(['body' => ['url' => 'Url deleted']]);
    }

    #[Route('/api/url/{id}', name: "url_update", methods: ['PUT'])]
    public function update(int $id, Request $requets, UrlRepository $urlRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $url = $urlRepository->findOneById($id);

        if (!$url) {
            return new JsonResponse(['error' => 'Url not found'], 404);
        }

        $data = json_decode($requets->getContent(), true);

        empty($data['code']) ? true : $url->setCode($data['code']);
        empty($data['long_url']) ? true : $url->setLongUrl($data['long_url']);

        $entityManager->persist($url);
        $entityManager->flush();

        return new JsonResponse(['body' => ['url' => 'Url updated']]);
    }
}

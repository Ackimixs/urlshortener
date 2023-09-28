package com.example.urlshspring.controllers;

import com.example.urlshspring.dao.UrlRepository;
import com.example.urlshspring.models.Url;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;


@RestController
public class UrlController {

    @Autowired
    private UrlRepository urlRepository;

    @PostMapping("/api/url")
    public Map<String, Map<String, Url>> saveUrl(@RequestBody Url url) {
        urlRepository.save(url);
        return new HashMap<>(Map.of("body", new HashMap<>(Map.of("url", url))));
    }

    @GetMapping("/api/url")
    public Map<String, Map<String, List<Url>>> getAllUrls() {

        List<Url> url = urlRepository.findAll();

        Map<String, Map<String, List<Url>>> body = new HashMap<>();
        body.put("body", new HashMap<>(Map.of("url", url)));

        return body;
    }

    @GetMapping("/api/url/{id}")
    public Map<String, Map<String, Url>> getUrlById(@PathVariable Integer id) {
        Url url = urlRepository.findById(id).orElse(null);
        return new HashMap<>(Map.of("body", new HashMap<>(Map.of("url", url))));
    }

    @GetMapping("/r/{code}")
    public RedirectView redirect(@PathVariable String code) {

        Url url = urlRepository.findByCode(code);

        if (Objects.nonNull(url)) {
            return new RedirectView(url.getLong_url());
        } else {
            return new RedirectView("index");
        }
    }

}

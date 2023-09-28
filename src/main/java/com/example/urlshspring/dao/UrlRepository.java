package com.example.urlshspring.dao;

import com.example.urlshspring.models.Url;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UrlRepository extends JpaRepository<Url, Integer> {

    Url findByCode(String code);
}

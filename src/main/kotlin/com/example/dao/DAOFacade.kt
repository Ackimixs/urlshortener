package com.example.dao

import com.example.models.*

interface DAOFacade {
    suspend fun allUrls(): List<Url>
    suspend fun url(code: String, longUrl: String): Url?
    suspend fun url_w_code(code: String): Url?
    suspend fun url_w_longurl(longUrl: String): Url?
    suspend fun addNewUrl(longUrl: String, code: String): Url?
}
package com.example.dao

import com.example.models.*

interface DAOFacade {
    suspend fun allUrls(): List<Url>
    suspend fun url(code: String, long_url: String): Url?
    suspend fun url_w_code(code: String): Url?
    suspend fun url_w_longurl(long_url: String): Url?
    suspend fun addNewUrl(long_url: String, code: String): Url?
}
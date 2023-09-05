package com.example.dao

import com.example.dao.DatabaseFactory.dbQuery
import com.example.models.*
import org.jetbrains.exposed.sql.*

class DAOFacadeImpl : DAOFacade {
    private fun resultRowToUrl(row: ResultRow) = Url(
        longUrl = row[Urls.longUrl],
        code = row[Urls.code]
    )

    override suspend fun allUrls(): List<Url> = dbQuery {
        Urls.selectAll().map { resultRowToUrl(it) }
    }

    override suspend fun url(code: String, longUrl: String): Url? = dbQuery {
        Urls.select { (Urls.code eq code) and (Urls.longUrl eq longUrl) }.mapNotNull { resultRowToUrl(it) }.singleOrNull()
    }

    override suspend fun url_w_code(code: String): Url? = dbQuery {
        Urls.select { Urls.code eq code }.mapNotNull { resultRowToUrl(it) }.singleOrNull()
    }

    override suspend fun url_w_longurl(longUrl: String): Url? = dbQuery {
        Urls.select { Urls.longUrl eq longUrl }.mapNotNull { resultRowToUrl(it) }.singleOrNull()
    }

    override suspend fun addNewUrl(longUrl: String, code: String): Url? {
        val url = Url(longUrl, code)
        return dbQuery {
            Urls.insert {
                it[Urls.longUrl] = url.longUrl
                it[Urls.code] = url.code
            }
            url
        }
    }
}

val dao: DAOFacade = DAOFacadeImpl()
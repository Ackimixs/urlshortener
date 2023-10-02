package com.example.dao

import com.example.dao.DatabaseFactory.dbQuery
import com.example.models.*
import org.jetbrains.exposed.sql.*

class DAOFacadeImpl : DAOFacade {
    private fun resultRowToUrl(row: ResultRow) = Url(
        long_url = row[Urls.long_url],
        code = row[Urls.code]
    )

    override suspend fun allUrls(): List<Url> = dbQuery {
        Urls.selectAll().map { resultRowToUrl(it) }
    }

    override suspend fun url(code: String, long_url: String): Url? = dbQuery {
        Urls.select { (Urls.code eq code) and (Urls.long_url eq long_url) }.mapNotNull { resultRowToUrl(it) }.singleOrNull()
    }

    override suspend fun url_w_code(code: String): Url? = dbQuery {
        Urls.select { Urls.code eq code }.mapNotNull { resultRowToUrl(it) }.singleOrNull()
    }

    override suspend fun url_w_longurl(long_url: String): Url? = dbQuery {
        Urls.select { Urls.long_url eq long_url }.mapNotNull { resultRowToUrl(it) }.singleOrNull()
    }

    override suspend fun addNewUrl(long_url: String, code: String): Url? {
        val url = Url(long_url, code)
        return dbQuery {
            Urls.insert {
                it[Urls.long_url] = url.long_url
                it[Urls.code] = url.code
            }
            url
        }
    }
}

val dao: DAOFacade = DAOFacadeImpl()
package com.example.dao

import com.example.dao.DatabaseFactory.dbQuery
import com.example.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class DAOFacadeImpl : DAOFacade {
    private fun resultRowToUrl(row: ResultRow) = Url(
        id = row[Urls.id],
        long_url = row[Urls.long_url],
        code = row[Urls.code]
    )

    override suspend fun allUrls(): List<Url> = dbQuery {
        Urls.selectAll().map { resultRowToUrl(it) }
    }

    override suspend fun url(code: String, long_url: String): Url? = dbQuery {
        Urls.select { (Urls.code eq code) and (Urls.long_url eq long_url) }.mapNotNull { resultRowToUrl(it) }.singleOrNull()
    }

    override suspend fun url_w_id(id: Int): Url? = dbQuery {
        Urls.select { Urls.id eq id }.mapNotNull { resultRowToUrl(it) }.singleOrNull()
    }

    override suspend fun url_w_code(code: String): Url? = dbQuery {
        Urls.select { Urls.code eq code }.mapNotNull { resultRowToUrl(it) }.singleOrNull()
    }

    override suspend fun url_w_longurl(long_url: String): Url? = dbQuery {
        Urls.select { Urls.long_url eq long_url }.mapNotNull { resultRowToUrl(it) }.singleOrNull()
    }

    override suspend fun addNewUrl(long_url: String, code: String): Url? = dbQuery {
        val insertStatement = Urls.insert {
            it[Urls.long_url] = long_url
            it[Urls.code] = code
        }
        val result = insertStatement.resultedValues?.get(0)
        if (result != null) {
            resultRowToUrl(result)
        } else {
            null
        }
    }

    override suspend fun deleteUrl(id: Int): Boolean = dbQuery {
        Urls.deleteWhere { Urls.id eq id } > 0
    }

    override suspend fun updateUrl(id: Int, long_url: String, code: String): Boolean = dbQuery {
        Urls.update({Urls.id eq id}) {
            it[Urls.long_url] = long_url
            it[Urls.code] = code
        } > 0
    }
}

val dao: DAOFacade = DAOFacadeImpl()
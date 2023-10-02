package com.example.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*

@Serializable
data class Url(val id: Int, val long_url: String, val code: String)

@Serializable
data class UrlDTO(val long_url: String, val code: String)

object Urls : Table() {
    val id = integer("id").autoIncrement();
    val long_url = varchar("long_url", 255);
    val code = varchar("code", 255);

    override val primaryKey = PrimaryKey(id, name = "PK_Url_Id");
}
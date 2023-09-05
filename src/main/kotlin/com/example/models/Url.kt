package com.example.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*

@Serializable
data class Url(val longUrl: String, val code: String)

object Urls : Table() {
    val longUrl = varchar("longUrl", 255);
    val code = varchar("code", 255);

    override val primaryKey = PrimaryKey(longUrl, code, name = "PK_Url_Id");
}
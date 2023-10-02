package com.example.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*

@Serializable
data class Url(val long_url: String, val code: String)

object Urls : Table() {
    private val id = integer("id").autoIncrement();
    val long_url = varchar("long_url", 255);
    val code = varchar("code", 255);

    override val primaryKey = PrimaryKey(id, name = "PK_Url_Id");
}
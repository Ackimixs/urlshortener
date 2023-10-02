package com.example.routes

import com.example.dao.dao
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.*

fun Route.urlRoutes() {
    route("api/url") {
        get {
            val urls = dao.allUrls()
            call.respond(mapOf("body" to mapOf("url" to urls)))
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull() ?: return@get call.respondText(
                "Missing or malformed id",
                status = HttpStatusCode.BadRequest
            )

            val url = dao.url_w_id(id) ?: return@get call.respondText(
                "No url with id $id",
                status = HttpStatusCode.NotFound
            )

            call.respond(mapOf("body" to mapOf("url" to url)))
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull() ?: return@put call.respondText(
                "Missing or malformed id",
                status = HttpStatusCode.BadRequest
            )
            val url = call.receive<com.example.models.UrlDTO>()

            dao.updateUrl(id, url.long_url, url.code)
            call.respond(mapOf("body" to mapOf("url" to url)))
        }

        patch("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull() ?: return@patch call.respondText(
                "Missing or malformed id",
                status = HttpStatusCode.BadRequest
            )
            val url = call.receive<com.example.models.UrlDTO>()

            dao.updateUrl(id, url.long_url, url.code)
            call.respond(mapOf("body" to mapOf("url" to url)))
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull() ?: return@delete call.respondText(
                "Missing or malformed id",
                status = HttpStatusCode.BadRequest
            )
            dao.deleteUrl(id)
            call.respond(mapOf("body" to mapOf("message" to "Deleted url $id")))
        }

        post {
            val url = call.receive<com.example.models.UrlDTO>()

            val newUrl = dao.addNewUrl(url.long_url, url.code) ?: return@post call.respondText(
                "Error creating url",
                status = HttpStatusCode.InternalServerError
            )

            call.respond(mapOf("body" to mapOf("url" to newUrl )));
        }
    }
}
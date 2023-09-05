package com.example.routes

import com.example.dao.dao
import com.example.models.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.urlRoutes() {
    route("api/url") {
        get {
            val params = call.request.queryParameters;
            val code = params["code"]
            val longUrl = params["longUrl"]

            if (code != null && longUrl != null) {
                val url = dao.url(code, longUrl) ?: return@get call.respondText(
                    "No url with code $code and longUrl $longUrl",
                    status = HttpStatusCode.NotFound
                )
                call.respond(mapOf("body" to mapOf("url" to url)));
            }
            else if (code != null) {
                val url = dao.url_w_code(code) ?: return@get call.respondText(
                    "No url with code $code",
                    status = HttpStatusCode.NotFound
                )
                call.respond(mapOf("body" to mapOf("url" to url)));
            }
            else if (longUrl != null) {
                val url = dao.url_w_longurl(longUrl) ?: return@get call.respondText(
                    "No url with longUrl $longUrl",
                    status = HttpStatusCode.NotFound
                )
                call.respond(mapOf("body" to mapOf("url" to url)));
            } else {
                call.respond(mapOf("body" to mapOf("url" to dao.allUrls())));
            }
        }

        post {
            val url = call.receive<com.example.models.Url>()
            val newUrl = dao.addNewUrl(url.longUrl, url.code) ?: return@post call.respondText(
                "Error creating url",
                status = HttpStatusCode.InternalServerError
            )
            call.respond(mapOf("body" to mapOf("url" to url)));
        }
    }
}
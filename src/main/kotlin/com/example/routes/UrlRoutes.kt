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
            val long_url = params["long_url"]

            if (code != null && long_url != null) {
                val url = dao.url(code, long_url) ?: return@get call.respondText(
                    "No url with code $code and long_url $long_url",
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
            else if (long_url != null) {
                val url = dao.url_w_longurl(long_url) ?: return@get call.respondText(
                    "No url with long_url $long_url",
                    status = HttpStatusCode.NotFound
                )
                call.respond(mapOf("body" to mapOf("url" to url)));
            } else {
                call.respond(mapOf("body" to mapOf("url" to dao.allUrls())));
            }
        }

        post {
            val url = call.receive<com.example.models.Url>()
            val newUrl = dao.addNewUrl(url.long_url, url.code) ?: return@post call.respondText(
                "Error creating url",
                status = HttpStatusCode.InternalServerError
            )
            call.respond(mapOf("body" to mapOf("url" to url)));
        }
    }
}
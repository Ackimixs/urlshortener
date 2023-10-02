package com.example.plugins

import com.example.dao.dao
import com.example.routes.urlRoutes
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import io.ktor.server.response.*


fun Application.configureRouting() {
    routing {
        urlRoutes();
        route("/r/{code}") {
            get {
                val id = call.parameters["code"] ?: return@get call.respondRedirect("/?error=404", permanent = true);

                val url = dao.url_w_code(id) ?: return@get call.respondRedirect("/?error=404", permanent = true);

                call.respondRedirect(url.long_url, permanent = true)
            }
        }
        staticResources("/", "public") {
            default("index.html")
        }
    }
}

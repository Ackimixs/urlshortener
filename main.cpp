#include "crow_all.h"
#include <SQLiteCpp/SQLiteCpp.h>

int main()
{
    crow::SimpleApp app; // define your crow application

    app.loglevel(crow::LogLevel::DEBUG);

    try
    {
        // Open a database file in create/write mode
        SQLite::Database db("test.db3", SQLite::OPEN_READWRITE | SQLite::OPEN_CREATE);
        std::cout << "SQLite database file '" << db.getFilename().c_str() << "' opened successfully\n";

        SQLite::Statement query(db, "CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY, code TEXT, long_url TEXT)");
        query.exec();
        std::cout << "SQLite table 'urls' created successfully\n";
    }
    catch (std::exception &e)
    {
        std::cout << "SQLite exception: " << e.what() << std::endl;
        return EXIT_FAILURE; // unexpected error : exit the example program
    }

    // define your endpoint at the root directory
    CROW_ROUTE(app, "/")
    ([]()
     {
        auto page = crow::mustache::load_text("index.html");
        return page; });

    CROW_ROUTE(app, "/api/url").methods(crow::HTTPMethod::GET)([](const crow::request &req)
                                                               {
            auto param = req.url_params;
            auto code = param.get("code");
            auto long_url = param.get("long_url");

            CROW_LOG_DEBUG << "Code: " << code;
            CROW_LOG_DEBUG << "LongUrl: " << long_url;

            SQLite::Database db("test.db3", SQLite::OPEN_READWRITE|SQLite::OPEN_CREATE);

            if (code == nullptr && long_url == nullptr) {
                SQLite::Statement query(db, "SELECT * FROM urls");
                crow::json::wvalue x;
                int i = 0;
                while (query.executeStep()) {
                    x["body"]["url"][i]["id"] = query.getColumn(0).getString();
                    x["body"]["url"][i]["code"] = query.getColumn(1).getString();
                    x["body"]["url"][i]["long_url"] = query.getColumn(2).getString();
                    i++;
                }
                return crow::response(x);
            } else if (code == nullptr) {
                SQLite::Statement query(db, "SELECT * FROM urls WHERE long_url = ?");
                query.bind(1, long_url);
                crow::json::wvalue x;
                int i = 0;
                while (query.executeStep()) {
                    x["body"]["url"][i]["id"] = query.getColumn(0).getString();
                    x["body"]["url"][i]["code"] = query.getColumn(1).getString();
                    x["body"]["url"][i]["long_url"] = query.getColumn(2).getString();
                    i++;
                }
                return crow::response(x);
            } else if (long_url == nullptr) {
                SQLite::Statement query(db, "SELECT * FROM urls WHERE code = ?");
                query.bind(1, code);
                crow::json::wvalue x;
                int i = 0;
                while (query.executeStep()) {
                    x["body"]["url"][i]["id"] = query.getColumn(0).getString();
                    x["body"]["url"][i]["code"] = query.getColumn(1).getString();
                    x["body"]["url"][i]["long_url"] = query.getColumn(2).getString();
                    i++;
                }
                return crow::response(x);
            } else {
                SQLite::Statement query(db, "SELECT * FROM urls WHERE code = ? AND long_url = ?");
                query.bind(1, code);
                query.bind(2, long_url);
                crow::json::wvalue x;
                int i = 0;
                while (query.executeStep()) {
                    x["body"]["url"][i]["id"] = query.getColumn(0).getString();
                    x["body"]["url"][i]["code"] = query.getColumn(1).getString();
                    x["body"]["url"][i]["long_url"] = query.getColumn(2).getString();
                    i++;
                }
                return crow::response(x);
            } });

    CROW_ROUTE(app, "/api/url/<string>").methods(crow::HTTPMethod::GET)([](const std::string id)
                                                                    {
        SQLite::Database db("test.db3", SQLite::OPEN_READWRITE|SQLite::OPEN_CREATE);
        SQLite::Statement query(db, "SELECT * FROM urls WHERE id = ?");
        query.bind(1, id);

        if (query.executeStep()) {
            crow::json::wvalue x;
            x["body"]["url"]["id"] = query.getColumn(0).getString();
            x["body"]["url"]["code"] = query.getColumn(1).getString();
            x["body"]["url"]["long_url"] = query.getColumn(2).getString();
            return crow::response(x);
        }
        return crow::response(400); });

    CROW_ROUTE(app, "/api/url").methods(crow::HTTPMethod::POST)([](const crow::request &req)
                                                                {
            auto x = crow::json::load(req.body);
            if (!x)
                return crow::response(400);

            auto code = x["code"].s();
            auto long_url = x["long_url"].s();

            CROW_LOG_DEBUG << "Code: " << code;
            CROW_LOG_DEBUG << "LongUrl: " << long_url;

            if (code.size() == 0 || long_url.size() == 0)
                return crow::response(400);

            SQLite::Database db("test.db3", SQLite::OPEN_READWRITE|SQLite::OPEN_CREATE);
            SQLite::Statement query(db, "INSERT INTO urls (code, long_url) VALUES (?, ?) RETURNING *");
            query.bind(1, code);
            query.bind(2, long_url);
            while (query.executeStep()) {
                crow::json::wvalue y;
                y["body"]["url"]["id"] = query.getColumn(0).getString();
                y["body"]["url"]["code"] = query.getColumn(1).getString();
                y["body"]["url"]["long_url"] = query.getColumn(2).getString();
                return crow::response(y);
            }

            return crow::response(400); });

    CROW_ROUTE(app, "/r/<string>").methods(crow::HTTPMethod::GET)([](const std::string code)
                                                                  {
        SQLite::Database db("test.db3", SQLite::OPEN_READWRITE|SQLite::OPEN_CREATE);
        SQLite::Statement query(db, "SELECT * FROM urls WHERE code = ?");
        query.bind(1, code);

        if (!query.executeStep()) {
            crow::response res;
            res.redirect_perm("/");
            return res;
        } else {
            auto long_url = query.getColumn(1).getString();

            if (long_url.empty())
                return crow::response(404);

            crow::response res;
            res.redirect_perm(long_url);
            return res;
        } });

    CROW_ROUTE(app, "/api/url/<string>").methods(crow::HTTPMethod::DELETE)([](const std::string id)
                                                                           {
        SQLite::Database db("test.db3", SQLite::OPEN_READWRITE | SQLite::OPEN_CREATE);
        SQLite::Statement query(db, "DELETE FROM urls WHERE id = ?");
        query.bind(1, id);

        if (query.exec())
        {
            crow::json::wvalue x;
            x["body"]["message"] = "Deleted";
            return crow::response(x);
        }
        else
        {
            return crow::response(400);
        } });

    CROW_ROUTE(app, "/api/url/<string>").methods(crow::HTTPMethod::PUT)([](const crow::request &req, const std::string id) {

        auto x = crow::json::load(req.body);
        if (!x)
            return crow::response(400);

        std::stringstream q;

        q << "UPDATE urls SET";

        bool codeChange = false;
        if (x.has("code")) {
            auto code = x["code"].s();
            if (code.size() > 0) {
                CROW_LOG_DEBUG << "Code: " << code;
                q << " code = '" << code << "'";
                codeChange = true;
            }
        }

        if (x.has("long_url")) {
            auto long_url = x["long_url"].s();
            if (long_url.size() > 0) {
                CROW_LOG_DEBUG << "LongUrl: " << long_url;
                if (codeChange) {
                    q << ",";
                }
                q << " long_url = '" << long_url << "'";
            }
        }

        q << " WHERE id = ?" << " RETURNING *";

        SQLite::Database db("test.db3", SQLite::OPEN_READWRITE | SQLite::OPEN_CREATE);
        CROW_LOG_DEBUG << q.str();
        SQLite::Statement query(db, q.str());
        query.bind(1, id);
        while (query.executeStep()) {
            crow::json::wvalue y;
            y["body"]["url"]["id"] = query.getColumn(0).getString();
            y["body"]["url"]["code"] = query.getColumn(1).getString();
            y["body"]["url"]["long_url"] = query.getColumn(2).getString();
            return crow::response(y);
        }
        return crow::response(400); });

    CROW_ROUTE(app, "/api/url/<string>").methods(crow::HTTPMethod::PATCH)([](const crow::request &req, const std::string id) {

        auto x = crow::json::load(req.body);
        if (!x)
            return crow::response(400);

        std::stringstream q;

        q << "UPDATE urls SET";

        bool codeChange = false;
        if (x.has("code")) {
            auto code = x["code"].s();
            if (code.size() > 0) {
                CROW_LOG_DEBUG << "Code: " << code;
                q << " code = '" << code << "'";
                codeChange = true;
            }
        }

        if (x.has("long_url")) {
            auto long_url = x["long_url"].s();
            if (long_url.size() > 0) {
                CROW_LOG_DEBUG << "LongUrl: " << long_url;
                if (codeChange) {
                    q << ",";
                }
                q << " long_url = '" << long_url << "'";
            }
        }

        q << " WHERE id = ?" << " RETURNING *";

        SQLite::Database db("test.db3", SQLite::OPEN_READWRITE | SQLite::OPEN_CREATE);
        CROW_LOG_DEBUG << q.str();
        SQLite::Statement query(db, q.str());
        query.bind(1, id);
        while (query.executeStep()) {
            crow::json::wvalue y;
            y["body"]["url"]["id"] = query.getColumn(0).getString();
            y["body"]["url"]["code"] = query.getColumn(1).getString();
            y["body"]["url"]["long_url"] = query.getColumn(2).getString();
            return crow::response(y);
        }
        return crow::response(400); });

    // set the port, set the app to run on multiple threads, and run the app
    app.port(8000)
        .multithreaded()
        .run();
}

// TODO router like i did with express that can be funny
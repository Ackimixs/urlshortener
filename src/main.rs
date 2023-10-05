mod handler;
mod model;
mod response;

use model::{QueryOptions, DB};
use warp::{http::Method, Filter, Rejection};

type WebResult<T> = std::result::Result<T, Rejection>;

#[tokio::main]
async fn main() {
    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "api=info");
    }
    pretty_env_logger::init();

    let db = model::url_db();

    let url_router = warp::path!("api" / "url");
    let url_router_id = warp::path!("api" / "url" / String);

    let health_checker = warp::path!("api" / "health-checker")
        .and(warp::get())
        .and_then(handler::health_checker_handler);

    let redirect_routes = warp::path!("r" / String)
        .and(warp::get())
        .and(with_db(db.clone()))
        .and_then(handler::redirect_handler);

    let body = std::fs::read_to_string("./templates/index.html").unwrap();

    let home = warp::path::end().map(move || warp::reply::html(body.clone()));

    let cors = warp::cors()
        .allow_methods(&[Method::GET, Method::POST, Method::PATCH, Method::DELETE])
        .allow_origins(vec!["http://localhost:3000/", "http://localhost:8000/"])
        .allow_headers(vec!["content-type"])
        .allow_credentials(true);

    let url_routes = url_router
        .and(warp::post())
        .and(warp::body::json())
        .and(with_db(db.clone()))
        .and_then(handler::create_url_handler)
        .or(url_router
            .and(warp::get())
            .and(warp::query::<QueryOptions>())
            .and(with_db(db.clone()))
            .and_then(handler::urls_list_handler));

    let url_routes_id = url_router_id
        .and(warp::put())
        .and(warp::body::json())
        .and(with_db(db.clone()))
        .and_then(handler::edit_url_handler)
        .or(url_router_id
            .and(warp::get())
            .and(with_db(db.clone()))
            .and_then(handler::get_url_handler))
        .or(url_router_id
            .and(warp::delete())
            .and(with_db(db.clone()))
            .and_then(handler::delete_url_handler));

    let routes = url_routes
        .with(cors)
        .with(warp::log("api"))
        .or(url_routes_id)
        .or(health_checker)
        .or(home)
        .or(redirect_routes);

    println!("🚀 Server started successfully");
    warp::serve(routes).run(([0, 0, 0, 0], 8000)).await;
}

fn with_db(db: DB) -> impl Filter<Extract = (DB,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || db.clone())
}

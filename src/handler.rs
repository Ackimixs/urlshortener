use std::str::FromStr;
use crate::{
    model::{QueryOptions, UpdateUrlSchema, Url, DB},
    response::{GenericResponse, SingleUrlResponse, UrlListResponse},
    WebResult,
};
use uuid::Uuid;
use warp::{http::StatusCode, http::Uri, reply::json, reply::with_status, Reply};

pub async fn health_checker_handler() -> WebResult<impl Reply> {
    const MESSAGE: &str = "Build Simple CRUD API with Rust";

    let response_json = &GenericResponse {
        status: "success".to_string(),
        message: MESSAGE.to_string(),
    };
    Ok(json(response_json))
}

pub async fn urls_list_handler(opts: QueryOptions, db: DB) -> WebResult<impl Reply> {
    let urls = db.lock().await;

    let limit = opts.limit.unwrap_or(10);
    let offset = (opts.page.unwrap_or(1) - 1) * limit;

    let urls: Vec<Url> = urls.clone().into_iter().skip(offset).take(limit).collect();

    let json_response = UrlListResponse {
        body: [("url".to_string(), urls)].iter().cloned().collect(),
    };
    Ok(json(&json_response))
}

pub async fn create_url_handler(mut body: Url, db: DB) -> WebResult<impl Reply> {
    let mut vec = db.lock().await;

    for url in vec.iter() {
        if url.code == body.code {
            let error_response = GenericResponse {
                status: "fail".to_string(),
                message: format!("Url with title: '{}' already exists", url.code),
            };
            return Ok(with_status(json(&error_response), StatusCode::CONFLICT));
        }
    }

    let uuid_id = Uuid::new_v4();

    body.id = Some(uuid_id.to_string());

    let url = body.to_owned();

    vec.push(body);

    let json_response = SingleUrlResponse {
        body: [("url".to_string(), url)].iter().cloned().collect(),
    };

    Ok(with_status(json(&json_response), StatusCode::CREATED))
}

pub async fn get_url_handler(id: String, db: DB) -> WebResult<impl Reply> {
    let vec = db.lock().await;

    for url in vec.iter() {
        if url.id == Some(id.to_owned()) {
            let json_response = SingleUrlResponse {
                body: [("url".to_string(), url.to_owned())]
                    .iter()
                    .cloned()
                    .collect(),
            };

            return Ok(with_status(json(&json_response), StatusCode::OK));
        }
    }

    let error_response = GenericResponse {
        status: "fail".to_string(),
        message: format!("Url with ID: {} not found", id),
    };
    return Ok(with_status(json(&error_response), StatusCode::NOT_FOUND));
}

pub async fn edit_url_handler(id: String, body: UpdateUrlSchema, db: DB) -> WebResult<impl Reply> {
    let mut vec = db.lock().await;

    for url in vec.iter_mut() {
        if url.id == Some(id.clone()) {
            let code = body.code.to_owned().unwrap_or(url.code.to_owned());
            let long_url = body.long_url.to_owned().unwrap_or(url.long_url.to_owned());
            let payload = Url {
                id: url.id.to_owned(),
                code,
                long_url,
            };
            *url = payload;

            let json_response = SingleUrlResponse {
                body: [("url".to_string(), url.to_owned())]
                    .iter()
                    .cloned()
                    .collect(),
            };
            return Ok(with_status(json(&json_response), StatusCode::OK));
        }
    }

    let error_response = GenericResponse {
        status: "fail".to_string(),
        message: format!("Url with ID: {} not found", id),
    };

    Ok(with_status(json(&error_response), StatusCode::NOT_FOUND))
}

pub async fn delete_url_handler(id: String, db: DB) -> WebResult<impl Reply> {
    let mut vec = db.lock().await;

    for url in vec.iter_mut() {
        if url.id == Some(id.clone()) {
            vec.retain(|url| url.id != Some(id.to_owned()));
            return Ok(with_status(json(&""), StatusCode::NO_CONTENT));
        }
    }

    let error_response = GenericResponse {
        status: "fail".to_string(),
        message: format!("Url with ID: {} not found", id),
    };
    Ok(with_status(json(&error_response), StatusCode::NOT_FOUND))
}

pub async fn redirect_handler(code: String, db: DB) -> WebResult<impl Reply> {
    let vec = db.lock().await;

    for url in vec.iter() {
        if url.code == code.to_owned() {
            return Ok(warp::redirect::permanent(Uri::from_str(&url.long_url).unwrap()));
        }
    }

    return Ok(warp::redirect::permanent(Uri::from_str("http://localhost:8000/").unwrap()));
}

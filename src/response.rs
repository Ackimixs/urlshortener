use std::collections::HashMap;

use crate::model::Url;
use serde::Serialize;

#[derive(Serialize)]
pub struct GenericResponse {
    pub status: String,
    pub message: String,
}

#[derive(Serialize, Debug)]
pub struct SingleUrlResponse {
    pub body: HashMap<String, Url>,
}

#[derive(Serialize, Debug)]
pub struct UrlListResponse {
    pub body: HashMap<String, Vec<Url>>,
}

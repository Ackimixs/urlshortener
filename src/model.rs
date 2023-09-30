use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Url {
    pub id: Option<String>,
    pub code: String,
    pub long_url: String,
}

pub type DB = Arc<Mutex<Vec<Url>>>;

pub fn url_db() -> DB {
    Arc::new(Mutex::new(Vec::new()))
}

#[derive(Debug, Deserialize)]
pub struct QueryOptions {
    pub page: Option<usize>,
    pub limit: Option<usize>,
}

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct UpdateUrlSchema {
    pub code: Option<String>,
    pub long_url: Option<String>,
}

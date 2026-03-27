use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing::info;
use tracing_subscriber::EnvFilter;
use uuid::Uuid;

// --- DOMAIN MODELS ---
// These types are the single source of truth for the catalog domain.

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Product {
    pub id: Uuid,
    pub name: String,
    pub house: String,
    pub description: String,
    pub variants: Vec<Variant>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Variant {
    pub id: Uuid,
    pub size: String, // "5ml", "10ml", "50ml"
    pub format: VariantFormat,
    /// Price in Colombian Pesos (COP), stored as whole units (no decimals).
    pub price_cop: i64,
    /// Price in US Dollars (USD), stored as whole units (no decimals).
    pub price_usd: i64,
    pub stock: i32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum VariantFormat {
    Decant,
    FullBottle,
    SampleSet,
}

// --- APP STATE ---
// Shared application state holding the database connection pool.
struct AppState {
    db: PgPool,
}

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    // Load .env file if present (silently ignored if missing)
    dotenvy::dotenv().ok();

    // Initialize structured logging with RUST_LOG env filter
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    info!("Initializing Fur Eliza Catalog Service (Rust Core)...");

    // Connect to Postgres
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set — check your .env or environment variables");

    let pool = PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to Postgres — is the database running?");

    info!("Connected to Postgres");

    let state = Arc::new(AppState { db: pool });

    // CORS: allow all origins for development
    // TODO: restrict origins in production (e.g., only https://fureliza.com)
    let cors = CorsLayer::permissive();

    // Define routes
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/products", get(list_products))
        .route("/products/{id}", get(get_product))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    // Read port from env with default 8080
    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .expect("PORT must be a valid u16 number");

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    info!("Catalog Service listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind TCP listener — is the port already in use?");

    axum::serve(listener, app)
        .await
        .expect("Server exited unexpectedly");

    Ok(())
}

// --- HANDLERS ---

async fn health_check() -> impl IntoResponse {
    (StatusCode::OK, Json(serde_json::json!({ "status": "ok" })))
}

/// List all products (mock data until DB queries are wired).
async fn list_products(State(_state): State<Arc<AppState>>) -> impl IntoResponse {
    // TODO: replace with sqlx::query_as!(Product, "SELECT * FROM products").fetch_all(&state.db).await

    let mock_product = Product {
        id: Uuid::new_v4(),
        name: "Megamare".to_string(),
        house: "Orto Parisi".to_string(),
        description: "The sea at night.".to_string(),
        variants: vec![
            Variant {
                id: Uuid::new_v4(),
                size: "50ml".to_string(),
                format: VariantFormat::FullBottle,
                price_cop: 850_000,
                price_usd: 215,
                stock: 12,
            },
            Variant {
                id: Uuid::new_v4(),
                size: "10ml".to_string(),
                format: VariantFormat::Decant,
                price_cop: 180_000,
                price_usd: 45,
                stock: 45,
            },
        ],
    };

    (StatusCode::OK, Json(vec![mock_product]))
}

/// Get a single product by its UUID.
async fn get_product(
    State(_state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    // TODO: replace with sqlx::query_as!(Product, "SELECT * FROM products WHERE id = $1", id)
    //       .fetch_optional(&state.db).await

    let mock_product = Product {
        id,
        name: "Megamare".to_string(),
        house: "Orto Parisi".to_string(),
        description: "The sea at night.".to_string(),
        variants: vec![
            Variant {
                id: Uuid::new_v4(),
                size: "50ml".to_string(),
                format: VariantFormat::FullBottle,
                price_cop: 850_000,
                price_usd: 215,
                stock: 12,
            },
            Variant {
                id: Uuid::new_v4(),
                size: "10ml".to_string(),
                format: VariantFormat::Decant,
                price_cop: 180_000,
                price_usd: 45,
                stock: 45,
            },
        ],
    };

    (StatusCode::OK, Json(mock_product))
}

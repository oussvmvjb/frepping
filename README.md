# FREPPING - Full-Stack E-Commerce Platform

A production-ready e-commerce platform combining an Angular 16 3D streetwear web storefront with a scalable, asynchronous FastAPI backend.

---

## Backend Architecture Overview

The backend is built with **FastAPI**, **PostgreSQL** as the primary source of truth, **Redis** as a high-performance caching layer, **SQLAlchemy 2.x** with **asyncpg**, and **Alembic** for schema migrations.

```text
Request (HTTP / REST)
       ↓
API Router (/api/v1)
       ↓
Endpoint Layer (v1/endpoints)
       ↓
Service Layer (services/)
       ├── Redis Cache (Hit → Return Cached JSON)
       └── Repository Layer (Miss → db/repositories)
                 ↓
           SQLAlchemy ORM (2.x Async)
                 ↓
           PostgreSQL (Source of Truth)
```

### Core Entities (Phase 1)

1. **`categories`**: Product taxonomy and filtering (`slug`, `name`, `is_active`).
2. **`products`**: Main catalog entries (`price`, `compare_price`, `slug`, `material`, `is_featured`, `is_active`).
3. **`product_images`**: Ordered gallery images (`image_url`, `alt_text`, `sort_order`, `is_primary`).
4. **`product_variants`**: Size, color, SKU, and inventory tracking (`stock >= 0`, `sku`, `price`).

---

## Project Structure

```text
frepping/
├── app/
│   ├── api/
│   │   └── router.py                 # Master API router for v1
│   ├── core/
│   │   ├── config.py                 # Pydantic v2 Settings (.env loader)
│   │   └── exceptions.py             # Custom application exceptions & JSON handlers
│   ├── db/
│   │   ├── base.py                   # SQLAlchemy 2.0 DeclarativeBase
│   │   ├── session.py                # Async engine & sessionmaker (asyncpg)
│   │   ├── models/                   # SQLAlchemy declarative models
│   │   │   ├── category.py
│   │   │   ├── product.py
│   │   │   ├── product_image.py
│   │   │   └── product_variant.py
│   │   └── repositories/             # Data access layer
│   │       ├── category_repository.py
│   │       ├── product_repository.py
│   │       └── product_variant_repository.py
│   ├── services/                     # Business logic & cache orchestration
│   │   ├── category_service.py
│   │   ├── product_service.py
│   │   └── redis/
│   │       └── redis_client.py       # Reusable async Redis client with graceful fallback
│   ├── v1/
│   │   ├── endpoints/                # FastAPI route controllers
│   │   │   ├── health.py             # Health check & DB ping
│   │   │   ├── categories.py         # Category CRUD
│   │   │   └── products.py           # Product listing, filtering, CRUD
│   │   └── schemas/                  # Pydantic v2 request/response schemas
│   │       ├── category.py
│   │       ├── product.py
│   │       └── product_variant.py
│   └── main.py                       # FastAPI entrypoint, CORS, lifespan
│
├── alembic/
│   ├── versions/
│   │   └── 001_initial_tables.py     # Initial schema migration
│   └── env.py                        # Async Alembic runner
│
├── tests/
│   ├── test_health.py                # Health check and root tests
│   └── test_products.py              # Products and categories API tests
│
├── src/                              # Angular Frontend application
├── .env.example                      # Environment variables template
├── alembic.ini                       # Alembic configuration
├── requirements.txt                  # Python dependencies
└── README.md
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PROJECT_NAME` | Name of the service | `"FREPPING Backend"` |
| `API_V1_STR` | Base API prefix | `"/api/v1"` |
| `APP_ENV` | Environment mode (`development`/`production`) | `"development"` |
| `DEBUG` | Verbose logging and SQL query echo | `true` |
| `DATABASE_URL` | PostgreSQL asyncpg connection string | `postgresql+asyncpg://postgres:postgres@localhost:5432/frepping` |
| `REDIS_URL` | Redis cache connection string | `redis://localhost:6379/0` |
| `CORS_ORIGINS` | Allowed frontend origins (JSON or comma-separated) | `["http://localhost:4200"]` |
| `CACHE_TTL_PRODUCT_DETAIL` | TTL for single product cache (seconds) | `300` (5 minutes) |
| `CACHE_TTL_PRODUCT_LIST` | TTL for product list queries (seconds) | `120` (2 minutes) |
| `CACHE_TTL_CATEGORIES` | TTL for category list (seconds) | `600` (10 minutes) |

---

## Getting Started

### 1. Start PostgreSQL & Redis

Using Docker:

```bash
# Start PostgreSQL
docker run -d --name frepping-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=frepping \
  -p 5432:5432 postgres:16-alpine

# Start Redis
docker run -d --name frepping-redis \
  -p 6379:6379 redis:7-alpine
```

### 2. Create Python Virtual Environment & Install Dependencies

```bash
python -m venv .venv
```

Activate the virtual environment:
* **Windows (PowerShell):**
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
* **Linux / macOS:**
  ```bash
  source .venv/bin/activate
  ```

Install requirements:

```bash
pip install -r requirements.txt
```

### 3. Run Database Migrations

Apply database migrations using Alembic:

```bash
alembic upgrade head
```

### 4. Start the FastAPI Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will be available at `http://localhost:8000`.

---

## Interactive API Documentation

FastAPI automatically generates interactive documentation:

* **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **OpenAPI JSON:** [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json)

---

## API Endpoints Reference

### Health
* `GET /api/v1/health` — Checks API and database connectivity.

### Categories
* `GET /api/v1/categories` — List active categories (Cached in Redis).
* `GET /api/v1/categories/{category_id}` — Get category by UUID.
* `POST /api/v1/categories` — Create category (Invalidates category & product caches).
* `PATCH /api/v1/categories/{category_id}` — Partially update category.
* `DELETE /api/v1/categories/{category_id}` — Delete category.

### Products
* `GET /api/v1/products` — Paginated product catalog.
  * Query parameters:
    * `page` (default: 1)
    * `page_size` (default: 20, max: 100)
    * `category_id` (UUID filter)
    * `search` (searches title, description, material)
    * `is_featured` (`true`/`false`)
* `GET /api/v1/products/{product_id}` — Get product details including category, gallery images, and variants.
* `POST /api/v1/products` — Create product with nested images and variants.
* `PATCH /api/v1/products/{product_id}` — Update product attributes.
* `DELETE /api/v1/products/{product_id}` — Delete product (Cascades images and variants).

---

## Running Tests

Execute pytest suite:

```bash
pytest -v
```

---

## Frontend Integration (Angular)

To point your Angular frontend to this backend:
1. Ensure Angular runs at `http://localhost:4200` (whitelisted in `CORS_ORIGINS`).
2. Update Angular services to call `http://localhost:8000/api/v1/products` and `http://localhost:8000/api/v1/categories`.

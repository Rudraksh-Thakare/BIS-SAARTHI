# BIS-SAARTHI (SIH26107)

**BIS-SAARTHI** is an AI-powered, source-grounded assistant for discovering Indian Standards and navigating BIS services for industries and consumers, built for Smart India Hackathon problem statement **SIH26107**.

---

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons
- **Backend**: Flask (Python)
- **Database**: Supabase (PostgreSQL with `pgvector` extension)
- **Embeddings**: `sentence-transformers` (`all-MiniLM-L6-v2`) running locally
- **LLM**: Google Gemini API (model `gemini-1.5-flash` via Google AI Studio)

---

## Supabase Database Setup

Before running the application, configure your Supabase database. Open the **SQL Editor** in your Supabase Dashboard and execute the following SQL script:

```sql
-- 1. Enable the pgvector extension to store and search vector embeddings
create extension if not exists vector;

-- 2. Create the standards metadata table (for category browsing)
create table standards (
  id serial primary key,
  is_number text not null,
  title text not null,
  sector text not null,           -- 'electrical safety', 'packaged food', 'textiles'
  product_category text not null, -- e.g. 'Cables', 'Infant Nutrition'
  scope text not null,
  key_requirements text not null,
  applicability text not null,    -- 'Mandatory', 'Voluntary'
  document_type text not null,    -- 'Indian Standard'
  source_name text not null,      -- 'Bureau of Indian Standards'
  source_url text,
  last_verified_at text,
  embedding vector(384)           -- 384 dimensions for all-MiniLM-L6-v2
);

-- 3. Create the document chunks table (for granular RAG queries)
create table document_chunks (
  id serial primary key,
  is_number text,                 -- links to standard if applicable, else 'N/A'
  title text not null,            -- document title
  sector text not null,           -- 'electrical safety', 'packaged food', 'textiles', 'general'
  document_type text not null,    -- 'Standard', 'Certification Guide', 'Consumer Guide'
  section_name text,              -- e.g. 'Clause 4.1', 'Section 2: Fees'
  page_number text,               -- e.g. 'Page 5'
  content text not null,          -- actual text content chunk
  source_name text not null,
  source_url text,
  last_verified_at text,
  embedding vector(384)
);

-- 4. Create HNSW indexes for fast cosine distance similarity searches
create index on standards using hnsw (embedding vector_cosine_ops);
create index on document_chunks using hnsw (embedding vector_cosine_ops);

-- 5. Create RPC match function for standards
create or replace function match_standards (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id integer,
  is_number text,
  title text,
  sector text,
  product_category text,
  scope text,
  key_requirements text,
  applicability text,
  document_type text,
  source_name text,
  source_url text,
  last_verified_at text,
  similarity float
)
language sql stable
as $$
  select
    id,
    is_number,
    title,
    sector,
    product_category,
    scope,
    key_requirements,
    applicability,
    document_type,
    source_name,
    source_url,
    last_verified_at,
    1 - (standards.embedding <=> query_embedding) as similarity
  from standards
  where 1 - (standards.embedding <=> query_embedding) > match_threshold
  order by standards.embedding <=> query_embedding
  limit match_count;
$$;

-- 6. Create RPC match function for document chunks
create or replace function match_document_chunks (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id integer,
  is_number text,
  title text,
  sector text,
  document_type text,
  section_name text,
  page_number text,
  content text,
  source_name text,
  source_url text,
  last_verified_at text,
  similarity float
)
language sql stable
as $$
  select
    id,
    is_number,
    title,
    sector,
    document_type,
    section_name,
    page_number,
    content,
    source_name,
    source_url,
    last_verified_at,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
$$;
```

### Row Level Security (RLS) Configuration
If Row Level Security (RLS) is enabled in your Supabase project:
- Add a policy allowing **public read (SELECT)** on both `standards` and `document_chunks` tables.
- Add a policy allowing **authenticated/service_role write (INSERT/UPDATE)** permissions, as the data ingestion script requires write access.
- Alternatively, disable RLS for local testing:
  ```sql
  alter table standards disable row level security;
  alter table document_chunks disable row level security;
  ```

---

## Setup Instructions

### 1. Environment Variables Configuration
Create a `.env` file in the root directory based on `.env.example`:
- `SUPABASE_URL`: Your Supabase Project API URL.
- `SUPABASE_KEY`: Your Supabase **service_role** API key (needed to write vector embeddings).
- `GEMINI_API_KEY`: Your Google Gemini API Key from Google AI Studio (free).
- `GEMINI_MODEL`: The Gemini model to use (default: `gemini-1.5-flash`).
- `MATCH_THRESHOLD`: Minimum similarity score to qualify as supported (default: `0.5`).

### 2. Backend Setup, Seeding & Evaluation
1. Navigate to the `backend` directory.
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the database connection verification:
   ```bash
   python test_connection.py
   ```
4. Run the backend Flask server:
   ```bash
   python app.py
   ```
5. In another terminal, trigger the database seeder and vector generator:
   ```bash
   curl -X POST http://127.0.0.1:5000/api/seed-embeddings
   ```
6. Run the offline RAG pipeline evaluation suite (verifies 30 intent-classification and vector search test cases):
   ```bash
   python test_eval.py
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

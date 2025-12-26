# Data Model: Embedding Pipeline

## Document Content Entity
**Description**: Represents the extracted text from Docusaurus pages

**Fields**:
- `url` (string): Source URL of the document
- `title` (string): Page title extracted from HTML
- `content` (string): Clean text content extracted from the page
- `created_at` (datetime): Timestamp when content was extracted
- `html_structure` (string): Original HTML structure information

**Validation**:
- URL must be a valid HTTP/HTTPS address
- Content must not be empty
- Created_at must be current timestamp

## Text Chunk Entity
**Description**: Represents a chunk of text that will be converted to an embedding

**Fields**:
- `id` (string): Unique identifier for the chunk
- `document_url` (string): Reference to source document
- `content` (string): Text content of the chunk (max 512 tokens)
- `chunk_index` (integer): Position of chunk in original document
- `overlap_with_next` (string): Overlapping text with next chunk
- `metadata` (dict): Additional metadata for the chunk

**Validation**:
- Content length must be within token limits
- Chunk_index must be non-negative
- Document_url must reference valid document

## Embedding Vector Entity
**Description**: Represents the numerical vector representation of text content

**Fields**:
- `id` (string): Unique identifier matching the text chunk
- `vector` (list[float]): Numerical embedding vector from Cohere
- `chunk_id` (string): Reference to source text chunk
- `model_version` (string): Version of embedding model used
- `created_at` (datetime): Timestamp when embedding was generated

**Validation**:
- Vector must have consistent dimensions based on model
- Chunk_id must reference valid text chunk
- Model_version must be valid Cohere model identifier

## Qdrant Point Entity
**Description**: Represents a stored point in the Qdrant vector database

**Fields**:
- `point_id` (string): Unique identifier in Qdrant
- `vector` (list[float]): Embedding vector
- `payload` (dict): Metadata stored with the vector including:
  - `source_url` (string): Original document URL
  - `title` (string): Document title
  - `chunk_index` (integer): Position in original document
  - `content` (string): Original chunk text
  - `timestamp` (datetime): When stored

**Validation**:
- Vector dimensions must match collection schema
- Payload must contain required metadata fields
- Point_id must be unique within collection

## Processing Status Entity
**Description**: Tracks the state of each document through the pipeline

**Fields**:
- `document_url` (string): Reference to the document
- `status` (enum): Current status (extracted, chunked, embedded, stored, failed)
- `progress` (float): Progress percentage (0.0 to 1.0)
- `last_updated` (datetime): Timestamp of last status update
- `error_message` (string, optional): Error details if status is failed

**Validation**:
- Status must be one of the defined enum values
- Progress must be between 0.0 and 1.0
- Document_url must reference valid document
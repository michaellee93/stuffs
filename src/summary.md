# Summary of the data types and functionality

## Schemas
- Dynamically configurable 
    - Can re-order 
- Need version history (for viewing document version history and for audit purposes)
- Need support for text, select, multiselect, block (rich-text), blocks (list of rich text fields), data (uniquely idenfitied data from another table/source)
- Each change to field name or field type will trigger a schema migration for the latest version 
    - what happens to drafts??

## Content
- Version history 
- Rich text editing
# Backend Structure

The Express server will follow a layered architecture:

```text
Controller -> Service -> Repository
```

## Planned folders

- `src/config` environment and database setup
- `src/controllers` HTTP request handlers
- `src/middleware` auth, errors, and validation middleware
- `src/models` Mongoose schemas
- `src/repositories` database access layer
- `src/routes` REST API route definitions
- `src/seeds` demo data scripts
- `src/services` business logic
- `src/utils` shared helpers
- `src/validators` request validation rules

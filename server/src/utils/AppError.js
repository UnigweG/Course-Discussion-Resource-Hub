class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "AppError";
    this.status = status;
    // Operational errors are safe to surface to clients (e.g. validation,
    // not-found, unauthorized). Unexpected errors stay generic in prod.
    this.isOperational = true;
  }
}

export default AppError;

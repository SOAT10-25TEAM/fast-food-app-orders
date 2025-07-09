export class DatabaseError extends Error {
  constructor(message: string, public readonly originalError?: any) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class BusinessError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
    public readonly originalError?: any
  ) {
    super(message);
    this.name = "BusinessError";
  }
}

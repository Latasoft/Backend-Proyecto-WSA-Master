export class MessageError extends Error {
    constructor(message, statusCode = 400) {
      super(message);
      this.name = 'MessageError';
      this.statusCode = statusCode;
    }
  }
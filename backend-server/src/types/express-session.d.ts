import { Session } from 'express-session';

declare module 'express-session' {
  interface Session {
    userId: string;
  }
}

declare module 'express' {
  interface Request {
    session: Session & {
      userId: string;
    };
  }
}

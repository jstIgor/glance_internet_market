import { User } from 'prisma/__generated__';

declare module 'express-session' {
  interface Session {
    userId: string;
    user: {
      id: string;
      email: string;
      displayName: string;
      role: string;
      isVerified: boolean;
      picture?: string;
    };
  }
}

declare module 'express' {
  interface Request {
    session: Session & {
      userId: string;
    };
  }
}

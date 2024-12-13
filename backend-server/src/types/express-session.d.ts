<<<<<<< HEAD
import { User } from 'prisma/__generated__';
=======
import { Session } from 'express-session';
>>>>>>> f827a30 (feat;add google auth)

declare module 'express-session' {
  interface Session {
    userId: string;
<<<<<<< HEAD
    user: {
      id: string;
      email: string;
      displayName: string;
      role: string;
      isVerified: boolean;
      picture?: string;
    };
=======
>>>>>>> f827a30 (feat;add google auth)
  }
}

declare module 'express' {
  interface Request {
    session: Session & {
      userId: string;
    };
  }
}

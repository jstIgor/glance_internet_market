import { User } from 'prisma/__generated__';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
} 
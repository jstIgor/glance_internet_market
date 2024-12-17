-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verificationToken" TEXT,
ALTER COLUMN "picture" SET DEFAULT 'no-avatar.png',
ALTER COLUMN "method" SET DEFAULT 'CREDENTIALS';

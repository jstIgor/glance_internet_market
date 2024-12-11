import { SetMetadata } from "@nestjs/common";
import { Role } from "prisma/__generated__";

export const Roles = (...roles: Role[]) => SetMetadata(process.env.ROLES_KEY, roles)
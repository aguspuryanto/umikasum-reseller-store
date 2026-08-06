import { User as PrismaUser } from '@/app/generated/prisma/client';

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    }

    interface User extends PrismaUser { }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
    }
}
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // You can add custom logic here
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                // Allow access if user has token (logged in)
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/products/:path*",
        "/api/upload/:path*",
    ],
};
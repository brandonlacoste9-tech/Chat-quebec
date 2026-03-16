import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/((?!login|check-email|api/auth|_next|api/webhook|favicon.ico).*)"],
};

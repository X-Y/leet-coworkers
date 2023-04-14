import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return (
          profile?.email_verified &&
          (profile.email?.endsWith("@1337.tech") as any)
        );
      }
      return;
    },
  },
};

export default NextAuth(authOptions);

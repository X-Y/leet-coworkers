import NextAuth from "next-auth";
import type { GoogleProfile } from "next-auth/providers/google";

declare module "next-auth" {
  interface Profile extends GoogleProfile {}
}

import NextAuth from "next-auth";
import { authOptions } from "~/server/auth";

secret:process.env.SECRET

export default NextAuth(authOptions);

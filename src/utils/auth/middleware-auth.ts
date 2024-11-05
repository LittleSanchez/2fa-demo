import NextAuth from "next-auth";

export const {
  auth: middlewareAuth,
} = NextAuth({
  providers: []
})

import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/utils/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectToDB();
          const user = await User.findOne({ email }).select('+password +role'); 
          if (!user) {
            return null;
          }else if (user.status === 'Inactive') {
            return null;
          }
      
          const passwordsMatch = await bcrypt.compare(password, user.password);
      
          if (!passwordsMatch) {
            return null;
          }
      
          return Promise.resolve(user);
        } catch (error) {
          console.error('Error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

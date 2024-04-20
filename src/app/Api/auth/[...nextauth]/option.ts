import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

import UserModel from "@/models/User";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(Credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: Credentials.identifier },
              { username: Credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("no user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("please verify your account before login");
          }
           const isPasswordCorrect= await bcrypt.compare(Credentials.password, user.password);
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("incorrect password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks:{

    async jwt({ token, user }) {

      if(user){
        token._id=user._id?.toString()
        token.isVerified=user.isVerified;
        token.isAcceptingMessages;
        token.usename=user.username
      }
      return token
      
    },

    async session({ session,token }) {
      if(token){
        session.user._id=token._id
        session.user.isVerified=token.isVerified
        session.user.isAcceptingMessages=token.isAcceptingMessages
        session.user.username=token.username
      }
      return session
    }
  

  },
  pages:{
    signIn:'/sign-in'

  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET,
};

import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import axios from "axios";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "Enter your email",
        },
      },
      //@ts-ignore
      async authorize(credentials: {
        email: string;
        password: string;
        csrf: string;
      }) {
        try {
          const data = {
            email: credentials.email,
          };
          const res = await axios.post(
            "https://backend.yerradarwin.workers.dev/auth/v1/user/signIn",
            data
          );
          console.log("asdasdad", res);
          console.log("response token", res.data.token);
          return res.data;
        } catch (error) {
          throw new Error(
            "Signin failed. Please check your email and try again."
          );
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ user, token }: any) => {
      if (user) {
        token.jwtToken = user.token;
      }
      return token;
    },
    session: ({ session, token }: any) => {
      session.jwtToken = token.jwtToken;
      console.log("session", session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};

export default authOptions;

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { username, password } = credentials ?? {};

        console.log(username, password);
        if (username === "admin" && password === "1234") {
          return {
            id: "1",
            name: "admin",
            email: "admin@example.com",
            image: "",
          };
        }
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };

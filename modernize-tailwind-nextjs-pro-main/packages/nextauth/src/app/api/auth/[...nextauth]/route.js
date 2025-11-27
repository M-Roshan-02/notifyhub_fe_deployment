import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

const authOptions = {
  debug: true, // <--- Added export here
  site: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        // Add your own authentication logic here
        if (credentials?.email === 'demo1234@gmail.com' && credentials?.password === 'demo1234') {
          // Return user object if credentials are valid
          // For now, let's assume a static token for demonstration purposes.
          // In a real application, this would come from your backend after successful login.
          const user = { id: '1', name: 'Demo', email: 'demo1234@gmail.com', token: 'dummy_token_123' }; // Added a dummy token
          return Promise.resolve(user);
        } else {
          // Return null if credentials are invalid
          return Promise.resolve(null);
        }
      },
    }),
  ],
  callbacks: { // <--- Added callbacks
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token; // Assuming the user object has a token property from authorize
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Expose the accessToken in the session object
      return session;
    },
  },
};

const handler = NextAuth(authOptions); // <--- Used authOptions here
export { handler as GET, handler as POST };


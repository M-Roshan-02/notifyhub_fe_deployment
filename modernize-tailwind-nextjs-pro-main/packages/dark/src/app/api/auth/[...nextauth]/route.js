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
        accessToken: { label: 'Access Token', type: 'text' }, // Added to receive token from frontend
      },
      authorize: async (credentials) => {
        // Add your own authentication logic here
        if (credentials?.email && credentials?.password && credentials.accessToken) {
            // In our case, the accessToken is already verified by the REST API /o/token/
            // and provided by the frontend. We just need to simulate a user session.
            // In a real scenario, you might validate the accessToken here with your backend.
            const user = {
                id: '1', // A dummy ID
                name: 'Authenticated User',
                email: credentials.email,
                accessToken: credentials.accessToken,
            };
            return Promise.resolve(user);
        }
        // Original logic for demo credentials
        if (credentials?.email === 'demo1234@gmail.com' && credentials?.password === 'demo1234') {
          const user = { id: '1', name: 'Demo', email: 'demo1234@gmail.com', token: 'dummy_token_123' };
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken; // Use the accessToken from the user object
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Expose the accessToken in the session object
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

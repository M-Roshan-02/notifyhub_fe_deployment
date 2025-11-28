import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'; // Import setContext

const httpLink = createHttpLink({
  uri: 'https://notifyhub-sandbox-1028525309597.us-central1.run.app/graphql/',
});

// Create an authLink that adds the authorization header to requests
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('access_token'); // Retrieve token from localStorage

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink), // Chain the authLink with the httpLink
  cache: new InMemoryCache(),
});

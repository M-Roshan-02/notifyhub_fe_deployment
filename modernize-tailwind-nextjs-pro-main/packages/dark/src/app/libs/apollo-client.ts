import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://notifyhub-sandbox-1028525309597.us-central1.run.app/graphql/',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwt_token');
  return {
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink), 
  cache: new InMemoryCache(),
});

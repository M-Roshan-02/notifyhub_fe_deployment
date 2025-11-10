import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'https://notifyhub-sandbox-1028525309597.us-central1.run.app/graphql/',
});

export const client = new ApolloClient({
  link: httpLink, 
  cache: new InMemoryCache(),
});

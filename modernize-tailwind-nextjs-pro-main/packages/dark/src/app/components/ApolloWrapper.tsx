"use client";

import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { useSession } from "next-auth/react";
import { ReactNode, useMemo } from "react";

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  console.log("session", session);

  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: 'https://notifyhub-sandbox-1028525309597.us-central1.run.app/graphql/',
    });

    const authLink = setContext((_, { headers }) => {
      // Get the authentication token from the session
      const token = session?.accessToken;

      // Return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [session]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

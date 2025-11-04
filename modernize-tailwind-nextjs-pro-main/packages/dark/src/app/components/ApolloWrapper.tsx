// 'use client'; is needed if this component is used in a Next.js App Router context.
"use client";

import { ApolloProvider } from "@apollo/client/react";
import { client } from "@/app/libs/apollo-client";
import { ReactNode } from "react";

// 2. Define the Wrapper Component.
/**

 * @param {object} props 
 * @param {ReactNode} props.children 
 * @returns {JSX.Element}
 */
export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

// src/lib/hygraph.ts
import { GraphQLClient } from "graphql-request";

const endpoint = process.env.HYGRAPH_ENDPOINT;

// DEBUG (temporaneo): vedi cosa arriva davvero
// console.log("HYGRAPH_ENDPOINT =", JSON.stringify(endpoint));

if (!endpoint || !endpoint.startsWith("http")) {
  throw new Error(
    `HYGRAPH_ENDPOINT non valida: ${
      endpoint === undefined ? "undefined" : endpoint
    }`
  );
}

// Client Hygraph da usare SOLO lato server
export const hygraph = new GraphQLClient(endpoint);

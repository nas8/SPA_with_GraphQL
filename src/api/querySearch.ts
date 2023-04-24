import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GITHUB_GRAPHQL_ENDPOINT, headers } from './queryData';

export const githubApiSearch = createApi({
  reducerPath: 'githubApiSearch',
  baseQuery: fetchBaseQuery({
    baseUrl: GITHUB_GRAPHQL_ENDPOINT,
  }),
  endpoints: (builder) => ({
    searchRepo: builder.query({
      query: ({ searchValue }) => ({
        url: GITHUB_GRAPHQL_ENDPOINT,
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          query: `
          query($searchQuery: String!) {
            search(query: $searchQuery, type: REPOSITORY, first: 100) {
              edges {
                node {
                  ... on Repository {
                    name
                    description
                    url
                    stargazerCount
                    pushedAt
                    owner {
                      login
                    }
                  }
                }
              }
            }
          }
          `,
          variables: {
            searchQuery: searchValue,
          },
        }),
      }),
      transformResponse: ({ data }) => {
        const transformData = data.search.edges.map((item: any) => item.node);

        return [...transformData];
      },
    }),
  }),
});

export const { useSearchRepoQuery, useLazySearchRepoQuery } = githubApiSearch;

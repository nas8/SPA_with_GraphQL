import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GITHUB_GRAPHQL_ENDPOINT, headers } from './queryData';

export const githubApiRepo = createApi({
  reducerPath: 'githubApiRepo',
  baseQuery: fetchBaseQuery({
    baseUrl: GITHUB_GRAPHQL_ENDPOINT,
  }),
  endpoints: (builder) => ({
    getRepo: builder.query({
      query: ({ owner, name }) => ({
        url: GITHUB_GRAPHQL_ENDPOINT,
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          query: `
          query($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
              name
              stargazers {
                totalCount
              }
              pushedAt
              owner {
                avatarUrl
                login
                url
              }
              languages(first: 10) {
                edges {
                  node {
                    name
                  }
                }
              }
              description
            }
          },
          `,
          variables: {
            owner: owner,
            name: name,
          },
        }),
      }),
      transformResponse: ({ data }) => {
        const transformResponse = {
          name: data.repository.name,
          stargazerCount: data.repository.stargazers.totalCount,
          pushedAt: data.repository.pushedAt,
          owner: data.repository.owner,
          languages: data.repository.languages.edges,
          description: data.repository.description,
        };
        return transformResponse;
      },
    }),
  }),
});

export const { useGetRepoQuery, useLazyGetRepoQuery } = githubApiRepo;

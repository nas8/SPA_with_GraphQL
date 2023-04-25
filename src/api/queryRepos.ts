import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GITHUB_GRAPHQL_ENDPOINT, headers } from './queryData';

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({
    baseUrl: GITHUB_GRAPHQL_ENDPOINT,
  }),
  endpoints: (builder) => ({
    getRepositories: builder.query({
      query: () => ({
        url: GITHUB_GRAPHQL_ENDPOINT,
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          query: `
          query{
            viewer {
              repositories(first: 100) {
                totalCount
                nodes {
                  name
                  stargazerCount
                  pushedAt
                  url
                  owner {
                    login
                  }
                }
              }
            }
          },
          `,
        }),
      }),
      transformResponse: ({ data }) => {
        const transformResponse = {
          nodes: data.viewer.repositories.nodes,
          pageInfo: data.viewer.repositories.pageInfo,
          totalCount: data.viewer.repositories.totalCount,
        };
        return transformResponse;
      },
    }),
  }),
});

export const { useGetRepositoriesQuery, useLazyGetRepositoriesQuery } = githubApi;

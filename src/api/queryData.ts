export const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

export const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}`,
};

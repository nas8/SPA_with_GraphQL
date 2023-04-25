export const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

export const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};

export const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

console.log(process.env);

export const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};

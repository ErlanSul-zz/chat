export const isExistsQuery = (query: string): string =>
  `SELECT EXISTS(${query}) AS "exists"`;

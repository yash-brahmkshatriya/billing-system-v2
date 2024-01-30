module.exports = {
  projects: {
    app: {
      schema: ['./server/graphql/schemas/*.graphql'],
      documents: ['**/*.{graphql,js,ts,jsx,tsx}'],
    },
  },
};

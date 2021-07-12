const mocks = {
  Query: () => ({
    getApplicationById: () => ({
      manifestData: () => ({
        interpretedIconURL: (_a, _b, _c, context) => {
          if (context.variableValues.applicationId === 'slack') {
            return 'https://cdn.filestackcontent.com/dWQT0dr1R9KvXSOsSH6h'
          }
          return null;
        },
        theme_color: (_a, _b, _c, context) => {
          if (context.variableValues.applicationId === 'slack') {
            return '#42C299';
          }
          return null;
        },
      })
    }),
  }),
};

export default mocks;

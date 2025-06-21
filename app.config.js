export default ({ config }) => {
  return {
    ...config,
    name: "ProdutosApp",
    slug: "ProdutosApp",
    version: "1.0.0",
    android: {
      ...config.android,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
  };
};

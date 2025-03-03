module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(gltf)$/,
      use: {
        loader: 'file-loader',
      },
    });
    return config;
  },
  // Add this if you're using standalone mode
  output: 'standalone',
}
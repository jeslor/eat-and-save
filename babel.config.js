module.exports = function (api) {
  api.cache.using(() => process.env.BABEL_ENV ?? process.env.NODE_ENV ?? 'development');

  const sharedPlugins = [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
        },
      },
    ],
  ];

  if (api.env('test')) {
    return {
      presets: ['babel-preset-expo'],
      plugins: sharedPlugins,
    };
  }

  return {
    presets: ['babel-preset-expo', 'nativewind/babel'],
    plugins: sharedPlugins,
  };
};

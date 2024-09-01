/** @type {import('next').NextConfig} */
const nextConfig = {webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true, // Enable WebAssembly support
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async", // Specify the module type for WebAssembly files
    });

    return config;
  },
};

export default nextConfig;

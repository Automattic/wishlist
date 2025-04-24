import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	devIndicators: false,
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: '*',
			},
			{
				protocol: 'https',
				hostname: '*',
			},
		],
	},
	serverExternalPackages: [
		'@anush008/tokenizers',
		'@anush008/tokenizers-darwin-universal',
		'sqlite-vec',
		'fastembed',
		'onnxruntime-node',
	],
	outputFileTracingExcludes: {
		'api/**': [
			'node_modules/fastembed/node_modules/onnxruntime-node/bin/napi-v3/darwin/**/*',
			'node_modules/fastembed/node_modules/onnxruntime-node/bin/napi-v3/linux/arm64/**/*',
			'node_modules/fastembed/node_modules/onnxruntime-node/bin/napi-v3/linux/x64/libonnxruntime_providers_cuda.so',
			'node_modules/fastembed/node_modules/onnxruntime-node/bin/napi-v3/win32/**/*',
		],
	},
	outputFileTracingIncludes: {
		'api/**': [
			'local_cache/**/*',
		],
	},
};

export default nextConfig;

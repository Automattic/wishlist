import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.gravatar.com',
			},
		],
	},
	serverExternalPackages: [
		'@anush008/tokenizers',
		'@anush008/tokenizers-darwin-universal',
		'sqlite-vec',
	],
};

export default nextConfig;

import { env } from "utils/env";

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: env.NEXT_PUBLIC_PROTOCOL,
				hostname: `api.${env.NEXT_PUBLIC_DOMAIN}`,
			},
		],
	},
};

export default nextConfig;

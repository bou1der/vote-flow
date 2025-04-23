import path from "path";
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin";

/** @type {import('webpack').Configuration } */
export default {
	target: "node",
	entry: path.resolve(import.meta.dirname, "src", "app", "index.ts"),
	mode: process.env.NODE_ENV || "development",
	watchOptions: {
		ignored: ["**/dist/**", "**/node_modules/**", "packages/**"],
		poll: 1000,
	},
	output: {
		path: path.resolve(import.meta.dirname, "dist"),
		clean: true,
	},
	resolve: {
		fallback: {
			bun: false,
		},
		plugins: [
			new TsConfigPathsPlugin({
				configFile: path.resolve(import.meta.dirname, "tsconfig.json"),
			}),
		],
		extensions: [".tsx", ".ts", ".js"],
		alias: {
			"~": path.resolve(import.meta.dirname, "src/*"),
		},
	},
	externals: {
		sharp: "commonjs sharp",
		bun: false,
	},
	module: {
		rules: [
			{
				use: "ts-loader",
				exclude: path.resolve(import.meta.dirname, "../", "../", "node_modules"),
			},
		],
	},
};

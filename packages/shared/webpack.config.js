import path from "path";
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin";

/** @type {import('webpack').Configuration & import('webpack-dev-server').Configuration} */
export default {
	target: "node",
	entry: path.resolve(import.meta.dirname, "src", "index.ts"),
	mode: process.env.NODE_ENV || "development",
	output: {
		path: path.resolve(import.meta.dirname, "dist"),
		clean: true,
	},
	resolve: {
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

import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json'



export default [
		{
				input: 'src/cli/index.ts',
				output: {
						file: 'bin/cli/index.cjs.js',
						format: 'cjs',
						sourcemap: true
				},
				plugins: [
						json(),
						typescript({ sourceMap: true }),
						resolve({
								preferBuiltins: false,
						}),
						commonjs(),

				],
				external: ["path"],
		}
		// {
		// 		input: 'src/vue-core/index.ts',
		// 		output: {
		// 				file: 'bin/core/index.cjs.js',
		// 				format: 'cjs',
		// 				sourcemap: true
		// 		},
		// 		plugins: [
		// 				json(),
		// 				typescript({ sourceMap: true }),
		// 				resolve({
		// 						preferBuiltins: true,
		// 				}),
		// 				commonjs(),
		//
		// 		]
		// },
]
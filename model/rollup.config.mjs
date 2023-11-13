import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const external = Object.keys(packageJson.dependencies);

const ts = typescript({
	useTsconfigDeclarationDir: true
});

export default [
	{
		input: './src/index.ts',
		plugins: [
			typescript({
				useTsconfigDeclarationDir: true
			})
		],
		cache: false,
		external,
		output: [
			{
				file: './lib/cjs/index.cjs',
				format: 'cjs'
			},
			{
				file: './lib/esm/index.js',
				format: 'es'
			}
		]
	},
	{
		input: './build/index.d.ts',
		output: [
			{
				file: './lib/index.d.ts',
				format: 'es'
			}
		],
		plugins: [dts()],
	},
	{
		input: './src/index.ts',
		plugins: [
			nodeResolve({
				browser: true,
			}),
			ts
		],
		output: [
			{
				file: './dist/index.umd.js',
				format: 'umd',
				name: 'sequentialWorkflowEditorModel'
			}
		]
	}
];

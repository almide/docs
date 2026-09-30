// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import astroMermaid from 'astro-mermaid';
import { rehypeMermaidNoTranslate } from './src/plugins/rehype-mermaid-notranslate.mjs';
import fs from 'node:fs';

const almideGrammar = JSON.parse(fs.readFileSync(new URL('./src/almide.tmLanguage.json', import.meta.url), 'utf-8'));
const almideLang = { ...almideGrammar, id: 'almide', aliases: ['almd'] };

export default defineConfig({
	site: 'https://almide.github.io',
	base: '/docs',
	markdown: {
		shikiConfig: {
			langs: [almideLang],
		},
		// Runs after astro-mermaid has produced `<pre class="mermaid">`.
		rehypePlugins: [rehypeMermaidNoTranslate],
	},
	integrations: [
		astroMermaid(),
		starlight({
			expressiveCode: {
				themes: ['tokyo-night', 'github-light'],
				frames: false,
				shiki: {
					langs: [almideLang],
				},
			},
			title: 'Almide',
			favicon: '/favicon.svg',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/almide/almide' },
			],
			pagefind: false,
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				Head: './src/components/Head.astro',
			},
			customCss: ['./src/styles/custom.css'],
			editLink: {
				baseUrl: 'https://github.com/almide/almide/edit/develop/docs-site/',
			},
			head: [
				// Open Graph reads `property` and wants an absolute URL.
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://almide.github.io/docs/og.png' } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				// Browsers without SVG favicons, and iOS home screens.
				{ tag: 'link', attrs: { rel: 'icon', href: '/docs/favicon.ico', sizes: '32x32' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/docs/apple-touch-icon.png' } },
				// `--sl-font-mono` already asks for JetBrains Mono but nothing loaded it,
				// so every code block fell back to the platform default — and to a
				// different face than the playground iframe, which does load it.
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap',
					},
				},
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Hello World', slug: 'getting-started/hello-world' },
					],
				},
				{
					label: 'Language Guide',
					items: [
						{ label: 'Types & Values', slug: 'guide/types' },
						{ label: 'Variables', slug: 'guide/variables' },
						{ label: 'Functions', slug: 'guide/functions' },
						{ label: 'Control Flow', slug: 'guide/control-flow' },
						{ label: 'Pattern Matching', slug: 'guide/pattern-matching' },
						{ label: 'Error Handling', slug: 'guide/error-handling' },
						{ label: 'Modules & Imports', slug: 'guide/modules' },
						{ label: 'Generics', slug: 'guide/generics' },
						{ label: 'Protocols', slug: 'guide/protocols' },
						{ label: 'Concurrency', slug: 'guide/concurrency' },
						{ label: 'Numeric Types', slug: 'guide/numeric-types' },
						{ label: 'Testing', slug: 'guide/testing' },
						{ label: 'Packages', slug: 'guide/packages' },
						{ label: 'WebAssembly', slug: 'guide/wasm' },
					],
				},
				{
					label: 'Standard Library',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'stdlib/overview' },
						{ label: 'string', slug: 'stdlib/string' },
						{ label: 'list', slug: 'stdlib/list' },
						{ label: 'map', slug: 'stdlib/map' },
						{ label: 'set', slug: 'stdlib/set' },
						{ label: 'int', slug: 'stdlib/int' },
						{ label: 'float', slug: 'stdlib/float' },
						{ label: 'math', slug: 'stdlib/math' },
						{ label: 'option', slug: 'stdlib/option' },
						{ label: 'result', slug: 'stdlib/result' },
						{ label: 'error', slug: 'stdlib/error' },
						{ label: 'value', slug: 'stdlib/value' },
						{ label: 'json', slug: 'stdlib/json' },
						{ label: 'bytes', slug: 'stdlib/bytes' },
						{ label: 'matrix', slug: 'stdlib/matrix' },
						{ label: 'io', slug: 'stdlib/io' },
						{ label: 'fs', slug: 'stdlib/fs' },
						{ label: 'process', slug: 'stdlib/process' },
						{ label: 'env', slug: 'stdlib/env' },
						{ label: 'http', slug: 'stdlib/http' },
						{ label: 'regex', slug: 'stdlib/regex' },
						{ label: 'datetime', slug: 'stdlib/datetime' },
						{ label: 'random', slug: 'stdlib/random' },
						{ label: 'testing', slug: 'stdlib/testing' },
						{ label: 'path', slug: 'stdlib/path' },
						{ label: 'args', slug: 'stdlib/args' },
						{ label: 'base64 / hex', slug: 'stdlib/base64-hex' },
					],
				},
				{
					label: 'Reference',
					collapsed: true,
					items: [
						{ label: 'Grammar (EBNF)', slug: 'reference/grammar' },
						{ label: 'Operator Precedence', slug: 'reference/operators' },
						{ label: 'CLI Usage', slug: 'reference/cli' },
						{ label: 'Cheatsheet', slug: 'reference/cheatsheet' },
					],
				},
				{
					label: 'Design',
					collapsed: true,
					items: [
						{ label: 'Philosophy', slug: 'design/philosophy' },
						{ label: 'Architecture', slug: 'design/architecture' },
					],
				},
			],
		}),
	],
});

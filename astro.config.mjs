// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import astroMermaid from 'astro-mermaid';
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
	},
	integrations: [
		astroMermaid(),
		starlight({
			expressiveCode: {
				shiki: {
					langs: [almideLang],
				},
			},
			title: 'Almide',
			logo: {
				src: './src/assets/almide-logo-sm.svg',
				replacesTitle: false,
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/almide/almide' },
			],
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				Head: './src/components/Head.astro',
			},
			customCss: ['./src/styles/custom.css'],
			editLink: {
				baseUrl: 'https://github.com/almide/almide/edit/develop/docs-site/',
			},
			head: [
				{
					tag: 'meta',
					attrs: { name: 'og:image', content: '/docs/og.png' },
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
						{ label: 'int', slug: 'stdlib/int' },
						{ label: 'float', slug: 'stdlib/float' },
						{ label: 'option', slug: 'stdlib/option' },
						{ label: 'result', slug: 'stdlib/result' },
						{ label: 'math', slug: 'stdlib/math' },
						{ label: 'json', slug: 'stdlib/json' },
						{ label: 'io', slug: 'stdlib/io' },
						{ label: 'fs', slug: 'stdlib/fs' },
						{ label: 'regex', slug: 'stdlib/regex' },
						{ label: 'datetime', slug: 'stdlib/datetime' },
						{ label: 'set', slug: 'stdlib/set' },
						{ label: 'crypto', slug: 'stdlib/crypto' },
						{ label: 'http', slug: 'stdlib/http' },
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

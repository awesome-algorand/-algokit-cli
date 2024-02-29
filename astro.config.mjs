import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	base: '/npm-algokit-cli',
	integrations: [
		starlight({
			title: '@algokit/cli',
			social: {
				github: 'https://github.com/awesome-algorand/npm-algokit-cli',
			},
			editLink: {
				baseUrl: 'https://github.com/awesome-algorand/npm-algokit-cli/edit/docs/',
			},
			sidebar: [
				{
					label: "Back to main docs",
					link: process.env.NODE_ENV === 'production' ? "https://awesome-algorand.github.io/guides/example/" : "http://localhost:4321/guides/example/",
				},
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', link: '/guides/example/' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});

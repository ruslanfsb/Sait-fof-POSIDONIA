import { resolve } from 'node:path';
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import * as buildRenderer from './src/render/page.ts';

type Renderer = typeof buildRenderer;
const RENDER_MODULE = '/src/render/page.ts';

/**
 * Pre-renders the pages from `src/content/site.ts` into the HTML templates,
 * so the shipped HTML contains all text (fast first paint, SEO) and no
 * client-side framework is needed.
 */
function staticRender(): Plugin {
  let server: ViteDevServer | undefined;
  const load = async (): Promise<Renderer> =>
    server ? ((await server.ssrLoadModule(RENDER_MODULE)) as Renderer) : buildRenderer;

  return {
    name: 'posidonia:static-render',
    configureServer(devServer) {
      server = devServer;
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        return (await load()).renderDocument(html);
      },
    },
    handleHotUpdate({ file, server: devServer }) {
      if (/\/src\/(content|render|shared)\//.test(file)) {
        devServer.ws.send({ type: 'full-reload' });
        return [];
      }
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRenderer.robotsTxt() });
      const sitemap = buildRenderer.sitemapXml();
      if (sitemap) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
    },
  };
}

export default defineConfig({
  // Relative base: the build works from a domain root, a sub-folder or GitHub Pages.
  base: './',
  plugins: [staticRender()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
      },
    },
  },
});

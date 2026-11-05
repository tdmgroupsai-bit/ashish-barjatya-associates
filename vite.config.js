import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Ad landing pages live as plain HTML in public/<route>/index.html. Production hosts serve
// them as folders, but the dev and preview servers would hand /ads1 to the React app instead.
const AD_ROUTES = ['ads1', 'ads2']

function adRoutes() {
  const serve = (root) => (req, res, next) => {
    const route = req.url.split('?')[0].replace(/^\/|\/$/g, '')
    if (!AD_ROUTES.includes(route)) return next()
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(fs.readFileSync(path.join(root, route, 'index.html')))
  }
  return {
    name: 'ad-routes',
    configureServer: (server) => { server.middlewares.use(serve(server.config.publicDir)) },
    configurePreviewServer: (server) => { server.middlewares.use(serve(path.resolve(server.config.root, server.config.build.outDir))) },
  }
}

export default defineConfig({
  plugins: [adRoutes(), react()],
  base: '/',
})

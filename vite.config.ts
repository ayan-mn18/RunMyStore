import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
// AgenticOrg does not allow cross-origin browser calls, so the dev and preview servers forward /api/v1 to it (see src/agent.ts).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const agenticorg: ProxyOptions = { target: env.VITE_AGENTICORG_BASE_URL || 'https://app.agenticorg.ai', changeOrigin: true, secure: true, configure: proxy => proxy.on('proxyReq', req => { req.removeHeader('origin'); req.removeHeader('referer'); }) };
  const proxy = { '/api/v1': agenticorg };
  return { plugins: [react()], server: { port: 5174, strictPort: true, proxy }, preview: { proxy }, build: { target: 'es2022' } };
});

import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
// A file:// entry is a safer alternative to a listening development server.
// Keep the normal production build on BrowserRouter; use hashes in this artifact.
const localPaths=text=>text.replaceAll('/assets/','./public/assets/').replaceAll('/reference-base.css','./public/reference-base.css').replaceAll('/reference-v2.css','./public/reference-v2.css');
const output=await build({
 entryPoints:[path.join(root,'src/main.tsx')],bundle:true,write:false,outdir:path.join(root,'.open-demo-build'),format:'iife',platform:'browser',target:'es2022',jsx:'automatic',minify:true,external:['./public/assets/*'],define:{'process.env.NODE_ENV':'"production"','import.meta.env':'{}'},
 plugins:[{name:'local-file-demo',setup(builder){
  builder.onResolve({filter:/\?raw$/},args=>({path:path.resolve(args.resolveDir,args.path.replace(/\?raw$/,'')),namespace:'raw-local'}));
  builder.onLoad({filter:/.*/,namespace:'raw-local'},async args=>({contents:localPaths(await fs.readFile(args.path,'utf8')),loader:'text'}));
  builder.onLoad({filter:/\.(tsx?|css)$/},async args=>{if(!args.path.startsWith(path.join(root,'src')))return;let source=localPaths(await fs.readFile(args.path,'utf8'));if(args.path.endsWith('main.tsx'))source=source.replace('{BrowserRouter,Routes','{HashRouter as BrowserRouter,Routes');return{contents:source,loader:args.path.endsWith('.css')?'css':args.path.endsWith('.tsx')?'tsx':'ts'};});
 }}]
});
const css=output.outputFiles.find(f=>f.path.endsWith('.css')).text;
const js=output.outputFiles.find(f=>f.path.endsWith('.js')).text;
await fs.writeFile(path.join(root,'open-demo.html'),`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#0d0b09"><title>RunMyStore — Interactive demo</title><link rel="icon" href="./public/favicon.svg"><style>${css}</style></head><body><div id="root"></div><script>${js.replaceAll('</script','<\\/script')}</script></body></html>`);
console.log('Created open-demo.html. Open it directly in a browser; keep the public folder alongside it.');

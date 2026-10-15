const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const { execFileSync } = require('child_process');
const root = __dirname;

async function build() {
  // Bundle dependencies directly into the downloadable preview: no CDN requests.
  await esbuild.build({ entryPoints: [path.join(root, 'entry.jsx')], bundle: true,
    outfile: path.join(root, 'bundle.js'), minify: true, format: 'iife',
    platform: 'browser', target: ['es2020'], define: { 'process.env.NODE_ENV': '"production"' } });
  execFileSync(process.execPath, [path.join(root, '../node_modules/@tailwindcss/cli/dist/index.mjs'),
    '-i', path.join(root, 'input.css'), '-o', path.join(root, 'portfolio.css'), '--minify'], { cwd: root, stdio: 'inherit' });
  let html = fs.readFileSync(path.join(root, 'template.html'), 'utf8');
  const start = html.indexOf('<section id="services"');
  const end = html.indexOf('<section id="approach"');
  if (start < 0 || end < 0) throw new Error('Services section markers missing');
  html = html.slice(0, start) + '<div id="services"><div id="portfolio-root"></div></div>' + html.slice(end);
  // Replace the old capability-strip handlers with direct category navigation.
  html = html.replace(/document\.querySelectorAll\('\.capability'\)\.forEach\(\(button,i\)=>button\.addEventListener\('click',\(\)=>openService\(\[1,0,2,3\]\[i\],button\)\)\);/,
    `document.querySelectorAll('.capability').forEach((button,i)=>button.addEventListener('click',()=>{window.dispatchEvent(new CustomEvent('signta:category',{detail:['automation','website','integration','creative'][i]}));document.querySelector('#services').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}));`);
  html = html.replace('First-look demo', 'Interactive demo').replace('Private demo · Initial visual direction', 'Private demo · Interactive portfolio');
  const image = fs.readFileSync(path.join(root, '../assets/mascot.png')).toString('base64');
  html = html.replace('__MASCOT__', 'data:image/png;base64,' + image);
  // Put legacy styles in a layer so Tailwind utilities win inside the React island.
  html = html.replace('<style>', '<style>@layer theme, legacy, utilities; @layer legacy {').replace('</style>', '}</style>');
  html = html.replace('</head>', () => '<style>' + fs.readFileSync(path.join(root, 'portfolio.css'), 'utf8') + '</style></head>');
  const bundle = fs.readFileSync(path.join(root, 'bundle.js'), 'utf8').replace(/<\/script/gi, '<\\/script');
  html = html.replace('</body>', () => '<script>' + bundle + '</script></body>');
  fs.writeFileSync(path.join(root, '../index.html'), html);
  console.log('Built self-contained Signta preview with React, Tailwind, and Framer Motion.');
}
build().catch(error => { console.error(error); process.exit(1); });

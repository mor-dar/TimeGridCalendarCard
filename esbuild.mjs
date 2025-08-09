import esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

/** @type {esbuild.BuildOptions} */
const base = {
  entryPoints: ['src/time-grid-calendar-card.ts'],
  outfile: 'dist/time-grid-calendar-card.js',
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['es2020'],
  sourcemap: false,
  logLevel: 'info',
  external: ['@fullcalendar/core/index.css', '@fullcalendar/timegrid/index.css'],
};

if (watch) {
  const ctx = await esbuild.context(base);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await esbuild.build(base);
}
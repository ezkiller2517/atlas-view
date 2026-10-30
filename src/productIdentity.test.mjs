import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('installable-app metadata identifies Atlas while package self-reference stays compatible', async () => {
  const pkg = JSON.parse(read('../package.json'));
  const manifest = JSON.parse(read('../public/manifest.webmanifest'));
  const html = read('../index.html');
  const logo = read('../public/logo.svg');
  assert.equal(pkg.name, 'gods-eye-view');
  assert.equal(manifest.name, 'Atlas View');
  assert.equal(manifest.short_name, 'Atlas');
  assert.match(html, /<title>Atlas View<\/title>/);
  assert.match(html, /apple-mobile-web-app-title" content="Atlas"/);
  assert.match(logo, /<title id="logo-title">Atlas View<\/title>/);
  assert.equal(typeof (await import('gods-eye-view/application')).createApplication, 'function');
});

test('visible runtime templates and development launch messages identify Atlas', () => {
  for (const path of ['./ui/templates/hud-loading.html', './ui/templates/scene-chrome.html']) {
    assert.match(read(path), /ATLAS <span class="title-accent">VIEW<\/span>/);
    assert.doesNotMatch(read(path), /GOD'S EYE VIEW/);
  }
  for (const path of ['../scripts/dev-fresh.sh', '../scripts/dev-secure.sh']) {
    assert.match(read(path), /Starting[^\n]*Atlas View dev server/);
    assert.doesNotMatch(read(path), /Starting[^\n]*God's Eye View dev server/);
  }
});

test('user-facing mic copy says ATLAS MIC in first run, docs, and every locale', () => {
  for (const path of [
    './ui/templates/welcome.html',
    '../.env.example',
    '../README.md',
    '../TESTING.md',
    '../docs/CURRENT-STATE.md',
    '../scripts/dev-fresh.sh',
  ]) {
    assert.match(read(path), /ATLAS MIC/, path);
    assert.doesNotMatch(read(path), /GEV MIC/, path);
  }
  const localeDir = new URL('./i18n/locales/', import.meta.url);
  for (const file of readdirSync(localeDir).filter((name) => name.endsWith('.json'))) {
    const catalog = JSON.parse(read(`./i18n/locales/${file}`));
    const key = 'Tip: the ATLAS MIC button in the dock lets you talk to the map.';
    assert.match(catalog[key], /ATLAS MIC/, file);
    assert.equal(catalog['Tip: the GEV MIC button in the dock lets you talk to the map.'], undefined, file);
  }
});

test('safe runtime metadata uses Atlas without renaming compatibility identifiers', () => {
  assert.match(read('../server/mcp/server.js'), /name: 'gods-eye-view'/);
  assert.match(read('./app/globePanelRuntime.js'), /name: 'gods-eye-view'/);
  assert.match(read('./app/globePanelRuntime.js'), /title: 'Atlas View'/);
  assert.match(read('../scripts/setup-doctor.mjs'), /Atlas View setup doctor/);
  assert.match(read('../server/providers/openai/instructions.js'), /called Atlas View/);
  assert.match(read('../server/providers/openai/toolDescriptions.js'), /Atlas View camera/);
  assert.match(read('./i18n/locale.js'), /gev:locale:v1/);
  assert.match(read('../docs/TOOLS.md'), /show_in_gods_eye_view/);
  assert.match(read('../docs/TOOLS.md'), /ui:\/\/gods-eye-view\/globe/);
  assert.match(read('../docs/CURRENT-STATE.md'), /`GEV_[A-Z_]+/);
});

test('README identifies the Pinokio listing as upstream and preserves attribution', () => {
  const readme = read('../README.md');
  assert.match(readme, /^# 🌐 Atlas View$/m);
  assert.match(readme, /God's Eye View by \[Bilawal Sidhu\]/);
  assert.match(readme, /MIT License/);
  assert.match(readme, /upstream God's Eye View in Pinokio/);
  assert.doesNotMatch(readme, /\[Atlas View in Pinokio\]/);
});

test('README does not claim upstream ownership or a Halfpixel roadmap for Atlas', () => {
  const readme = read('../README.md');
  assert.doesNotMatch(readme, /canonical live 3D client/);
  assert.doesNotMatch(readme, /^\*\*Maintainers:\*\*/m);
  assert.doesNotMatch(readme, /I'm grateful|we originally planned|we're building an official hosted/i);
  assert.doesNotMatch(readme, /hosted version is coming/i);
});

test('README quick starts clone and enter Atlas View rather than upstream', () => {
  const readme = read('../README.md');
  assert.equal(
    [...readme.matchAll(/^git clone https:\/\/github\.com\/ezkiller2517\/atlas-view\.git$/gm)]
      .length,
    3,
  );
  assert.equal([...readme.matchAll(/^cd atlas-view$/gm)].length, 3);
  assert.doesNotMatch(readme, /^git clone https:\/\/github\.com\/bilawalsidhu\/gods-eye-view\.git$/m);
  assert.doesNotMatch(readme, /^cd gods-eye-view$/m);
});

test('visible voice identity and fallback errors say Atlas while compatibility tags remain GEV', () => {
  const control = read('./voice/control.js');
  const realtimeTurns = read('./voice/realtimeTurns.js');
  const geminiSession = read('./voice/geminiSession.js');
  assert.match(control, /const ASSISTANT_NAME = 'Atlas';/);
  assert.doesNotMatch(control, /const ASSISTANT_NAME = 'GEV';/);
  assert.match(realtimeTurns, /Atlas voice is not connected/);
  assert.match(realtimeTurns, /Atlas command failed/);
  assert.doesNotMatch(realtimeTurns, /GEV voice is not connected|GEV command failed/);
  assert.match(geminiSession, /Atlas command failed/);
  assert.doesNotMatch(geminiSession, /GEV command failed/);
  assert.match(realtimeTurns, /\[GEV Realtime\]/);
});

test('maintenance and bundled-model provenance distinguish Atlas from upstream', () => {
  const contributing = read('../CONTRIBUTING.md');
  const models = read('../public/models/README.md');
  assert.match(contributing, /Atlas View branch is separate from the upstream God's Eye View project/);
  assert.doesNotMatch(contributing, /Atlas View is maintained by/);
  assert.match(models, /optimized for God's Eye View/);
  assert.match(models, /Atlas View redistributes these assets/);
});

test('package documentation and stable network identity retain gods-eye-view compatibility', () => {
  assert.match(read('../docs/CODE-BOUNDARIES.md'), /Package imports use `gods-eye-view`/);
  assert.match(read('../docs/APPLICATION.md'), /gods-eye-view\/application/);
  assert.match(read('../docs/CURRENT-STATE.md'), /stable\n`gods-eye-view\/…` User-Agent is unchanged/);
  assert.match(read('../docs/MCP_SETUP.md'), /claude mcp add gods-eye-view/);
  assert.match(read('../docs/TOOLS.md'), /claude mcp add gods-eye-view/);
});
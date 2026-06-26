const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const scripts = [];
const re = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let m;
const vm = require('vm');
while ((m = re.exec(html))) {
  scripts.push(m[1]);
}
if (!scripts.length) {
  console.error('no scripts');
  process.exit(1);
}
for (let i = 0; i < scripts.length; i++) {
  try {
    new vm.Script(scripts[i], { filename: 'script-' + i });
  } catch (e) {
    console.error('SYNTAX ERROR in script', i, e.message);
    process.exit(1);
  }
}
console.log('ok', scripts.length, 'scripts');

const fs = require('fs');
const content = fs.readFileSync('public/IntiLogo.svg', 'utf8');
const matches = content.match(/rgb\(\d+,\d+,\d+\)/g);
const counts = {};
if (matches) {
  matches.forEach(m => {
    counts[m] = (counts[m] || 0) + 1;
  });
}
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log(JSON.stringify(sorted.slice(0, 10), null, 2));

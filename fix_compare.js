const fs = require('fs');
let c = fs.readFileSync('d:/Downloads/BAO GIA/app/app.js', 'utf8');
let lines = c.split('\n');

// Lines 367-444 (1-indexed) are orphaned G4 template code
// We need to remove them - that's index 366 to 443
lines.splice(366, 78); // Remove 78 lines starting at index 366

fs.writeFileSync('d:/Downloads/BAO GIA/app/app.js', lines.join('\n'));
console.log('Removed orphaned lines. New line count:', lines.length);

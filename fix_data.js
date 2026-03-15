const fs = require('fs');

let fileContent = fs.readFileSync('d:/Downloads/BAO GIA/app/data.js', 'utf8');
const objCode = fileContent.replace('let PRICING_DATA = ', 'return ').replace(/;\s*$/, '');

const func = new Function(objCode);
const PRICING_DATA = func();

// Add Effective Date
PRICING_DATA.effectiveDate = "15/03/2026";

// Fix <=X tiers
['g1', 'g2', 'g3'].forEach(pkg => {
  ['vung1', 'vung2'].forEach(region => {
    if (PRICING_DATA[pkg] && PRICING_DATA[pkg][region]) {
       const regData = PRICING_DATA[pkg][region];
       
       if (regData.weightTiers[0].startsWith('<=')) {
          regData.weightTiers.shift();
          regData.routes.forEach(route => {
             route.prices.shift();
          });
       }
    }
  });
});

const newContent = `// NPV Logistics - Pricing Data\nlet PRICING_DATA = ${JSON.stringify(PRICING_DATA, null, 2)};\n`;
fs.writeFileSync('d:/Downloads/BAO GIA/app/data.js', newContent);
console.log('Fixed data.js successfully.');

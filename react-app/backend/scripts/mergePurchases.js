// mergePurchases.js
const fs = require('fs');
const path = require('path');

const purchasesPath = path.join(__dirname, '../data/purchases.json');

function mergePurchases(purchases) {
  const merged = {};
  for (const p of purchases) {
    const symbol = (p.symbol || '').toUpperCase();
    if (!merged[symbol]) {
      merged[symbol] = { ...p, symbol, quantity: 0, avgPrice: 0, totalCost: 0 };
    }
    // Sum quantities and total cost for avgPrice calculation
    merged[symbol].quantity += p.quantity;
    merged[symbol].totalCost += (p.avgPrice * p.quantity);
    // Keep the most recent lastUpdated and purchaseDate
    if (!merged[symbol].lastUpdated || new Date(p.lastUpdated) > new Date(merged[symbol].lastUpdated)) {
      merged[symbol].lastUpdated = p.lastUpdated;
    }
    if (!merged[symbol].purchaseDate || new Date(p.purchaseDate) > new Date(merged[symbol].purchaseDate)) {
      merged[symbol].purchaseDate = p.purchaseDate;
    }
    // Optionally, keep the latest id
    merged[symbol].id = p.id;
  }
  // Calculate avgPrice for each symbol
  for (const symbol in merged) {
    if (merged[symbol].quantity > 0) {
      merged[symbol].avgPrice = merged[symbol].totalCost / merged[symbol].quantity;
    }
    delete merged[symbol].totalCost;
  }
  return Object.values(merged);
}

function main() {
  const purchases = JSON.parse(fs.readFileSync(purchasesPath, 'utf8'));
  const merged = mergePurchases(purchases);
  fs.writeFileSync(purchasesPath, JSON.stringify(merged, null, 2));
  console.log('✅ purchases.json has been cleaned and merged.');
}

main(); 
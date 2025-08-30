import fs from 'fs';
import { ingestCsvContent } from '../lib/admin';

async function main() {
  const csvPath = process.argv[2] || 'data/wrogn_tshirts_min.csv';
  
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }
  
  const csv = fs.readFileSync(csvPath, 'utf-8');
  const count = await ingestCsvContent(csv, true);
  console.log(`Ingested products. Total count: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
#!/usr/bin/env ts-node
/**
 * FMR Data Import Script
 * 
 * This script imports Fair Market Rent data from a CSV file into Supabase.
 * 
 * Expected CSV format:
 * zip_code,county,state,beds_0,beds_1,beds_2,beds_3,beds_4,year
 * 
 * Usage:
 * npx ts-node scripts/import-fmr.ts <path-to-csv>
 */

import fs from 'fs';
import { parse } from 'csv-parse';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Get CSV file path from command line
const csvPath = process.argv[2];

if (!csvPath) {
  console.error('Please provide a path to the CSV file.');
  console.error('Usage: npx ts-node scripts/import-fmr.ts <path-to-csv>');
  process.exit(1);
}

interface FMRData {
  zip_code: string;
  county: string;
  state: string;
  beds_0: number;
  beds_1: number;
  beds_2: number;
  beds_3: number;
  beds_4: number;
  year: number;
}

async function importFMRData() {
  const records: FMRData[] = [];
  
  // Read CSV file
  const parser = fs
    .createReadStream(csvPath)
    .pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
      })
    );

  // Parse CSV records
  for await (const record of parser) {
    records.push({
      zip_code: record.zip_code,
      county: record.county,
      state: record.state,
      beds_0: parseFloat(record.beds_0),
      beds_1: parseFloat(record.beds_1),
      beds_2: parseFloat(record.beds_2),
      beds_3: parseFloat(record.beds_3),
      beds_4: parseFloat(record.beds_4),
      year: parseInt(record.year),
    });
  }

  console.log(`Parsed ${records.length} records from CSV.`);

  // Import records in batches
  const batchSize = 100;
  const batches = [];
  
  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }

  console.log(`Importing data in ${batches.length} batches...`);

  let successCount = 0;
  let errorCount = 0;

  for (const [index, batch] of batches.entries()) {
    try {
      const { error } = await supabase.from('fmr_data').upsert(batch, {
        onConflict: 'zip_code,year',
      });

      if (error) {
        console.error(`Error in batch ${index + 1}:`, error);
        errorCount += batch.length;
      } else {
        console.log(`Successfully imported batch ${index + 1} (${batch.length} records)`);
        successCount += batch.length;
      }
    } catch (error) {
      console.error(`Error in batch ${index + 1}:`, error);
      errorCount += batch.length;
    }
  }

  console.log(`Import completed.`);
  console.log(`Successfully imported: ${successCount} records`);
  console.log(`Failed to import: ${errorCount} records`);
}

importFMRData().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
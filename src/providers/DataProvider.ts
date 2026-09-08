/**
 * ============================================================================
 * DATA PROVIDER — INTEGRATION POINT FOR GOVERNMENT DATA PARTNERSHIPS
 * ============================================================================
 * This file defines the DataProvider interface for accessing medicine data.
 * 
 * CURRENT IMPLEMENTATION: SeedDataProvider
 * Reads from a local SQLite database seeded with representative Indian
 * medicine data. This is suitable for development and demonstration.
 *
 * FUTURE INTEGRATION POINTS:
 * 1. CDSCO (Central Drugs Standard Control Organisation)
 *    - Drug registration and approval status
 *    - Recall notifications and safety alerts
 *    - Replace: getRecallsByBatchId(), verifyBatch()
 *
 * 2. NPPA (National Pharmaceutical Pricing Authority)
 *    - Drug Price Control Order (DPCO) ceiling prices
 *    - Price notifications and updates
 *    - Replace: getMedicineById() pricing fields, getCeilingPrice()
 *
 * 3. PMBJP (Pradhan Mantri Bhartiya Janaushadhi Pariyojana)
 *    - Jan Aushadhi generic medicine catalog
 *    - Store locator for nearest Jan Aushadhi Kendra
 *    - Replace: getGenericAlternatives()
 *
 * To integrate a real data source, implement the DataProvider interface
 * with your API client and register it in server/src/index.ts.
 * ============================================================================
 */

import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq, like, or } from 'drizzle-orm';

export interface Medicine {
  id: number;
  brand_name: string;
  generic_name: string;
  manufacturer: string;
  dosage_form: string;
  strength: string;
  mrp: number;
  nppa_ceiling_price: number | null;
  category: string;
}

export interface Batch {
  id: number;
  medicine_id: number;
  batch_number: string;
  mfg_date: string;
  expiry_date: string;
  verification_status: string;
}

export interface Recall {
  id: number;
  batch_id: number;
  reason: string;
  alert_date: string;
  severity: string;
}

export interface GenericAlternative {
  id: number;
  medicine_id: number;
  alternative_medicine_id: number;
  price_difference_pct: number;
  alternative_medicine?: Medicine;
}

export interface TrustScoreResult {
  score: number;
  breakdown: any;
}

export interface DataProvider {
  getMedicineById(id: number): Promise<Medicine | null>;
  getMedicineByBatchNumber(batchNumber: string): Promise<{medicine: Medicine, batch: Batch} | null>;
  getGenericAlternatives(medicineId: number): Promise<GenericAlternative[]>;
  getRecallsByBatchId(batchId: number): Promise<Recall[]>;
  getTrustScore(batchId: number): Promise<TrustScoreResult>;
  searchMedicines(query: string): Promise<Medicine[]>;
  getAllMedicines(): Promise<Medicine[]>;
}

export class SeedDataProvider implements DataProvider {
  async getMedicineById(id: number): Promise<Medicine | null> {
    const results = await db.select().from(schema.medicines).where(eq(schema.medicines.id, id));
    return results[0] || null;
  }

  async getMedicineByBatchNumber(batchNumber: string): Promise<{medicine: Medicine, batch: Batch} | null> {
    const batches = await db.select().from(schema.batches).where(eq(schema.batches.batch_number, batchNumber));
    if (batches.length === 0) return null;
    const batch = batches[0];
    const med = await this.getMedicineById(batch.medicine_id);
    if (!med) return null;
    return { medicine: med, batch };
  }

  async getGenericAlternatives(medicineId: number): Promise<GenericAlternative[]> {
    const alts = await db.select().from(schema.generic_alternatives).where(eq(schema.generic_alternatives.medicine_id, medicineId));
    const results: GenericAlternative[] = [];
    for (const alt of alts) {
      const altMed = await this.getMedicineById(alt.alternative_medicine_id);
      if (altMed) {
        results.push({ ...alt, alternative_medicine: altMed });
      }
    }
    return results;
  }

  async getRecallsByBatchId(batchId: number): Promise<Recall[]> {
    return await db.select().from(schema.recalls).where(eq(schema.recalls.batch_id, batchId));
  }

  async getTrustScore(batchId: number): Promise<TrustScoreResult> {
    let score = 20; // Base score
    const breakdown: Record<string, number> = { base_score: 20 };

    const batches = await db.select().from(schema.batches).where(eq(schema.batches.id, batchId));
    if (batches.length === 0) return { score: 0, breakdown: { not_found: 0 } };
    const batch = batches[0];

    // Verification Status
    if (batch.verification_status === 'genuine') {
      score += 40;
      breakdown.verification_status = 40;
    } else if (batch.verification_status === 'inconclusive') {
      score += 20;
      breakdown.verification_status = 20;
    } else {
      breakdown.verification_status = 0;
    }

    // Expiry Date
    const expiry = new Date(batch.expiry_date);
    const now = new Date();
    const daysToExpiry = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (daysToExpiry > 30) {
      score += 20;
      breakdown.expiry = 20;
    } else if (daysToExpiry > 0) {
      score += 10;
      breakdown.expiry = 10;
    } else {
      breakdown.expiry = 0;
    }

    // Recalls
    const recalls = await this.getRecallsByBatchId(batchId);
    if (recalls.length > 0) {
      const penalty = recalls.length * 30;
      score -= penalty;
      breakdown.recalls = -penalty;
    }

    // Manufacturer
    const med = await this.getMedicineById(batch.medicine_id);
    if (med) {
      const known = ['Cipla', 'Sun Pharma', 'GSK', 'Abbott', 'Lupin', "Dr. Reddy's", 'Mankind', 'Zydus', 'Torrent', 'Glenmark', 'Alkem', 'Micro Labs', 'Sanofi', 'Pfizer', 'J&J'];
      if (known.includes(med.manufacturer)) {
        score += 20;
        breakdown.manufacturer = 20;
      }
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      breakdown
    };
  }

  async searchMedicines(query: string): Promise<Medicine[]> {
    return await db.select().from(schema.medicines).where(
      or(
        like(schema.medicines.brand_name, '%' + query + '%'),
        like(schema.medicines.generic_name, '%' + query + '%')
      )
    );
  }

  async findMedicineByName(name: string): Promise<Medicine | null> {
    if (!name) return null;
    
    let normalized = name.toLowerCase().trim();
    // Remove common suffixes
    const suffixes = ['mg', 'tab', 'tablet', 'cap', 'capsule'];
    for (const suffix of suffixes) {
      if (normalized.endsWith(' ' + suffix)) {
        normalized = normalized.substring(0, normalized.length - suffix.length - 1).trim();
      } else if (normalized.endsWith(suffix)) {
        normalized = normalized.substring(0, normalized.length - suffix.length).trim();
      }
    }

    if (normalized.length === 0) return null;

    const allMeds = await this.getAllMedicines();
    
    // First try exact brand_name match (case-insensitive)
    for (const med of allMeds) {
      if (med.brand_name.toLowerCase().trim() === normalized) {
        return med;
      }
    }
    
    // Then try LIKE '%name%' on brand_name using DB query
    const brandMatches = await db.select().from(schema.medicines).where(
      like(schema.medicines.brand_name, '%' + normalized + '%')
    );
    if (brandMatches.length > 0) return brandMatches[0];

    // Then try LIKE '%name%' on generic_name using DB query
    const genericMatches = await db.select().from(schema.medicines).where(
      like(schema.medicines.generic_name, '%' + normalized + '%')
    );
    if (genericMatches.length > 0) return genericMatches[0];

    return null;
  }

  async getAllMedicines(): Promise<Medicine[]> {
    return await db.select().from(schema.medicines);
  }
}

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
    getMedicineByBatchNumber(batchNumber: string): Promise<{
        medicine: Medicine;
        batch: Batch;
    } | null>;
    getGenericAlternatives(medicineId: number): Promise<GenericAlternative[]>;
    getRecallsByBatchId(batchId: number): Promise<Recall[]>;
    getTrustScore(batchId: number): Promise<TrustScoreResult>;
    searchMedicines(query: string): Promise<Medicine[]>;
    getAllMedicines(): Promise<Medicine[]>;
}
export declare class SeedDataProvider implements DataProvider {
    getMedicineById(id: number): Promise<Medicine | null>;
    getMedicineByBatchNumber(batchNumber: string): Promise<{
        medicine: Medicine;
        batch: Batch;
    } | null>;
    getGenericAlternatives(medicineId: number): Promise<GenericAlternative[]>;
    getRecallsByBatchId(batchId: number): Promise<Recall[]>;
    getTrustScore(batchId: number): Promise<TrustScoreResult>;
    searchMedicines(query: string): Promise<Medicine[]>;
    findMedicineByName(name: string): Promise<Medicine | null>;
    getAllMedicines(): Promise<Medicine[]>;
}

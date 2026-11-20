export interface ExtractedMedicineInfo {
    medicine_name: string | null;
    generic_name: string | null;
    manufacturer: string | null;
    batch_number: string | null;
    expiry_date: string | null;
    mrp: number | null;
    strength: string | null;
    confidence: number;
}
export interface AIVerificationResult {
    is_brand_real: boolean;
    brand_exists_in_india: boolean;
    cdsco_manufacturer_status: string;
    manufacturer_verified: boolean;
    typical_price_range: {
        min: number;
        max: number;
    } | null;
    is_price_reasonable: boolean;
    jan_aushadhi_alternative: {
        name: string;
        generic_name: string;
        approximate_price: number;
        manufacturer: string;
    } | null;
    genuineness_rating: 'genuine' | 'likely_genuine' | 'suspicious' | 'unknown';
    genuineness_score: number;
    verification_notes: string[];
    drug_category: string | null;
    prescription_required: boolean;
}
export interface ImageScanProvider {
    extractFromImage(imageBuffer: Buffer, mimeType: string): Promise<ExtractedMedicineInfo>;
}
export declare class MockImageScanner implements ImageScanProvider {
    extractFromImage(imageBuffer: Buffer, mimeType: string): Promise<ExtractedMedicineInfo>;
}
export declare class GeminiImageScanner implements ImageScanProvider {
    private mockScanner;
    extractFromImage(imageBuffer: Buffer, mimeType: string): Promise<ExtractedMedicineInfo>;
    verifyWithAI(extracted: ExtractedMedicineInfo): Promise<AIVerificationResult | null>;
}

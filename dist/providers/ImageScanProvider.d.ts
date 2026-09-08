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
export interface ImageScanProvider {
    extractFromImage(imageBuffer: Buffer, mimeType: string): Promise<ExtractedMedicineInfo>;
}
export declare class MockImageScanner implements ImageScanProvider {
    extractFromImage(imageBuffer: Buffer, mimeType: string): Promise<ExtractedMedicineInfo>;
}
export declare class GeminiImageScanner implements ImageScanProvider {
    private mockScanner;
    extractFromImage(imageBuffer: Buffer, mimeType: string): Promise<ExtractedMedicineInfo>;
}

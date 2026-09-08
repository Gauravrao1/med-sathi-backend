export interface StorageProvider {
    upload(file: Express.Multer.File): Promise<string>;
    getUrl(key: string): string;
}
export declare class LocalStorageProvider implements StorageProvider {
    private uploadDir;
    constructor();
    upload(file: Express.Multer.File): Promise<string>;
    getUrl(key: string): string;
}

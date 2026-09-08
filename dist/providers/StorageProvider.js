import { uploadDir } from '../utils/runtimePaths.js';
export class LocalStorageProvider {
    uploadDir;
    constructor() {
        this.uploadDir = uploadDir;
    }
    async upload(file) {
        // multer already saves the file, just return the key
        return file.filename;
    }
    getUrl(key) {
        return '/uploads/' + key;
    }
}

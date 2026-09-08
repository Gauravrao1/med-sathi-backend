import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';

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

export class MockImageScanner implements ImageScanProvider {
  async extractFromImage(imageBuffer: Buffer, mimeType: string): Promise<ExtractedMedicineInfo> {
    // Without Gemini API key, we CANNOT read images
    // Return empty result — do NOT return random wrong data
    console.warn('MockImageScanner: Cannot read image without GEMINI_API_KEY. Get a free key at https://aistudio.google.com/apikey');
    
    return {
      medicine_name: null,
      generic_name: null,
      manufacturer: null,
      batch_number: null,
      expiry_date: null,
      mrp: null,
      strength: null,
      confidence: 0
    };
  }
}

export class GeminiImageScanner implements ImageScanProvider {
  private mockScanner = new MockImageScanner();

  async extractFromImage(imageBuffer: Buffer, mimeType: string): Promise<ExtractedMedicineInfo> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found, falling back to MockImageScanner');
      return this.mockScanner.extractFromImage(imageBuffer, mimeType);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
      
      const promptText = 'You are a medicine packaging reader for Indian medicines. Analyze this image of a medicine strip, box, or label. Extract the following information and return ONLY a JSON object (no markdown, no code fences): {medicine_name, generic_name, manufacturer, batch_number, expiry_date, mrp, strength}. If you cannot read a field, set it to null. For mrp, return the numeric value only. For expiry_date return in YYYY-MM format.';
      
      const result = await model.generateContent([
        promptText,
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBuffer.toString('base64')
          }
        }
      ]);
      
      let text = result.response.text();
      // Remove any possible markdown blocks if the model ignores the instruction
      if (text.startsWith('```json')) {
        text = text.substring(7);
      } else if (text.startsWith('```')) {
        text = text.substring(3);
      }
      if (text.endsWith('```')) {
        text = text.substring(0, text.length - 3);
      }
      
      const parsed = JSON.parse(text);
      
      // Calculate confidence based on how many fields were extracted
      let fieldsExtracted = 0;
      let totalFields = 7;
      
      if (parsed.medicine_name) fieldsExtracted++;
      if (parsed.generic_name) fieldsExtracted++;
      if (parsed.manufacturer) fieldsExtracted++;
      if (parsed.batch_number) fieldsExtracted++;
      if (parsed.expiry_date) fieldsExtracted++;
      if (parsed.mrp !== null && parsed.mrp !== undefined) fieldsExtracted++;
      if (parsed.strength) fieldsExtracted++;
      
      const confidence = Math.round((fieldsExtracted / totalFields) * 100);
      
      return {
        medicine_name: parsed.medicine_name || null,
        generic_name: parsed.generic_name || null,
        manufacturer: parsed.manufacturer || null,
        batch_number: parsed.batch_number || null,
        expiry_date: parsed.expiry_date || null,
        mrp: parsed.mrp !== null ? Number(parsed.mrp) : null,
        strength: parsed.strength || null,
        confidence: confidence
      };
      
    } catch (error) {
      console.error('Gemini scanning failed, falling back to mock scanner:', error);
      return this.mockScanner.extractFromImage(imageBuffer, mimeType);
    }
  }
}

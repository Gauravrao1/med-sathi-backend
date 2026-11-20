import { GoogleGenerativeAI } from '@google/generative-ai';
export class MockImageScanner {
    async extractFromImage(imageBuffer, mimeType) {
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
export class GeminiImageScanner {
    mockScanner = new MockImageScanner();
    async extractFromImage(imageBuffer, mimeType) {
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
            }
            else if (text.startsWith('```')) {
                text = text.substring(3);
            }
            if (text.endsWith('```')) {
                text = text.substring(0, text.length - 3);
            }
            const parsed = JSON.parse(text);
            // Calculate confidence based on how many fields were extracted
            let fieldsExtracted = 0;
            let totalFields = 7;
            if (parsed.medicine_name)
                fieldsExtracted++;
            if (parsed.generic_name)
                fieldsExtracted++;
            if (parsed.manufacturer)
                fieldsExtracted++;
            if (parsed.batch_number)
                fieldsExtracted++;
            if (parsed.expiry_date)
                fieldsExtracted++;
            if (parsed.mrp !== null && parsed.mrp !== undefined)
                fieldsExtracted++;
            if (parsed.strength)
                fieldsExtracted++;
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
        }
        catch (error) {
            console.error('Gemini scanning failed, falling back to mock scanner:', error);
            return this.mockScanner.extractFromImage(imageBuffer, mimeType);
        }
    }
    async verifyWithAI(extracted) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || !extracted.medicine_name)
            return null;
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
            const verifyPrompt = 'You are an Indian pharmaceutical verification expert with deep knowledge of CDSCO registered companies, NPPA price controls, and Jan Aushadhi (PMBJP) medicines. '
                + 'Analyze this medicine and return ONLY a JSON object (no markdown, no code fences).\n\n'
                + 'Medicine: ' + (extracted.medicine_name || 'Unknown') + '\n'
                + 'Generic/Salt: ' + (extracted.generic_name || 'Unknown') + '\n'
                + 'Manufacturer: ' + (extracted.manufacturer || 'Unknown') + '\n'
                + 'MRP: ' + (extracted.mrp !== null ? extracted.mrp : 'Unknown') + '\n'
                + 'Strength: ' + (extracted.strength || 'Unknown') + '\n\n'
                + 'Return this exact JSON structure:\n'
                + '{\n'
                + '  "is_brand_real": true/false (does this brand name actually exist in India?),\n'
                + '  "brand_exists_in_india": true/false (is it sold in Indian market?),\n'
                + '  "cdsco_manufacturer_status": "registered"/"not_found"/"unknown" (is the manufacturer CDSCO registered?),\n'
                + '  "manufacturer_verified": true/false (is this a known legitimate pharma company?),\n'
                + '  "typical_price_range": {"min": number, "max": number} or null (typical MRP range in INR for this medicine in India),\n'
                + '  "is_price_reasonable": true/false (is the given MRP within normal range?),\n'
                + '  "jan_aushadhi_alternative": {"name": "brand name", "generic_name": "salt name", "approximate_price": number, "manufacturer": "company"} or null,\n'
                + '  "genuineness_rating": "genuine"/"likely_genuine"/"suspicious"/"unknown",\n'
                + '  "genuineness_score": 0-100 (overall trust score),\n'
                + '  "verification_notes": ["note1", "note2"] (key findings about this medicine),\n'
                + '  "drug_category": "OTC"/"Schedule H"/"Schedule H1"/"Schedule X"/null,\n'
                + '  "prescription_required": true/false\n'
                + '}\n\n'
                + 'Important: Base your answers on real pharmaceutical knowledge. '
                + 'Major Indian pharma companies include Cipla, Sun Pharma, Abbott, Lupin, Dr Reddys, Mankind, Zydus, Torrent, Glenmark, Alkem, Micro Labs, Macleods, Hetero, Intas, Emcure, USV, Aristo, Ipca, Biocon, Aurobindo, Cadila Healthcare, Wockhardt, Piramal, etc. '
                + 'MNCs include GSK, Sanofi, Pfizer, Abbott, Johnson and Johnson. '
                + 'For Jan Aushadhi alternatives, suggest the PMBJP generic equivalent if one exists. '
                + 'Be honest - if you are not sure about something, say "unknown".';
            const result = await model.generateContent(verifyPrompt);
            let text = result.response.text().trim();
            // Strip markdown code fences
            if (text.startsWith('```json')) {
                text = text.substring(7);
            }
            else if (text.startsWith('```')) {
                text = text.substring(3);
            }
            if (text.endsWith('```')) {
                text = text.substring(0, text.length - 3);
            }
            text = text.trim();
            const parsed = JSON.parse(text);
            return {
                is_brand_real: parsed.is_brand_real === true,
                brand_exists_in_india: parsed.brand_exists_in_india === true,
                cdsco_manufacturer_status: parsed.cdsco_manufacturer_status || 'unknown',
                manufacturer_verified: parsed.manufacturer_verified === true,
                typical_price_range: parsed.typical_price_range || null,
                is_price_reasonable: parsed.is_price_reasonable !== false,
                jan_aushadhi_alternative: parsed.jan_aushadhi_alternative || null,
                genuineness_rating: parsed.genuineness_rating || 'unknown',
                genuineness_score: typeof parsed.genuineness_score === 'number' ? parsed.genuineness_score : 50,
                verification_notes: Array.isArray(parsed.verification_notes) ? parsed.verification_notes : [],
                drug_category: parsed.drug_category || null,
                prescription_required: parsed.prescription_required === true
            };
        }
        catch (error) {
            console.error('AI verification failed:', error);
            return null;
        }
    }
}

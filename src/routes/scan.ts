import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { SeedDataProvider } from '../providers/DataProvider.js';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import fs from 'fs';
import { GeminiImageScanner } from '../providers/ImageScanProvider.js';

const router = Router();
const dataProvider = new SeedDataProvider();
const imageScanner = new GeminiImageScanner();

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ 
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/', authenticate, async (req, res) => {
  const { barcode_data, scan_method } = req.body;
  if (!barcode_data || !scan_method) {
    return res.status(400).json({ error: 'Missing barcode_data or scan_method' });
  }

  try {
    const match = await dataProvider.getMedicineByBatchNumber(barcode_data);
    let trustScoreResult = null;
    let scanRecord: any = {
      id: uuidv4(),
      user_id: req.user.id,
      scan_method,
      scanned_at: Date.now()
    };

    let resultPayload: any = { status: 'not_found' };

    if (match) {
      trustScoreResult = await dataProvider.getTrustScore(match.batch.id);
      scanRecord.medicine_id = match.medicine.id;
      scanRecord.batch_id = match.batch.id;
      scanRecord.trust_score = trustScoreResult.score;
      scanRecord.trust_score_breakdown = JSON.stringify(trustScoreResult.breakdown);

      const alternatives = await dataProvider.getGenericAlternatives(match.medicine.id);
      const recalls = await dataProvider.getRecallsByBatchId(match.batch.id);

      resultPayload = {
        status: 'success',
        medicine: match.medicine,
        batch: match.batch,
        trust_score: trustScoreResult,
        alternatives,
        recalls
      };
    }

    await db.insert(schema.scans).values(scanRecord);
    res.json(resultPayload);

  } catch (error) {
    console.error('Scan processing error:', error);
    res.status(500).json({ error: 'Internal server error during scan processing' });
  }
});

router.post('/image', authenticate, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    const imageBuffer = fs.readFileSync(req.file.path);
    const mimeType = req.file.mimetype;
    
    // Extract info from image
    const extractedInfo = await imageScanner.extractFromImage(imageBuffer, mimeType);
    
    // Try to match medicine
    let match = null;
    if (extractedInfo.medicine_name) {
      match = await dataProvider.findMedicineByName(extractedInfo.medicine_name);
    }

    let trustScoreResult = null;
    let scanRecord: any = {
      id: uuidv4(),
      user_id: req.user.id,
      scan_method: 'image',
      scanned_at: Date.now()
    };

    let resultPayload: any = { 
      status: match ? 'verified' : 'not_found',
      extracted: extractedInfo,
      medicine: null,
      batch: null,
      trust_score: null,
      alternatives: [],
      recalls: []
    };

    if (match) {
      // Find a batch for this medicine to simulate full info (or if batch_number extracted, use it)
      const batches = await db.select().from(schema.batches).where(eq(schema.batches.medicine_id, match.id));
      const batch = batches.length > 0 ? batches[0] : null;
      
      if (batch) {
        trustScoreResult = await dataProvider.getTrustScore(batch.id);
        scanRecord.medicine_id = match.id;
        scanRecord.batch_id = batch.id;
        scanRecord.trust_score = trustScoreResult.score;
        scanRecord.trust_score_breakdown = JSON.stringify(trustScoreResult.breakdown);

        const alternatives = await dataProvider.getGenericAlternatives(match.id);
        const recalls = await dataProvider.getRecallsByBatchId(batch.id);

        resultPayload.medicine = match;
        resultPayload.batch = batch;
        resultPayload.trust_score = trustScoreResult;
        resultPayload.alternatives = alternatives;
        resultPayload.recalls = recalls;
      } else {
        scanRecord.medicine_id = match.id;
        resultPayload.medicine = match;
      }
    } else if (extractedInfo.medicine_name) {
      resultPayload.status = 'unverified';
    } else {
      // No data extracted at all — likely no API key
      resultPayload.status = 'not_found';
      resultPayload.error_message = 'Could not read image. Set GEMINI_API_KEY in server/.env for AI-powered scanning (free at https://aistudio.google.com/apikey)';
    }

    await db.insert(schema.scans).values(scanRecord);
    
    // Cleanup temp file
    try {
      fs.unlinkSync(req.file.path);
    } catch (cleanupErr) {
      console.error('Error removing temp file:', cleanupErr);
    }

    res.json(resultPayload);
  } catch (error) {
    console.error('Image scan processing error:', error);
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {}
    res.status(500).json({ error: 'Internal server error during image scan processing' });
  }
});

// Get scan history for authenticated user
router.get('/history', authenticate, async (req, res) => {
  try {
    const userScans = await db.select().from(schema.scans)
      .where(eq(schema.scans.user_id, req.user.id))
      .orderBy(schema.scans.scanned_at);
    
    // Enrich with medicine data
    const enriched = [];
    for (const scan of userScans) {
      let medicine = null;
      let batch = null;
      if (scan.medicine_id) {
        medicine = await dataProvider.getMedicineById(scan.medicine_id);
      }
      if (scan.batch_id) {
        const batches = await db.select().from(schema.batches).where(eq(schema.batches.id, scan.batch_id));
        batch = batches[0] || null;
      }
      enriched.push({
        ...scan,
        medicine,
        batch,
        trust_score: scan.trust_score_breakdown ? {
          score: scan.trust_score,
          breakdown: JSON.parse(scan.trust_score_breakdown || '{}')
        } : null
      });
    }
    
    res.json(enriched);
  } catch (error) {
    console.error('Scan history error:', error);
    res.status(500).json({ error: 'Failed to fetch scan history' });
  }
});

export default router;

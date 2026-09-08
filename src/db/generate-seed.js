import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = {
  users: [
    { id: 'u1', phone: '9876543210', name: 'Rahul Sharma', age_bracket: '30-40', preferred_language: 'hi', chronic_conditions: JSON.stringify(['Diabetes']), created_at: Date.now() },
    { id: 'u2', phone: '9123456789', name: 'Priya Patel', age_bracket: '20-30', preferred_language: 'en', chronic_conditions: null, created_at: Date.now() }
  ],
  medicines: [],
  batches: [],
  recalls: [],
  generic_alternatives: [],
  community_posts: [],
  community_comments: [],
  experience_posts: []
};

const medNames = [
  { b: 'Crocin', g: 'Paracetamol', m: 'GSK', c: 'Analgesic', mrp: 30, cp: 25 },
  { b: 'Dolo 650', g: 'Paracetamol 650mg', m: 'Micro Labs', c: 'Analgesic', mrp: 32, cp: 28 },
  { b: 'Augmentin', g: 'Amoxicillin+Clavulanate', m: 'GSK', c: 'Antibiotic', mrp: 200, cp: 180 },
  { b: 'Azithral 500', g: 'Azithromycin', m: 'Alembic', c: 'Antibiotic', mrp: 120, cp: 110 },
  { b: 'Pan-D', g: 'Pantoprazole+Domperidone', m: 'Alkem', c: 'Antacid', mrp: 150, cp: 130 },
  { b: 'Shelcal 500', g: 'Calcium+Vit D3', m: 'Torrent', c: 'Vitamin', mrp: 100, cp: null },
  { b: 'Glycomet GP', g: 'Metformin+Glimepiride', m: 'USV', c: 'Diabetes', mrp: 140, cp: 120 },
  { b: 'Metolar XR', g: 'Metoprolol', m: 'Cipla', c: 'Cardiac', mrp: 90, cp: null },
  { b: 'Thyronorm', g: 'Thyroxine', m: 'Abbott', c: 'Hormone', mrp: 180, cp: 150 },
  { b: 'Ecosprin 75', g: 'Aspirin', m: 'USV', c: 'Cardiac', mrp: 15, cp: 12 },
  { b: 'Calpol', g: 'Paracetamol', m: 'GSK', c: 'Analgesic', mrp: 40, cp: null },
  { b: 'Allegra 120', g: 'Fexofenadine', m: 'Sanofi', c: 'Antihistamine', mrp: 210, cp: null },
  { b: 'Montair LC', g: 'Montelukast+Levocetirizine', m: 'Cipla', c: 'Antihistamine', mrp: 190, cp: null },
  { b: 'Rantac 150', g: 'Ranitidine', m: 'JB Chemicals', c: 'Antacid', mrp: 40, cp: 35 },
  { b: 'Combiflam', g: 'Ibuprofen+Paracetamol', m: 'Sanofi', c: 'Analgesic', mrp: 45, cp: 40 },
  { b: 'Volini gel', g: 'Diclofenac', m: 'Sun Pharma', c: 'Analgesic', mrp: 105, cp: null },
  { b: 'Benadryl cough syrup', g: 'Diphenhydramine', m: 'J&J', c: 'Cough', mrp: 120, cp: null },
  { b: 'Becosules capsule', g: 'B-Complex', m: 'Pfizer', c: 'Vitamin', mrp: 50, cp: null },
  { b: 'Revital H', g: 'Multivitamin', m: 'Sun Pharma', c: 'Vitamin', mrp: 300, cp: null },
  { b: 'Sinarest', g: 'Paracetamol+Phenylephrine', m: 'Centaur', c: 'Cold', mrp: 95, cp: null },
  { b: 'Zifi 200', g: 'Cefixime', m: 'FDC', c: 'Antibiotic', mrp: 110, cp: 100 },
  { b: 'Electral', g: 'ORS', m: 'FDC', c: 'Hydration', mrp: 22, cp: 20 },
  { b: 'Deriphyllin', g: 'Etofylline+Theophylline', m: 'Zydus', c: 'Respiratory', mrp: 55, cp: 50 },
  { b: 'Monocef 200', g: 'Cefpodoxime', m: 'Aristo', c: 'Antibiotic', mrp: 170, cp: null },
  { b: 'Pan 40', g: 'Pantoprazole', m: 'Alkem', c: 'Antacid', mrp: 140, cp: null },
  { b: 'Atorva 10', g: 'Atorvastatin', m: 'Zydus', c: 'Cardiac', mrp: 80, cp: 70 },
  { b: 'Telma 40', g: 'Telmisartan', m: 'Glenmark', c: 'Cardiac', mrp: 130, cp: 110 },
  { b: 'Glucobay 50', g: 'Acarbose', m: 'Bayer', c: 'Diabetes', mrp: 145, cp: null },
  { b: 'Amaryl M', g: 'Glimepiride+Metformin', m: 'Sanofi', c: 'Diabetes', mrp: 160, cp: null },
  { b: 'Jalra M', g: 'Vildagliptin+Metformin', m: 'USV', c: 'Diabetes', mrp: 250, cp: null }
];

medNames.forEach((med, i) => {
  const medId = i + 1;
  data.medicines.push({
    id: medId,
    brand_name: med.b,
    generic_name: med.g,
    manufacturer: med.m,
    dosage_form: 'Tablet',
    strength: 'Standard',
    mrp: med.mrp,
    nppa_ceiling_price: med.cp,
    category: med.c
  });

  // Batches
  const b1 = { id: (i*2)+1, medicine_id: medId, batch_number: \`BN2024A\${medId.toString().padStart(3, '0')}\`, mfg_date: '2024-01-01', expiry_date: '2026-01-01', verification_status: 'genuine' };
  const b2 = { id: (i*2)+2, medicine_id: medId, batch_number: \`BN2024B\${medId.toString().padStart(3, '0')}\`, mfg_date: '2024-02-01', expiry_date: '2026-02-01', verification_status: i % 10 === 0 ? 'flagged' : 'genuine' };
  
  data.batches.push(b1, b2);

  if (i % 10 === 0) {
    data.recalls.push({
      batch_id: b2.id,
      reason: 'Failed dissolution test',
      alert_date: '2024-05-01',
      severity: 'critical'
    });
  }
});

// Generics
data.medicines.push({
  id: 101,
  brand_name: 'Jan Aushadhi Paracetamol',
  generic_name: 'Paracetamol',
  manufacturer: 'PMBJP',
  dosage_form: 'Tablet',
  strength: '500mg',
  mrp: 8,
  nppa_ceiling_price: null,
  category: 'Analgesic'
});
data.generic_alternatives.push({
  medicine_id: 1, // Crocin
  alternative_medicine_id: 101,
  price_difference_pct: 73
});

// Posts
data.community_posts.push({
  id: 'p1', user_id: 'u1', medicine_id: 1, title: 'Does Crocin cause drowsiness?', body: 'I always feel sleepy after taking it.', tags: ['side-effects'], created_at: Date.now()
});
data.community_comments.push({
  id: 'c1', post_id: 'p1', user_id: 'u2', body: 'Not usually, but everyone is different.', parent_comment_id: null, created_at: Date.now()
});
data.experience_posts.push({
  id: 'e1', user_id: 'u1', medicine_id: 7, condition_tag: 'Diabetes', media_type: 'text', content_url: null, caption: 'Glycomet GP has helped me keep my sugar in control for 2 years.', status: 'approved', created_at: Date.now()
});

fs.writeFileSync(path.resolve(__dirname, 'seed-data.json'), JSON.stringify(data, null, 2));
console.log('seed-data.json generated.');

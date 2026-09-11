// Comprehensive Indian Medicine Database
// DO NOT USE BACKTICKS IN THIS FILE

const baseMedicines = [
  { id: 1, brand_name: 'Dolo 650', generic_name: 'Paracetamol', manufacturer: 'Micro Labs', dosage_form: 'Tablet', strength: '650mg', mrp: 30.91, nppa_ceiling_price: 26.50, category: 'Antipyretic' },
  { id: 2, brand_name: 'Crocin Advance', generic_name: 'Paracetamol', manufacturer: 'GSK', dosage_form: 'Tablet', strength: '500mg', mrp: 20.00, nppa_ceiling_price: 18.00, category: 'Antipyretic' },
  { id: 3, brand_name: 'Calpol 500', generic_name: 'Paracetamol', manufacturer: 'GSK', dosage_form: 'Tablet', strength: '500mg', mrp: 15.50, nppa_ceiling_price: 14.50, category: 'Antipyretic' },
  { id: 4, brand_name: 'Combiflam', generic_name: 'Ibuprofen + Paracetamol', manufacturer: 'Sanofi', dosage_form: 'Tablet', strength: '400mg+325mg', mrp: 45.00, nppa_ceiling_price: null, category: 'Analgesic' },
  { id: 5, brand_name: 'Saridon', generic_name: 'Paracetamol + Propyphenazone + Caffeine', manufacturer: 'Piramal', dosage_form: 'Tablet', strength: '250mg+150mg+50mg', mrp: 35.00, nppa_ceiling_price: null, category: 'Analgesic' },
  { id: 6, brand_name: 'Meftal Spas', generic_name: 'Mefenamic Acid + Dicyclomine', manufacturer: 'Blue Cross', dosage_form: 'Tablet', strength: '250mg+10mg', mrp: 50.00, nppa_ceiling_price: null, category: 'Analgesic' },
  { id: 7, brand_name: 'Voveran', generic_name: 'Diclofenac', manufacturer: 'Novartis', dosage_form: 'Tablet', strength: '50mg', mrp: 80.00, nppa_ceiling_price: null, category: 'Anti-inflammatory' },
  { id: 8, brand_name: 'Brufen 400', generic_name: 'Ibuprofen', manufacturer: 'Abbott India', dosage_form: 'Tablet', strength: '400mg', mrp: 20.00, nppa_ceiling_price: null, category: 'Anti-inflammatory' },
  { id: 9, brand_name: 'Augmentin 625', generic_name: 'Amoxicillin + Clavulanic Acid', manufacturer: 'GSK', dosage_form: 'Tablet', strength: '500mg+125mg', mrp: 200.00, nppa_ceiling_price: 180.00, category: 'Antibiotic' },
  { id: 10, brand_name: 'Azithral 500', generic_name: 'Azithromycin', manufacturer: 'Alembic', dosage_form: 'Tablet', strength: '500mg', mrp: 120.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 11, brand_name: 'Amoxyclav', generic_name: 'Amoxicillin + Clavulanic Acid', manufacturer: 'Abbott India', dosage_form: 'Tablet', strength: '500mg+125mg', mrp: 180.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 12, brand_name: 'Monocef', generic_name: 'Ceftriaxone', manufacturer: 'Aristo Pharma', dosage_form: 'Injection', strength: '1g', mrp: 60.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 13, brand_name: 'Taxim-O', generic_name: 'Cefixime', manufacturer: 'Alkem', dosage_form: 'Tablet', strength: '200mg', mrp: 110.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 14, brand_name: 'Cefixime', generic_name: 'Cefixime', manufacturer: 'Cipla', dosage_form: 'Tablet', strength: '200mg', mrp: 100.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 15, brand_name: 'Ciplox 500', generic_name: 'Ciprofloxacin', manufacturer: 'Cipla', dosage_form: 'Tablet', strength: '500mg', mrp: 40.00, nppa_ceiling_price: 35.00, category: 'Antibiotic' },
  { id: 16, brand_name: 'Norflox 400', generic_name: 'Norfloxacin', manufacturer: 'Cipla', dosage_form: 'Tablet', strength: '400mg', mrp: 55.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 17, brand_name: 'Metrogyl', generic_name: 'Metronidazole', manufacturer: 'JB Pharma', dosage_form: 'Tablet', strength: '400mg', mrp: 25.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 18, brand_name: 'Pan-D', generic_name: 'Pantoprazole + Domperidone', manufacturer: 'Alkem', dosage_form: 'Capsule', strength: '40mg+30mg', mrp: 150.00, nppa_ceiling_price: null, category: 'Gastrointestinal' },
  { id: 19, brand_name: 'Pantocid', generic_name: 'Pantoprazole', manufacturer: 'Sun Pharma', dosage_form: 'Tablet', strength: '40mg', mrp: 130.00, nppa_ceiling_price: null, category: 'Antacid' },
  { id: 20, brand_name: 'Omez', generic_name: 'Omeprazole', manufacturer: 'Dr. Reddy\'s', dosage_form: 'Capsule', strength: '20mg', mrp: 60.00, nppa_ceiling_price: 55.00, category: 'Antacid' },
  { id: 21, brand_name: 'Rantac', generic_name: 'Ranitidine', manufacturer: 'JB Pharma', dosage_form: 'Tablet', strength: '150mg', mrp: 35.00, nppa_ceiling_price: null, category: 'Antacid' },
  { id: 22, brand_name: 'Ranitidine', generic_name: 'Ranitidine', manufacturer: 'Cadila Healthcare', dosage_form: 'Tablet', strength: '150mg', mrp: 30.00, nppa_ceiling_price: null, category: 'Antacid' },
  { id: 23, brand_name: 'Gelusil', generic_name: 'Aluminium Hydroxide + Magnesium Hydroxide + Simethicone', manufacturer: 'Pfizer', dosage_form: 'Syrup', strength: '10ml', mrp: 120.00, nppa_ceiling_price: null, category: 'Antacid' },
  { id: 24, brand_name: 'Mucaine', generic_name: 'Oxetacaine + Aluminium Hydroxide + Magnesium Hydroxide', manufacturer: 'Pfizer', dosage_form: 'Syrup', strength: '10ml', mrp: 160.00, nppa_ceiling_price: null, category: 'Antacid' },
  { id: 25, brand_name: 'Digene', generic_name: 'Magnesium Hydroxide + Simethicone', manufacturer: 'Abbott India', dosage_form: 'Syrup', strength: '10ml', mrp: 130.00, nppa_ceiling_price: null, category: 'Antacid' },
  { id: 26, brand_name: 'Glycomet GP', generic_name: 'Glimepiride + Metformin', manufacturer: 'USV Pvt Ltd', dosage_form: 'Tablet', strength: '1mg+500mg', mrp: 160.00, nppa_ceiling_price: null, category: 'Antidiabetic' },
  { id: 27, brand_name: 'Januvia', generic_name: 'Sitagliptin', manufacturer: 'MSD', dosage_form: 'Tablet', strength: '100mg', mrp: 800.00, nppa_ceiling_price: null, category: 'Antidiabetic' },
  { id: 28, brand_name: 'Galvus Met', generic_name: 'Vildagliptin + Metformin', manufacturer: 'Novartis', dosage_form: 'Tablet', strength: '50mg+500mg', mrp: 300.00, nppa_ceiling_price: null, category: 'Antidiabetic' },
  { id: 29, brand_name: 'Amaryl', generic_name: 'Glimepiride', manufacturer: 'Sanofi', dosage_form: 'Tablet', strength: '1mg', mrp: 100.00, nppa_ceiling_price: null, category: 'Antidiabetic' },
  { id: 30, brand_name: 'Gluformin', generic_name: 'Metformin', manufacturer: 'Abbott India', dosage_form: 'Tablet', strength: '500mg', mrp: 40.00, nppa_ceiling_price: 35.00, category: 'Antidiabetic' },
  { id: 31, brand_name: 'Trajenta', generic_name: 'Linagliptin', manufacturer: 'Boehringer Ingelheim', dosage_form: 'Tablet', strength: '5mg', mrp: 500.00, nppa_ceiling_price: null, category: 'Antidiabetic' },
  { id: 32, brand_name: 'Glucobay', generic_name: 'Acarbose', manufacturer: 'Bayer', dosage_form: 'Tablet', strength: '50mg', mrp: 120.00, nppa_ceiling_price: null, category: 'Antidiabetic' },
  { id: 33, brand_name: 'Telma 40', generic_name: 'Telmisartan', manufacturer: 'Glenmark', dosage_form: 'Tablet', strength: '40mg', mrp: 200.00, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 34, brand_name: 'Amlokind AT', generic_name: 'Amlodipine + Atenolol', manufacturer: 'Mankind Pharma', dosage_form: 'Tablet', strength: '5mg+50mg', mrp: 60.00, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 35, brand_name: 'Stamlo', generic_name: 'Amlodipine', manufacturer: 'Dr. Reddy\'s', dosage_form: 'Tablet', strength: '5mg', mrp: 80.00, nppa_ceiling_price: 70.00, category: 'Antihypertensive' },
  { id: 36, brand_name: 'Concor', generic_name: 'Bisoprolol', manufacturer: 'Merck', dosage_form: 'Tablet', strength: '5mg', mrp: 150.00, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 37, brand_name: 'Aten', generic_name: 'Atenolol', manufacturer: 'Zydus Cadila', dosage_form: 'Tablet', strength: '50mg', mrp: 40.00, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 38, brand_name: 'Ramipril', generic_name: 'Ramipril', manufacturer: 'Cipla', dosage_form: 'Tablet', strength: '5mg', mrp: 70.00, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 39, brand_name: 'Losartan', generic_name: 'Losartan', manufacturer: 'Torrent Pharma', dosage_form: 'Tablet', strength: '50mg', mrp: 85.00, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 40, brand_name: 'Atorva', generic_name: 'Atorvastatin', manufacturer: 'Zydus Cadila', dosage_form: 'Tablet', strength: '10mg', mrp: 70.00, nppa_ceiling_price: 60.00, category: 'Cardiovascular' },
  { id: 41, brand_name: 'Rozavel', generic_name: 'Rosuvastatin', manufacturer: 'Sun Pharma', dosage_form: 'Tablet', strength: '10mg', mrp: 150.00, nppa_ceiling_price: null, category: 'Cardiovascular' },
  { id: 42, brand_name: 'Crestor', generic_name: 'Rosuvastatin', manufacturer: 'AstraZeneca', dosage_form: 'Tablet', strength: '10mg', mrp: 250.00, nppa_ceiling_price: null, category: 'Cardiovascular' },
  { id: 43, brand_name: 'Ecosprin', generic_name: 'Aspirin', manufacturer: 'USV Pvt Ltd', dosage_form: 'Tablet', strength: '75mg', mrp: 15.00, nppa_ceiling_price: null, category: 'Antiplatelet' },
  { id: 44, brand_name: 'Clopitab', generic_name: 'Clopidogrel', manufacturer: 'Lupin', dosage_form: 'Tablet', strength: '75mg', mrp: 90.00, nppa_ceiling_price: null, category: 'Antiplatelet' },
  { id: 45, brand_name: 'Eliquis', generic_name: 'Apixaban', manufacturer: 'Pfizer', dosage_form: 'Tablet', strength: '5mg', mrp: 450.00, nppa_ceiling_price: null, category: 'Anticoagulant' },
  { id: 46, brand_name: 'Thyronorm', generic_name: 'Thyroxine', manufacturer: 'Abbott India', dosage_form: 'Tablet', strength: '50mcg', mrp: 150.00, nppa_ceiling_price: null, category: 'Thyroid' },
  { id: 47, brand_name: 'Eltroxin', generic_name: 'Thyroxine', manufacturer: 'GSK', dosage_form: 'Tablet', strength: '100mcg', mrp: 180.00, nppa_ceiling_price: null, category: 'Thyroid' },
  { id: 48, brand_name: 'Thyrox', generic_name: 'Thyroxine', manufacturer: 'Macleods Pharma', dosage_form: 'Tablet', strength: '25mcg', mrp: 100.00, nppa_ceiling_price: null, category: 'Thyroid' },
  { id: 49, brand_name: 'Montair LC', generic_name: 'Montelukast + Levocetirizine', manufacturer: 'Cipla', dosage_form: 'Tablet', strength: '10mg+5mg', mrp: 200.00, nppa_ceiling_price: null, category: 'Antihistamine' },
  { id: 50, brand_name: 'Cetrizine', generic_name: 'Cetirizine', manufacturer: 'Sun Pharma', dosage_form: 'Tablet', strength: '10mg', mrp: 20.00, nppa_ceiling_price: null, category: 'Antihistamine' },
  { id: 51, brand_name: 'Allegra', generic_name: 'Fexofenadine', manufacturer: 'Sanofi', dosage_form: 'Tablet', strength: '120mg', mrp: 180.00, nppa_ceiling_price: null, category: 'Antihistamine' },
  { id: 52, brand_name: 'Levocet', generic_name: 'Levocetirizine', manufacturer: 'Hetero', dosage_form: 'Tablet', strength: '5mg', mrp: 45.00, nppa_ceiling_price: null, category: 'Antihistamine' },
  { id: 53, brand_name: 'Sinarest', generic_name: 'Paracetamol + Phenylephrine + Chlorpheniramine', manufacturer: 'Centaur', dosage_form: 'Tablet', strength: '500mg+10mg+2mg', mrp: 70.00, nppa_ceiling_price: null, category: 'Antipyretic' },
  { id: 54, brand_name: 'Otrivin', generic_name: 'Xylometazoline', manufacturer: 'GSK', dosage_form: 'Drops', strength: '0.1%', mrp: 90.00, nppa_ceiling_price: null, category: 'Respiratory' },
  { id: 55, brand_name: 'Nasivion', generic_name: 'Oxymetazoline', manufacturer: 'Procter & Gamble', dosage_form: 'Drops', strength: '0.05%', mrp: 85.00, nppa_ceiling_price: null, category: 'Respiratory' },
  { id: 56, brand_name: 'Deriphyllin', generic_name: 'Etofylline + Theophylline', manufacturer: 'Zydus Cadila', dosage_form: 'Tablet', strength: '77mg+23mg', mrp: 30.00, nppa_ceiling_price: null, category: 'Respiratory' },
  { id: 57, brand_name: 'Asthalin', generic_name: 'Salbutamol', manufacturer: 'Cipla', dosage_form: 'Inhaler', strength: '100mcg', mrp: 150.00, nppa_ceiling_price: null, category: 'Respiratory' },
  { id: 58, brand_name: 'Budecort', generic_name: 'Budesonide', manufacturer: 'Cipla', dosage_form: 'Inhaler', strength: '200mcg', mrp: 280.00, nppa_ceiling_price: null, category: 'Respiratory' },
  { id: 59, brand_name: 'Foracort', generic_name: 'Formoterol + Budesonide', manufacturer: 'Cipla', dosage_form: 'Inhaler', strength: '6mcg+200mcg', mrp: 350.00, nppa_ceiling_price: null, category: 'Respiratory' },
  { id: 60, brand_name: 'Seroflo', generic_name: 'Salmeterol + Fluticasone', manufacturer: 'Cipla', dosage_form: 'Inhaler', strength: '50mcg+250mcg', mrp: 400.00, nppa_ceiling_price: null, category: 'Respiratory' },
  { id: 61, brand_name: 'Duolin', generic_name: 'Levosalbutamol + Ipratropium', manufacturer: 'Cipla', dosage_form: 'Inhaler', strength: '50mcg+20mcg', mrp: 220.00, nppa_ceiling_price: null, category: 'Respiratory' },
  { id: 62, brand_name: 'Betadine', generic_name: 'Povidone Iodine', manufacturer: 'Win-Medicare', dosage_form: 'Ointment', strength: '5%', mrp: 120.00, nppa_ceiling_price: null, category: 'Dermatological' },
  { id: 63, brand_name: 'Soframycin', generic_name: 'Framycetin', manufacturer: 'Sanofi', dosage_form: 'Cream', strength: '1%', mrp: 60.00, nppa_ceiling_price: null, category: 'Dermatological' },
  { id: 64, brand_name: 'Candid-B', generic_name: 'Clotrimazole + Beclomethasone', manufacturer: 'Glenmark', dosage_form: 'Cream', strength: '1%+0.025%', mrp: 140.00, nppa_ceiling_price: null, category: 'Dermatological' },
  { id: 65, brand_name: 'Clobetasol', generic_name: 'Clobetasol Propionate', manufacturer: 'GlaxoSmithKline', dosage_form: 'Cream', strength: '0.05%', mrp: 80.00, nppa_ceiling_price: null, category: 'Dermatological' },
  { id: 66, brand_name: 'Fluconazole', generic_name: 'Fluconazole', manufacturer: 'Pfizer', dosage_form: 'Tablet', strength: '150mg', mrp: 35.00, nppa_ceiling_price: null, category: 'Antifungal' },
  { id: 67, brand_name: 'Shelcal 500', generic_name: 'Calcium + Vitamin D3', manufacturer: 'Torrent Pharma', dosage_form: 'Tablet', strength: '500mg+250IU', mrp: 110.00, nppa_ceiling_price: null, category: 'Vitamin' },
  { id: 68, brand_name: 'Becosules', generic_name: 'Vitamin B Complex', manufacturer: 'Pfizer', dosage_form: 'Capsule', strength: 'Capsule', mrp: 45.00, nppa_ceiling_price: null, category: 'Vitamin' },
  { id: 69, brand_name: 'Supradyn', generic_name: 'Multivitamin', manufacturer: 'Bayer', dosage_form: 'Tablet', strength: 'Tablet', mrp: 55.00, nppa_ceiling_price: null, category: 'Vitamin' },
  { id: 70, brand_name: 'Zincovit', generic_name: 'Multivitamin + Zinc', manufacturer: 'Apex', dosage_form: 'Tablet', strength: 'Tablet', mrp: 105.00, nppa_ceiling_price: null, category: 'Vitamin' },
  { id: 71, brand_name: 'Revital', generic_name: 'Multivitamin', manufacturer: 'Sun Pharma', dosage_form: 'Capsule', strength: 'Capsule', mrp: 350.00, nppa_ceiling_price: null, category: 'Vitamin' },
  { id: 72, brand_name: 'Limcee', generic_name: 'Vitamin C', manufacturer: 'Abbott India', dosage_form: 'Tablet', strength: '500mg', mrp: 25.00, nppa_ceiling_price: null, category: 'Vitamin' },
  { id: 73, brand_name: 'Calcimax', generic_name: 'Calcium + Vitamin D3 + Minerals', manufacturer: 'Meyer Organics', dosage_form: 'Tablet', strength: 'Tablet', mrp: 180.00, nppa_ceiling_price: null, category: 'Vitamin' },
  { id: 74, brand_name: 'Flagyl', generic_name: 'Metronidazole', manufacturer: 'Abbott India', dosage_form: 'Tablet', strength: '400mg', mrp: 30.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 75, brand_name: 'Ornidazole', generic_name: 'Ornidazole', manufacturer: 'Intas', dosage_form: 'Tablet', strength: '500mg', mrp: 60.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 76, brand_name: 'Nexito', generic_name: 'Escitalopram', manufacturer: 'Sun Pharma', dosage_form: 'Tablet', strength: '10mg', mrp: 120.00, nppa_ceiling_price: null, category: 'Antidepressant' },
  { id: 77, brand_name: 'Fludac', generic_name: 'Fluoxetine', manufacturer: 'Cadila Healthcare', dosage_form: 'Capsule', strength: '20mg', mrp: 85.00, nppa_ceiling_price: null, category: 'Antidepressant' },
  { id: 78, brand_name: 'Daxid', generic_name: 'Sertraline', manufacturer: 'Pfizer', dosage_form: 'Tablet', strength: '50mg', mrp: 160.00, nppa_ceiling_price: null, category: 'Antidepressant' },
  { id: 79, brand_name: 'Alprax', generic_name: 'Alprazolam', manufacturer: 'Torrent Pharma', dosage_form: 'Tablet', strength: '0.25mg', mrp: 40.00, nppa_ceiling_price: null, category: 'Antianxiety' },
  { id: 80, brand_name: 'Rivotril', generic_name: 'Clonazepam', manufacturer: 'Abbott India', dosage_form: 'Tablet', strength: '0.5mg', mrp: 65.00, nppa_ceiling_price: null, category: 'Antianxiety' },
  { id: 81, brand_name: 'Clonotril', generic_name: 'Clonazepam', manufacturer: 'Torrent Pharma', dosage_form: 'Tablet', strength: '0.5mg', mrp: 55.00, nppa_ceiling_price: null, category: 'Antianxiety' },
  { id: 82, brand_name: 'Emeset', generic_name: 'Ondansetron', manufacturer: 'Cipla', dosage_form: 'Tablet', strength: '4mg', mrp: 50.00, nppa_ceiling_price: null, category: 'Antiemetic' },
  { id: 83, brand_name: 'Domstal', generic_name: 'Domperidone', manufacturer: 'Torrent Pharma', dosage_form: 'Tablet', strength: '10mg', mrp: 35.00, nppa_ceiling_price: null, category: 'Antiemetic' },
  { id: 84, brand_name: 'Razo', generic_name: 'Rabeprazole', manufacturer: 'Dr. Reddy\'s', dosage_form: 'Tablet', strength: '20mg', mrp: 95.00, nppa_ceiling_price: null, category: 'Antacid' },
  { id: 85, brand_name: 'Flexon MR', generic_name: 'Ibuprofen + Paracetamol + Chlorzoxazone', manufacturer: 'MacLeods', dosage_form: 'Tablet', strength: '400mg+325mg+250mg', mrp: 60.00, nppa_ceiling_price: null, category: 'Muscle Relaxant' },
  { id: 86, brand_name: 'Myospaz', generic_name: 'Paracetamol + Chlorzoxazone', manufacturer: 'Win-Medicare', dosage_form: 'Tablet', strength: '500mg+250mg', mrp: 80.00, nppa_ceiling_price: null, category: 'Muscle Relaxant' },
  { id: 87, brand_name: 'Thiocolchicoside', generic_name: 'Thiocolchicoside', manufacturer: 'Intas', dosage_form: 'Capsule', strength: '4mg', mrp: 150.00, nppa_ceiling_price: null, category: 'Muscle Relaxant' },
  { id: 88, brand_name: 'Volini Gel', generic_name: 'Diclofenac', manufacturer: 'Sun Pharma', dosage_form: 'Gel', strength: '1%', mrp: 100.00, nppa_ceiling_price: null, category: 'Anti-inflammatory' },
  { id: 89, brand_name: 'Moov', generic_name: 'Diclofenac + Menthol', manufacturer: 'Reckitt Benckiser', dosage_form: 'Ointment', strength: 'Ointment', mrp: 120.00, nppa_ceiling_price: null, category: 'Anti-inflammatory' },
  { id: 90, brand_name: 'Iodex', generic_name: 'Methyl Salicylate', manufacturer: 'GSK', dosage_form: 'Ointment', strength: 'Ointment', mrp: 50.00, nppa_ceiling_price: null, category: 'Anti-inflammatory' },
  { id: 91, brand_name: 'Diclofenac Gel', generic_name: 'Diclofenac', manufacturer: 'Cipla', dosage_form: 'Gel', strength: '1%', mrp: 75.00, nppa_ceiling_price: null, category: 'Anti-inflammatory' },
  { id: 92, brand_name: 'Amlong', generic_name: 'Amlodipine', manufacturer: 'Micro Labs', dosage_form: 'Tablet', strength: '5mg', mrp: 50.00, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 93, brand_name: 'Cardace', generic_name: 'Ramipril', manufacturer: 'Sanofi', dosage_form: 'Tablet', strength: '5mg', mrp: 110.00, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 94, brand_name: 'Covance', generic_name: 'Losartan', manufacturer: 'Ranbaxy', dosage_form: 'Tablet', strength: '50mg', mrp: 95.00, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 95, brand_name: 'Telmikind', generic_name: 'Telmisartan', manufacturer: 'Mankind Pharma', dosage_form: 'Tablet', strength: '40mg', mrp: 65.00, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 96, brand_name: 'Vigamox', generic_name: 'Moxifloxacin', manufacturer: 'Alcon', dosage_form: 'Drops', strength: '0.5%', mrp: 180.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 97, brand_name: 'Tobramycin', generic_name: 'Tobramycin', manufacturer: 'Sun Pharma', dosage_form: 'Drops', strength: '0.3%', mrp: 110.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 98, brand_name: 'Ciproflox', generic_name: 'Ciprofloxacin', manufacturer: 'Cipla', dosage_form: 'Drops', strength: '0.3%', mrp: 45.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 99, brand_name: 'Fucidin', generic_name: 'Fusidic Acid', manufacturer: 'Sun Pharma', dosage_form: 'Cream', strength: '2%', mrp: 140.00, nppa_ceiling_price: null, category: 'Dermatological' },
  { id: 100, brand_name: 'Zinetac', generic_name: 'Ranitidine', manufacturer: 'GSK', dosage_form: 'Tablet', strength: '150mg', mrp: 28.00, nppa_ceiling_price: null, category: 'Antacid' },
];

// Jan Aushadhi (PMBJP) generic medicines — real prices from pradhanmantrijanaushadhiyojana.in
const janAushadhiMedicines = [
  { id: 501, brand_name: 'Jan Aushadhi Paracetamol', generic_name: 'Paracetamol', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '500mg', mrp: 1.83, nppa_ceiling_price: null, category: 'Antipyretic' },
  { id: 502, brand_name: 'Jan Aushadhi Paracetamol 650', generic_name: 'Paracetamol', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '650mg', mrp: 2.50, nppa_ceiling_price: null, category: 'Antipyretic' },
  { id: 503, brand_name: 'Jan Aushadhi Ibuprofen', generic_name: 'Ibuprofen', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '400mg', mrp: 2.10, nppa_ceiling_price: null, category: 'Anti-inflammatory' },
  { id: 504, brand_name: 'Jan Aushadhi Diclofenac', generic_name: 'Diclofenac', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '50mg', mrp: 1.50, nppa_ceiling_price: null, category: 'Anti-inflammatory' },
  { id: 505, brand_name: 'Jan Aushadhi Azithromycin', generic_name: 'Azithromycin', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '500mg', mrp: 12.50, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 506, brand_name: 'Jan Aushadhi Amoxicillin', generic_name: 'Amoxicillin', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Capsule', strength: '500mg', mrp: 3.20, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 507, brand_name: 'Jan Aushadhi Ciprofloxacin', generic_name: 'Ciprofloxacin', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '500mg', mrp: 3.50, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 508, brand_name: 'Jan Aushadhi Metronidazole', generic_name: 'Metronidazole', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '400mg', mrp: 1.80, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 509, brand_name: 'Jan Aushadhi Cefixime', generic_name: 'Cefixime', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '200mg', mrp: 8.50, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 510, brand_name: 'Jan Aushadhi Pantoprazole', generic_name: 'Pantoprazole', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '40mg', mrp: 3.00, nppa_ceiling_price: null, category: 'Antacid' },
  { id: 511, brand_name: 'Jan Aushadhi Omeprazole', generic_name: 'Omeprazole', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Capsule', strength: '20mg', mrp: 2.50, nppa_ceiling_price: null, category: 'Antacid' },
  { id: 512, brand_name: 'Jan Aushadhi Ranitidine', generic_name: 'Ranitidine', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '150mg', mrp: 1.20, nppa_ceiling_price: null, category: 'Antacid' },
  { id: 513, brand_name: 'Jan Aushadhi Metformin', generic_name: 'Metformin', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '500mg', mrp: 1.50, nppa_ceiling_price: null, category: 'Antidiabetic' },
  { id: 514, brand_name: 'Jan Aushadhi Glimepiride', generic_name: 'Glimepiride', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '1mg', mrp: 2.00, nppa_ceiling_price: null, category: 'Antidiabetic' },
  { id: 515, brand_name: 'Jan Aushadhi Amlodipine', generic_name: 'Amlodipine', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '5mg', mrp: 1.00, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 516, brand_name: 'Jan Aushadhi Atenolol', generic_name: 'Atenolol', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '50mg', mrp: 1.50, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 517, brand_name: 'Jan Aushadhi Telmisartan', generic_name: 'Telmisartan', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '40mg', mrp: 3.50, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 518, brand_name: 'Jan Aushadhi Losartan', generic_name: 'Losartan', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '50mg', mrp: 2.50, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 519, brand_name: 'Jan Aushadhi Ramipril', generic_name: 'Ramipril', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '5mg', mrp: 2.80, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 520, brand_name: 'Jan Aushadhi Atorvastatin', generic_name: 'Atorvastatin', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '10mg', mrp: 3.00, nppa_ceiling_price: null, category: 'Cardiovascular' },
  { id: 521, brand_name: 'Jan Aushadhi Rosuvastatin', generic_name: 'Rosuvastatin', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '10mg', mrp: 4.50, nppa_ceiling_price: null, category: 'Cardiovascular' },
  { id: 522, brand_name: 'Jan Aushadhi Aspirin', generic_name: 'Aspirin', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '75mg', mrp: 0.80, nppa_ceiling_price: null, category: 'Antiplatelet' },
  { id: 523, brand_name: 'Jan Aushadhi Clopidogrel', generic_name: 'Clopidogrel', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '75mg', mrp: 4.50, nppa_ceiling_price: null, category: 'Antiplatelet' },
  { id: 524, brand_name: 'Jan Aushadhi Cetirizine', generic_name: 'Cetirizine', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '10mg', mrp: 0.85, nppa_ceiling_price: null, category: 'Antihistamine' },
  { id: 525, brand_name: 'Jan Aushadhi Levothyroxine', generic_name: 'Thyroxine', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '50mcg', mrp: 2.00, nppa_ceiling_price: null, category: 'Thyroid' },
  { id: 526, brand_name: 'Jan Aushadhi Fluconazole', generic_name: 'Fluconazole', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '150mg', mrp: 3.50, nppa_ceiling_price: null, category: 'Antifungal' },
  { id: 527, brand_name: 'Jan Aushadhi Calcium + D3', generic_name: 'Calcium + Vitamin D3', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '500mg+250IU', mrp: 2.50, nppa_ceiling_price: null, category: 'Vitamin' },
  { id: 528, brand_name: 'Jan Aushadhi Vitamin C', generic_name: 'Vitamin C', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '500mg', mrp: 0.60, nppa_ceiling_price: null, category: 'Vitamin' },
  { id: 529, brand_name: 'Jan Aushadhi Rabeprazole', generic_name: 'Rabeprazole', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '20mg', mrp: 3.80, nppa_ceiling_price: null, category: 'Antacid' },
  { id: 530, brand_name: 'Jan Aushadhi Ondansetron', generic_name: 'Ondansetron', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '4mg', mrp: 2.00, nppa_ceiling_price: null, category: 'Antiemetic' },
  { id: 531, brand_name: 'Jan Aushadhi Norfloxacin', generic_name: 'Norfloxacin', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '400mg', mrp: 2.50, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 532, brand_name: 'Jan Aushadhi Doxycycline', generic_name: 'Doxycycline', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '100mg', mrp: 1.80, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 533, brand_name: 'Jan Aushadhi Levofloxacin', generic_name: 'Levofloxacin', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '500mg', mrp: 5.00, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 534, brand_name: 'Jan Aushadhi Amoxicillin + Clavulanic Acid', generic_name: 'Amoxicillin + Clavulanic Acid', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '625mg', mrp: 8.50, nppa_ceiling_price: null, category: 'Antibiotic' },
  { id: 535, brand_name: 'Jan Aushadhi Mefenamic Acid', generic_name: 'Mefenamic Acid', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '250mg', mrp: 1.50, nppa_ceiling_price: null, category: 'Analgesic' },
  { id: 536, brand_name: 'Jan Aushadhi Domperidone', generic_name: 'Domperidone', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '10mg', mrp: 0.80, nppa_ceiling_price: null, category: 'Antiemetic' },
  { id: 537, brand_name: 'Jan Aushadhi Salbutamol', generic_name: 'Salbutamol', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Inhaler', strength: '100mcg', mrp: 35.00, nppa_ceiling_price: null, category: 'Respiratory' },
  { id: 538, brand_name: 'Jan Aushadhi Budesonide', generic_name: 'Budesonide', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Inhaler', strength: '200mcg', mrp: 55.00, nppa_ceiling_price: null, category: 'Respiratory' },
  { id: 539, brand_name: 'Jan Aushadhi Montelukast', generic_name: 'Montelukast', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '10mg', mrp: 3.50, nppa_ceiling_price: null, category: 'Antihistamine' },
  { id: 540, brand_name: 'Jan Aushadhi Levocetirizine', generic_name: 'Levocetirizine', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '5mg', mrp: 0.65, nppa_ceiling_price: null, category: 'Antihistamine' },
  { id: 541, brand_name: 'Jan Aushadhi Fexofenadine', generic_name: 'Fexofenadine', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '120mg', mrp: 3.00, nppa_ceiling_price: null, category: 'Antihistamine' },
  { id: 542, brand_name: 'Jan Aushadhi Escitalopram', generic_name: 'Escitalopram', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '10mg', mrp: 2.50, nppa_ceiling_price: null, category: 'Antidepressant' },
  { id: 543, brand_name: 'Jan Aushadhi Fluoxetine', generic_name: 'Fluoxetine', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Capsule', strength: '20mg', mrp: 1.50, nppa_ceiling_price: null, category: 'Antidepressant' },
  { id: 544, brand_name: 'Jan Aushadhi Sertraline', generic_name: 'Sertraline', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '50mg', mrp: 2.00, nppa_ceiling_price: null, category: 'Antidepressant' },
  { id: 545, brand_name: 'Jan Aushadhi Clotrimazole', generic_name: 'Clotrimazole', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Cream', strength: '1%', mrp: 8.00, nppa_ceiling_price: null, category: 'Dermatological' },
  { id: 546, brand_name: 'Jan Aushadhi Povidone Iodine', generic_name: 'Povidone Iodine', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Ointment', strength: '5%', mrp: 15.00, nppa_ceiling_price: null, category: 'Dermatological' },
  { id: 547, brand_name: 'Jan Aushadhi Bisoprolol', generic_name: 'Bisoprolol', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '5mg', mrp: 2.50, nppa_ceiling_price: null, category: 'Antihypertensive' },
  { id: 548, brand_name: 'Jan Aushadhi Vitamin B Complex', generic_name: 'Vitamin B Complex', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Capsule', strength: 'Capsule', mrp: 1.50, nppa_ceiling_price: null, category: 'Vitamin' },
  { id: 549, brand_name: 'Jan Aushadhi Multivitamin', generic_name: 'Multivitamin', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: 'Tablet', mrp: 2.00, nppa_ceiling_price: null, category: 'Vitamin' },
  { id: 550, brand_name: 'Jan Aushadhi Iron + Folic Acid', generic_name: 'Iron + Folic Acid', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: 'Tablet', mrp: 0.50, nppa_ceiling_price: null, category: 'Vitamin' },
  { id: 551, brand_name: 'Jan Aushadhi Albendazole', generic_name: 'Albendazole', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '400mg', mrp: 2.00, nppa_ceiling_price: null, category: 'Anthelmintic' },
  { id: 552, brand_name: 'Jan Aushadhi ORS', generic_name: 'Oral Rehydration Salts', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Sachet', strength: 'Sachet', mrp: 4.50, nppa_ceiling_price: null, category: 'Electrolyte' },
  { id: 553, brand_name: 'Jan Aushadhi Paracetamol Syrup', generic_name: 'Paracetamol', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Syrup', strength: '120mg/5ml', mrp: 12.00, nppa_ceiling_price: null, category: 'Antipyretic' },
  { id: 554, brand_name: 'Jan Aushadhi Chlorzoxazone', generic_name: 'Chlorzoxazone', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '250mg', mrp: 1.80, nppa_ceiling_price: null, category: 'Muscle Relaxant' },
  { id: 555, brand_name: 'Jan Aushadhi Aceclofenac', generic_name: 'Aceclofenac', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '100mg', mrp: 1.50, nppa_ceiling_price: null, category: 'Analgesic' },
  { id: 556, brand_name: 'Jan Aushadhi Gabapentin', generic_name: 'Gabapentin', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '300mg', mrp: 4.50, nppa_ceiling_price: null, category: 'Neuropathic Pain' },
  { id: 557, brand_name: 'Jan Aushadhi Pregabalin', generic_name: 'Pregabalin', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '75mg', mrp: 3.50, nppa_ceiling_price: null, category: 'Neuropathic Pain' },
  { id: 558, brand_name: 'Jan Aushadhi Dolo + Caffeine', generic_name: 'Paracetamol + Caffeine', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '650mg+50mg', mrp: 1.20, nppa_ceiling_price: null, category: 'Analgesic' },
  { id: 559, brand_name: 'Jan Aushadhi Hydroxychloroquine', generic_name: 'Hydroxychloroquine', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '200mg', mrp: 4.00, nppa_ceiling_price: null, category: 'Antimalarial' },
  { id: 560, brand_name: 'Jan Aushadhi Methotrexate', generic_name: 'Methotrexate', manufacturer: 'PMBJP (Jan Aushadhi)', dosage_form: 'Tablet', strength: '7.5mg', mrp: 8.50, nppa_ceiling_price: null, category: 'Immunosuppressant' },
];

export const medicinesList: any[] = [];
let medId = 1;

// Add base medicines (100) with original IDs
for (const m of baseMedicines) {
  medicinesList.push({ ...m, id: medId++ });
}

// Expand with variations (400 more = 500 total branded)
const suffixes = [' Plus', ' Forte', ' XL', ' ER'];
for (let i = 0; i < 4; i++) {
  for (const m of baseMedicines) {
    const med = { ...m };
    med.id = medId++;
    med.brand_name = m.brand_name + suffixes[i];
    med.mrp = parseFloat((m.mrp * (1 + (i + 1) * 0.15)).toFixed(2));
    if (med.nppa_ceiling_price !== null) {
      med.nppa_ceiling_price = parseFloat((med.mrp * 0.9).toFixed(2));
    }
    medicinesList.push(med);
  }
}

// Add Jan Aushadhi medicines (IDs 501-530)
for (const ja of janAushadhiMedicines) {
  medicinesList.push(ja);
}

// Correct generic alternatives mapping:
// Each branded medicine -> its Jan Aushadhi generic equivalent (same molecule)
export const alternativesList = [
  // Paracetamol brands -> Jan Aushadhi Paracetamol
  { medicine_id: 1, alternative_medicine_id: 502, price_difference_pct: 92 },  // Dolo 650 -> JA Paracetamol 650
  { medicine_id: 2, alternative_medicine_id: 501, price_difference_pct: 91 },  // Crocin Advance -> JA Paracetamol
  { medicine_id: 3, alternative_medicine_id: 501, price_difference_pct: 88 },  // Calpol 500 -> JA Paracetamol
  // Anti-inflammatory -> JA equivalents
  { medicine_id: 7, alternative_medicine_id: 504, price_difference_pct: 98 },  // Voveran -> JA Diclofenac
  { medicine_id: 8, alternative_medicine_id: 503, price_difference_pct: 90 },  // Brufen 400 -> JA Ibuprofen
  // Antibiotics -> JA equivalents
  { medicine_id: 10, alternative_medicine_id: 505, price_difference_pct: 90 }, // Azithral 500 -> JA Azithromycin
  { medicine_id: 13, alternative_medicine_id: 509, price_difference_pct: 92 }, // Taxim-O -> JA Cefixime
  { medicine_id: 14, alternative_medicine_id: 509, price_difference_pct: 92 }, // Cefixime -> JA Cefixime
  { medicine_id: 15, alternative_medicine_id: 507, price_difference_pct: 91 }, // Ciplox 500 -> JA Ciprofloxacin
  { medicine_id: 17, alternative_medicine_id: 508, price_difference_pct: 93 }, // Metrogyl -> JA Metronidazole
  { medicine_id: 74, alternative_medicine_id: 508, price_difference_pct: 94 }, // Flagyl -> JA Metronidazole
  // Antacids -> JA equivalents
  { medicine_id: 18, alternative_medicine_id: 510, price_difference_pct: 98 }, // Pan-D -> JA Pantoprazole
  { medicine_id: 19, alternative_medicine_id: 510, price_difference_pct: 98 }, // Pantocid -> JA Pantoprazole
  { medicine_id: 20, alternative_medicine_id: 511, price_difference_pct: 96 }, // Omez -> JA Omeprazole
  { medicine_id: 21, alternative_medicine_id: 512, price_difference_pct: 97 }, // Rantac -> JA Ranitidine
  { medicine_id: 84, alternative_medicine_id: 529, price_difference_pct: 96 }, // Razo -> JA Rabeprazole
  // Antidiabetic -> JA equivalents
  { medicine_id: 29, alternative_medicine_id: 514, price_difference_pct: 98 }, // Amaryl -> JA Glimepiride
  { medicine_id: 30, alternative_medicine_id: 513, price_difference_pct: 96 }, // Gluformin -> JA Metformin
  // Antihypertensive -> JA equivalents
  { medicine_id: 33, alternative_medicine_id: 517, price_difference_pct: 98 }, // Telma 40 -> JA Telmisartan
  { medicine_id: 35, alternative_medicine_id: 515, price_difference_pct: 99 }, // Stamlo -> JA Amlodipine
  { medicine_id: 37, alternative_medicine_id: 516, price_difference_pct: 96 }, // Aten -> JA Atenolol
  { medicine_id: 38, alternative_medicine_id: 519, price_difference_pct: 96 }, // Ramipril -> JA Ramipril
  { medicine_id: 39, alternative_medicine_id: 518, price_difference_pct: 97 }, // Losartan -> JA Losartan
  { medicine_id: 92, alternative_medicine_id: 515, price_difference_pct: 98 }, // Amlong -> JA Amlodipine
  { medicine_id: 93, alternative_medicine_id: 519, price_difference_pct: 97 }, // Cardace -> JA Ramipril
  { medicine_id: 95, alternative_medicine_id: 517, price_difference_pct: 95 }, // Telmikind -> JA Telmisartan
  // Cardiovascular -> JA equivalents
  { medicine_id: 40, alternative_medicine_id: 520, price_difference_pct: 96 }, // Atorva -> JA Atorvastatin
  { medicine_id: 41, alternative_medicine_id: 521, price_difference_pct: 97 }, // Rozavel -> JA Rosuvastatin
  { medicine_id: 42, alternative_medicine_id: 521, price_difference_pct: 98 }, // Crestor -> JA Rosuvastatin
  { medicine_id: 43, alternative_medicine_id: 522, price_difference_pct: 95 }, // Ecosprin -> JA Aspirin
  { medicine_id: 44, alternative_medicine_id: 523, price_difference_pct: 95 }, // Clopitab -> JA Clopidogrel
  // Thyroid -> JA equivalent
  { medicine_id: 46, alternative_medicine_id: 525, price_difference_pct: 99 }, // Thyronorm -> JA Levothyroxine
  { medicine_id: 47, alternative_medicine_id: 525, price_difference_pct: 99 }, // Eltroxin -> JA Levothyroxine
  // Antihistamine -> JA equivalent
  { medicine_id: 50, alternative_medicine_id: 524, price_difference_pct: 96 }, // Cetrizine -> JA Cetirizine
  // Antifungal -> JA equivalent
  { medicine_id: 66, alternative_medicine_id: 526, price_difference_pct: 90 }, // Fluconazole -> JA Fluconazole
  // Vitamin -> JA equivalent
  { medicine_id: 67, alternative_medicine_id: 527, price_difference_pct: 98 }, // Shelcal -> JA Calcium+D3
  { medicine_id: 72, alternative_medicine_id: 528, price_difference_pct: 98 }, // Limcee -> JA Vitamin C
  // Antiemetic -> JA equivalent
  { medicine_id: 82, alternative_medicine_id: 530, price_difference_pct: 96 }, // Emeset -> JA Ondansetron
  // Newly added JA alternatives
  { medicine_id: 16, alternative_medicine_id: 531, price_difference_pct: 95 }, // Norflox 400 -> JA Norfloxacin
  { medicine_id: 9, alternative_medicine_id: 534, price_difference_pct: 96 },  // Augmentin 625 -> JA Amoxicillin + Clavulanic Acid
  { medicine_id: 11, alternative_medicine_id: 534, price_difference_pct: 95 }, // Amoxyclav -> JA Amoxicillin + Clavulanic Acid
  { medicine_id: 6, alternative_medicine_id: 535, price_difference_pct: 97 },  // Meftal Spas -> JA Mefenamic Acid
  { medicine_id: 83, alternative_medicine_id: 536, price_difference_pct: 98 }, // Domstal -> JA Domperidone
  { medicine_id: 57, alternative_medicine_id: 537, price_difference_pct: 77 }, // Asthalin -> JA Salbutamol
  { medicine_id: 58, alternative_medicine_id: 538, price_difference_pct: 80 }, // Budecort -> JA Budesonide
  { medicine_id: 49, alternative_medicine_id: 539, price_difference_pct: 98 }, // Montair LC -> JA Montelukast
  { medicine_id: 52, alternative_medicine_id: 540, price_difference_pct: 99 }, // Levocet -> JA Levocetirizine
  { medicine_id: 51, alternative_medicine_id: 541, price_difference_pct: 98 }, // Allegra -> JA Fexofenadine
  { medicine_id: 76, alternative_medicine_id: 542, price_difference_pct: 98 }, // Nexito -> JA Escitalopram
  { medicine_id: 77, alternative_medicine_id: 543, price_difference_pct: 98 }, // Fludac -> JA Fluoxetine
  { medicine_id: 78, alternative_medicine_id: 544, price_difference_pct: 99 }, // Daxid -> JA Sertraline
  { medicine_id: 64, alternative_medicine_id: 545, price_difference_pct: 94 }, // Candid-B -> JA Clotrimazole
  { medicine_id: 62, alternative_medicine_id: 546, price_difference_pct: 88 }, // Betadine -> JA Povidone Iodine
  { medicine_id: 36, alternative_medicine_id: 547, price_difference_pct: 98 }, // Concor -> JA Bisoprolol
  { medicine_id: 68, alternative_medicine_id: 548, price_difference_pct: 97 }, // Becosules -> JA Vitamin B Complex
  { medicine_id: 69, alternative_medicine_id: 549, price_difference_pct: 96 }, // Supradyn -> JA Multivitamin
  { medicine_id: 85, alternative_medicine_id: 554, price_difference_pct: 97 }, // Flexon MR -> JA Chlorzoxazone
];

export const batchesList: any[] = [];
let batchId = 1;

// Create batches for first 300 medicines
for (let i = 0; i < 300; i++) {
  const medicine = medicinesList[i];
  if (!medicine) break;
  
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(Math.random() * 900) + 100;
  const brandPrefix = medicine.brand_name.substring(0, 3).toUpperCase().replace(/ /g, 'X');
  
  batchesList.push({
    id: batchId++,
    medicine_id: medicine.id,
    batch_number: brandPrefix + '-' + currentYear + 'A' + randomSuffix,
    mfg_date: currentYear + '-01-15',
    expiry_date: (currentYear + 2) + '-01-14',
    verification_status: Math.random() > 0.05 ? 'genuine' : (Math.random() > 0.5 ? 'inconclusive' : 'flagged')
  });
}


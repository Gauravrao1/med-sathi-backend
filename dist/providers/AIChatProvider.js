import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { like, or } from 'drizzle-orm';
import { GoogleGenerativeAI } from '@google/generative-ai';
const DISCLAIMER = '\n\n⚠️ This is not medical advice. Please consult a doctor for personalized guidance.';
// Built-in medicine knowledge base for common Indian medicines
const MEDICINE_KNOWLEDGE = {
    'paracetamol': {
        uses: 'Paracetamol is used to relieve mild to moderate pain (headaches, muscle aches, toothaches, backache) and reduce fever. It is one of the most commonly used over-the-counter medicines in India.',
        sideEffects: 'Common side effects are rare at recommended doses. Overdose can cause serious liver damage. Some people may experience nausea, skin rash, or allergic reactions.',
        howItWorks: 'Paracetamol works by blocking the production of prostaglandins in the brain, which are chemicals that cause pain and fever. Unlike NSAIDs, it does not reduce inflammation significantly.',
        warnings: 'Do not exceed 4g (4000mg) per day. Avoid alcohol while taking paracetamol. People with liver disease should use with caution. Not recommended for long-term use without medical supervision.',
        storage: 'Store below 30°C in a dry place away from direct sunlight. Keep out of reach of children.'
    },
    'amoxicillin': {
        uses: 'Amoxicillin is a penicillin-type antibiotic used to treat bacterial infections including ear infections, urinary tract infections, skin infections, dental infections, and respiratory tract infections.',
        sideEffects: 'Common side effects include diarrhea, nausea, vomiting, and skin rash. Allergic reactions (hives, swelling, difficulty breathing) require immediate medical attention.',
        howItWorks: 'Amoxicillin works by preventing bacteria from forming cell walls, which is essential for their survival. This causes the bacteria to die and clears the infection.',
        warnings: 'Always complete the full course as prescribed. Do not use if allergic to penicillin. May reduce effectiveness of oral contraceptives. Can cause antibiotic-associated diarrhea.',
        storage: 'Store below 25°C. Reconstituted suspension should be refrigerated and used within 14 days.'
    },
    'clavulanate': {
        uses: 'Clavulanate is combined with Amoxicillin (as Augmentin/Co-amoxiclav) to treat infections caused by bacteria that are resistant to amoxicillin alone, including sinusitis, pneumonia, and UTIs.',
        sideEffects: 'Diarrhea, nausea, vomiting, and skin rash. Hepatic dysfunction has been reported rarely. Candidiasis (yeast infections) may occur.',
        howItWorks: 'Clavulanate inhibits beta-lactamase enzymes produced by resistant bacteria, allowing amoxicillin to work effectively against a wider range of bacteria.',
        warnings: 'Take with food to reduce GI side effects. Monitor liver function during prolonged use. Complete the full course of antibiotics.',
        storage: 'Store below 25°C. Protect from moisture.'
    },
    'azithromycin': {
        uses: 'Azithromycin is a macrolide antibiotic used to treat respiratory infections, ear infections, skin infections, sexually transmitted infections, and traveler\'s diarrhea. Known by brands like Azithral and Zithromax.',
        sideEffects: 'Common: diarrhea, nausea, abdominal pain, vomiting. Rare but serious: heart rhythm changes (QT prolongation), liver problems, hearing changes.',
        howItWorks: 'Azithromycin stops bacterial growth by blocking protein synthesis. It concentrates in tissues and has a long half-life, allowing shorter treatment courses (usually 3-5 days).',
        warnings: 'Avoid in patients with known QT prolongation or liver disease. Does not work against viral infections like cold or flu. Take on empty stomach for best absorption.',
        storage: 'Store at room temperature (15-30°C). Keep away from moisture and heat.'
    },
    'pantoprazole': {
        uses: 'Pantoprazole (Pan-D, Pantocid) is a proton pump inhibitor (PPI) used to treat gastroesophageal reflux disease (GERD), peptic ulcers, Zollinger-Ellison syndrome, and excess stomach acid production.',
        sideEffects: 'Headache, diarrhea, nausea, stomach pain, gas. Long-term use may cause vitamin B12 deficiency, bone fractures, magnesium deficiency, and increased risk of gut infections.',
        howItWorks: 'Pantoprazole reduces stomach acid production by irreversibly blocking the hydrogen-potassium ATPase enzyme (proton pump) in stomach lining cells.',
        warnings: 'Not recommended for more than 8 weeks without medical supervision. Long-term use associated with bone density loss. Take 30-60 minutes before meals.',
        storage: 'Store below 30°C. Protect from moisture. Do not crush or chew enteric-coated tablets.'
    },
    'atorvastatin': {
        uses: 'Atorvastatin (Atorva, Lipitor) is a statin used to lower cholesterol and triglycerides in the blood, reducing the risk of heart attack, stroke, and cardiovascular disease.',
        sideEffects: 'Muscle pain and weakness (myalgia), headache, joint pain, digestive problems. Rare: rhabdomyolysis (severe muscle breakdown), liver damage.',
        howItWorks: 'Atorvastatin inhibits HMG-CoA reductase, the enzyme that controls cholesterol production in the liver. This lowers LDL (bad cholesterol) and increases HDL (good cholesterol).',
        warnings: 'Avoid grapefruit juice. Report unexplained muscle pain immediately. Regular liver function tests recommended. Not safe during pregnancy.',
        storage: 'Store at room temperature (20-25°C). Protect from light and moisture.'
    },
    'telmisartan': {
        uses: 'Telmisartan (Telma, Telmikind) is an ARB used to treat high blood pressure (hypertension) and reduce cardiovascular risk in high-risk patients. Also helps protect kidneys in diabetic patients.',
        sideEffects: 'Dizziness, back pain, diarrhea, sinus infection. Rare: hyperkalemia (high potassium), kidney problems, angioedema.',
        howItWorks: 'Telmisartan blocks angiotensin II receptors, preventing blood vessel constriction. This relaxes blood vessels and lowers blood pressure, reducing strain on the heart.',
        warnings: 'Do not use during pregnancy. Monitor potassium levels. May cause dizziness — avoid driving initially. Do not use with aliskiren in diabetic patients.',
        storage: 'Store below 30°C. Protect from moisture. Do not remove from blister until use.'
    },
    'metformin': {
        uses: 'Metformin (Glycomet, Glucophage) is the first-line medication for Type 2 diabetes. It helps control blood sugar levels and may help with weight management.',
        sideEffects: 'Common: nausea, diarrhea, stomach upset, metallic taste. These often improve with time. Rare but serious: lactic acidosis (especially with kidney problems).',
        howItWorks: 'Metformin reduces glucose production by the liver, improves insulin sensitivity in muscles, and delays glucose absorption from the intestines.',
        warnings: 'Take with food to reduce GI side effects. Stop before contrast dye procedures. Avoid excessive alcohol. Not recommended with severe kidney or liver disease.',
        storage: 'Store below 30°C. Protect from light and moisture.'
    },
    'cetirizine': {
        uses: 'Cetirizine (Cetzine, Zyrtec) is an antihistamine used for allergic rhinitis (hay fever), urticaria (hives), allergic conjunctivitis, and itchy skin conditions.',
        sideEffects: 'Drowsiness (less than first-generation antihistamines), dry mouth, headache, fatigue, dizziness.',
        howItWorks: 'Cetirizine blocks histamine H1 receptors, preventing the allergic response that causes sneezing, itching, watery eyes, and runny nose.',
        warnings: 'May cause drowsiness — use caution when driving. Avoid alcohol. Dose adjustment needed for kidney impairment. Generally safe for long-term use.',
        storage: 'Store below 30°C in a cool, dry place.'
    },
    'omeprazole': {
        uses: 'Omeprazole (Omez) is a proton pump inhibitor for acid reflux, GERD, stomach ulcers, and H. pylori eradication (with antibiotics).',
        sideEffects: 'Headache, stomach pain, nausea, diarrhea, gas. Long-term: vitamin B12 and magnesium deficiency, bone fracture risk.',
        howItWorks: 'Blocks the proton pump in stomach parietal cells, reducing acid secretion by up to 90%. Takes 1-4 days for full effect.',
        warnings: 'Take 30 minutes before breakfast. Do not crush capsules. Short-term use preferred. Long-term use needs medical monitoring.',
        storage: 'Store below 25°C in a dry place. Protect from light.'
    },
    'ibuprofen': {
        uses: 'Ibuprofen (Brufen, Combiflam) is an NSAID used for pain relief, inflammation reduction, and fever. Effective for headaches, dental pain, menstrual cramps, arthritis, and muscle injuries.',
        sideEffects: 'Stomach upset, nausea, heartburn, dizziness. Risk of stomach ulcers and bleeding with long-term use. May affect kidney function.',
        howItWorks: 'Inhibits COX-1 and COX-2 enzymes, reducing prostaglandin production which causes pain, inflammation, and fever.',
        warnings: 'Take with food to reduce stomach irritation. Avoid in last trimester of pregnancy. Not recommended with aspirin or other NSAIDs. Use caution in asthma patients.',
        storage: 'Store below 30°C. Protect from moisture.'
    },
    'ciprofloxacin': {
        uses: 'Ciprofloxacin (Ciplox) is a fluoroquinolone antibiotic for UTIs, respiratory infections, bone and joint infections, skin infections, and certain types of diarrhea.',
        sideEffects: 'Nausea, diarrhea, dizziness, headache. Serious: tendon rupture, nerve damage, QT prolongation, C. difficile infection.',
        howItWorks: 'Inhibits bacterial DNA gyrase and topoisomerase IV, preventing DNA replication and killing bacteria.',
        warnings: 'FDA black box warning for tendon rupture risk. Avoid in children under 18. Do not take with dairy or calcium supplements. Stay hydrated.',
        storage: 'Store at 20-25°C. Protect from light.'
    },
    'amlodipine': {
        uses: 'Amlodipine (Amlopress, Stamlo) is a calcium channel blocker for hypertension and angina (chest pain). Often used in combination with other BP medicines.',
        sideEffects: 'Ankle swelling, dizziness, flushing, headache, fatigue. Usually mild and dose-dependent.',
        howItWorks: 'Blocks calcium channels in blood vessel walls and heart muscle, causing blood vessels to relax and widen, lowering blood pressure.',
        warnings: 'Do not stop suddenly. May cause dizziness — change positions slowly. Avoid grapefruit. Report excessive swelling.',
        storage: 'Store at 15-30°C. Protect from light and moisture.'
    },
    'montelukast': {
        uses: 'Montelukast (Montair, Singulair) is used for asthma prevention and allergic rhinitis. It helps prevent wheezing, shortness of breath, and allergy symptoms.',
        sideEffects: 'Headache, stomach pain, fatigue. Rare: mood changes, depression, suicidal thoughts (FDA warning), sleep problems.',
        howItWorks: 'Blocks leukotriene receptors, reducing inflammation, bronchoconstriction, and mucus production in airways.',
        warnings: 'Not for acute asthma attacks. FDA neuropsychiatric warning — monitor for mood changes. Take in the evening for asthma.',
        storage: 'Store at 25°C. Protect from moisture and light.'
    }
};
// General health topics for questions without medicine context
const GENERAL_TOPICS = {
    'fever': 'Fever is the body\'s natural response to infection. For adults, a temperature above 100.4°F (38°C) is considered fever. Common causes include viral infections, bacterial infections, and inflammatory conditions. Rest, hydration, and paracetamol can help manage mild fevers. Seek medical attention if fever exceeds 103°F, lasts more than 3 days, or is accompanied by severe symptoms.',
    'headache': 'Headaches can be caused by tension, dehydration, eye strain, sinus issues, or migraines. For occasional headaches, paracetamol or ibuprofen may help. Stay hydrated, rest in a dark room, and apply cold compresses. Frequent or severe headaches should be evaluated by a doctor.',
    'cold': 'Common cold is caused by viruses (usually rhinoviruses). Symptoms include runny nose, sneezing, sore throat, and mild cough. Rest, warm fluids, steam inhalation, and symptomatic relief with antihistamines or decongestants help. Antibiotics are NOT effective against colds. See a doctor if symptoms worsen after 7-10 days.',
    'diabetes': 'Type 2 diabetes is managed with lifestyle changes (diet, exercise) and medications like Metformin. Regular blood sugar monitoring (fasting, post-meal, HbA1c) is essential. Target HbA1c is usually below 7%. Jan Aushadhi stores offer affordable diabetes medicines like Metformin at Rs. 10-30 per strip.',
    'blood pressure': 'Normal blood pressure is below 120/80 mmHg. Hypertension (high BP) is a silent condition that increases risk of heart disease and stroke. It is managed with medicines like Telmisartan, Amlodipine, and lifestyle changes. Regular monitoring, low-salt diet, exercise, and medication adherence are key.',
    'acidity': 'Acidity or acid reflux occurs when stomach acid flows back into the esophagus. Causes include spicy food, stress, irregular meals, and obesity. Antacids provide quick relief. PPIs like Pantoprazole or Omeprazole reduce acid production. Eating smaller meals and avoiding lying down after eating helps.',
    'allergy': 'Allergies occur when the immune system overreacts to harmless substances (pollen, dust, food). Antihistamines like Cetirizine or Levocetirizine provide relief. For severe allergies (anaphylaxis), epinephrine is needed. Identify and avoid triggers. Nasal sprays help with allergic rhinitis.',
    'antibiotic': 'Antibiotics treat bacterial infections, NOT viral ones (colds, flu). Always complete the full prescribed course. Do not share antibiotics. Overuse leads to antibiotic resistance — a growing problem in India. Common antibiotics include Amoxicillin, Azithromycin, and Ciprofloxacin.',
    'generic': 'Generic medicines contain the same active ingredient, strength, and dosage form as branded medicines but cost 30-80% less. They are equally safe and effective — approved by CDSCO (India\'s FDA equivalent). Jan Aushadhi Kendras sell quality generics at affordable prices under the government\'s PMBJP scheme.',
    'jan aushadhi': 'Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) offers quality generic medicines at affordable prices. Over 9,000+ Jan Aushadhi Kendras operate across India. Medicines are 50-90% cheaper than branded equivalents. You can find your nearest store on the PMBJP app or website.',
    'expiry': 'Medicine expiry dates indicate the last date the manufacturer guarantees full potency and safety. Never take expired medicines — they may be less effective or potentially harmful. Most medicines are stable for 2-3 years from manufacture. Store properly (cool, dry, away from sunlight) to maintain effectiveness.',
    'side effect': 'Side effects are unintended reactions to medicines. Common ones are usually mild (nausea, headache, drowsiness). Report serious side effects to your doctor immediately. You can also report adverse drug reactions to CDSCO through the PvPI (Pharmacovigilance Programme of India) at 1800-180-3024.'
};
export class MockAIChatProvider {
    async chat(messages, medicineContext) {
        const lastMessage = messages[messages.length - 1].content.toLowerCase().trim();
        const messageCount = messages.filter(m => m.role === 'user').length;
        // Safety check — refuse dosage/diagnosis/switching questions
        const unsafeKeywords = ['dosage', 'dose', 'how much should i take', 'how many tablets', 'diagnosis', 'diagnose',
            'prescribe', 'stop taking', 'can i take with'];
        if (unsafeKeywords.some(kw => lastMessage.includes(kw))) {
            return 'I cannot provide dosage recommendations, diagnosis, or drug interaction advice. These are personalized decisions that require a qualified healthcare professional who knows your medical history.\n\nPlease consult your doctor or call the CDSCO helpline at 1800-11-1454 for guidance.' + DISCLAIMER;
        }
        // Greetings
        if (messageCount === 1 && (lastMessage.match(/^(hi|hello|hey|namaste|hola)/))) {
            if (medicineContext) {
                return 'Hello! I\'m Aslee AI, your medicine information assistant. 👋\n\nI see you\'re looking at ' + medicineContext.brand_name + ' (' + medicineContext.generic_name + '). I can help you with:\n\n• What this medicine is used for\n• Side effects to watch for\n• How it works in your body\n• Price comparison with generics\n• Storage instructions\n\nWhat would you like to know?' + DISCLAIMER;
            }
            return 'Hello! I\'m Aslee AI, your medicine information assistant. 👋\n\nI can help you with:\n• Information about any medicine\n• Understanding generic vs branded medicines\n• Finding affordable alternatives\n• General health topics\n• Jan Aushadhi scheme details\n\nAsk me anything about medicines!' + DISCLAIMER;
        }
        // Try to find medicine knowledge from the query
        let knowledgeKey = this.findKnowledgeKey(lastMessage);
        // If we have medicine context, use it
        if (medicineContext) {
            // Check if generic name matches a knowledge entry
            const genericLower = medicineContext.generic_name.toLowerCase();
            for (const key of Object.keys(MEDICINE_KNOWLEDGE)) {
                if (genericLower.includes(key)) {
                    knowledgeKey = key;
                    break;
                }
            }
            const knowledge = knowledgeKey ? MEDICINE_KNOWLEDGE[knowledgeKey] : null;
            // Uses / what is it for
            if (lastMessage.match(/use|for what|what.*for|treat|cure|purpose|why.*take|indication|kya.*kaam|kiske liye/)) {
                if (knowledge) {
                    return '💊 **' + medicineContext.brand_name + ' (' + medicineContext.generic_name + ')**\n\n' + knowledge.uses + '\n\nStrength: ' + medicineContext.strength + '\nDosage form: ' + medicineContext.dosage_form + '\nCategory: ' + medicineContext.category + DISCLAIMER;
                }
                return '💊 **' + medicineContext.brand_name + '** contains ' + medicineContext.generic_name + ' (' + medicineContext.strength + ').\n\nIt belongs to the ' + medicineContext.category + ' category and is manufactured by ' + medicineContext.manufacturer + '. For specific usage information, please consult your doctor or pharmacist.' + DISCLAIMER;
            }
            // Side effects
            if (lastMessage.match(/side.*effect|reaction|harm|danger|risk|safe|nuksan/)) {
                if (knowledge) {
                    return '⚡ **Side Effects of ' + medicineContext.brand_name + ':**\n\n' + knowledge.sideEffects + '\n\n📞 Report serious side effects to CDSCO PvPI helpline: 1800-180-3024' + DISCLAIMER;
                }
                return 'Side effects vary by individual. Common mild effects may include nausea, headache, or digestive discomfort. For specific side effect information about ' + medicineContext.brand_name + ', please check the medicine leaflet or consult your pharmacist.\n\n📞 Report adverse reactions: CDSCO PvPI helpline 1800-180-3024' + DISCLAIMER;
            }
            // How it works / mechanism
            if (lastMessage.match(/how.*work|mechanism|kaise.*kaam|body.*mein/)) {
                if (knowledge) {
                    return '🔬 **How ' + medicineContext.brand_name + ' works:**\n\n' + knowledge.howItWorks + DISCLAIMER;
                }
                return '🔬 ' + medicineContext.brand_name + ' contains the active ingredient ' + medicineContext.generic_name + '. It is a ' + medicineContext.dosage_form.toLowerCase() + ' that works to address conditions in the ' + medicineContext.category + ' category. For the detailed mechanism, consult your pharmacist.' + DISCLAIMER;
            }
            // Warnings / precautions
            if (lastMessage.match(/warning|precaution|careful|avoid|caution|savdhani/)) {
                if (knowledge) {
                    return '⚠️ **Warnings for ' + medicineContext.brand_name + ':**\n\n' + knowledge.warnings + DISCLAIMER;
                }
                return '⚠️ General precautions for ' + medicineContext.brand_name + ':\n\n• Take as directed by your doctor\n• Do not exceed the recommended dose\n• Inform your doctor about other medications\n• Read the package insert carefully\n• Store properly as directed' + DISCLAIMER;
            }
            // Storage
            if (lastMessage.match(/stor|keep|temperature|rakh/)) {
                if (knowledge) {
                    return '📦 **Storage for ' + medicineContext.brand_name + ':**\n\n' + knowledge.storage + DISCLAIMER;
                }
                return '📦 **Storage for ' + medicineContext.brand_name + ':**\n\nStore in a cool, dry place below 30°C. Protect from direct sunlight and moisture. Keep out of reach of children. Do not use after the expiry date printed on the package.' + DISCLAIMER;
            }
            // Price / cost
            if (lastMessage.match(/price|cost|expensive|cheap|kitna|paisa|rupee|rs|mrp|afford/)) {
                let response = '💰 **Pricing for ' + medicineContext.brand_name + ':**\n\n• MRP: ₹' + medicineContext.mrp.toFixed(2);
                if (medicineContext.nppa_ceiling_price) {
                    response += '\n• NPPA Ceiling Price: ₹' + medicineContext.nppa_ceiling_price.toFixed(2);
                    if (medicineContext.mrp > medicineContext.nppa_ceiling_price) {
                        response += '\n\n🔴 This medicine is priced ABOVE the government ceiling price. This may indicate overpricing.';
                    }
                    else {
                        response += '\n\n🟢 This medicine is within the government price ceiling.';
                    }
                }
                response += '\n\n💡 **Tip:** Ask your pharmacist for the generic version (' + medicineContext.generic_name + ') which may cost 50-80% less. Check your nearest Jan Aushadhi Kendra for affordable alternatives.';
                return response + DISCLAIMER;
            }
            // Manufacturer
            if (lastMessage.match(/manufactur|who.*make|company|brand|kaun.*banata/)) {
                return '🏭 **Manufacturer:** ' + medicineContext.brand_name + ' is manufactured by **' + medicineContext.manufacturer + '**.\n\nYou can verify the manufacturer and drug license details on the CDSCO website (cdsco.gov.in).' + DISCLAIMER;
            }
            // Generic / composition / salt
            if (lastMessage.match(/generic|composition|salt|ingredient|contain|formula/)) {
                return '🧪 **Composition of ' + medicineContext.brand_name + ':**\n\nActive ingredient: **' + medicineContext.generic_name + '**\nStrength: ' + medicineContext.strength + '\nDosage form: ' + medicineContext.dosage_form + '\n\n💡 You can ask for the generic name "' + medicineContext.generic_name + '" at any pharmacy. Jan Aushadhi Kendras specifically stock affordable generic medicines under the government\'s PMBJP scheme.' + DISCLAIMER;
            }
            // Expiry
            if (lastMessage.match(/expir|expire|shelf life|validity|kab.*khatam/)) {
                return '📅 **Expiry Information:**\n\nAlways check the expiry date on the strip/box of ' + medicineContext.brand_name + '. Typically, medicines have a shelf life of 2-3 years from manufacturing.\n\n⚠️ Never consume expired medicines. They may lose effectiveness or become harmful. Return expired medicines to your pharmacy for safe disposal.' + DISCLAIMER;
            }
            // General/default with context — give different responses based on conversation length
            if (messageCount <= 2) {
                return 'Here\'s a quick overview of **' + medicineContext.brand_name + '**:\n\n• **Generic name:** ' + medicineContext.generic_name + '\n• **Strength:** ' + medicineContext.strength + '\n• **Form:** ' + medicineContext.dosage_form + '\n• **Category:** ' + medicineContext.category + '\n• **Manufacturer:** ' + medicineContext.manufacturer + '\n• **MRP:** ₹' + medicineContext.mrp.toFixed(2) + (medicineContext.nppa_ceiling_price ? '\n• **NPPA Ceiling:** ₹' + medicineContext.nppa_ceiling_price.toFixed(2) : '') + '\n\nYou can ask me about its uses, side effects, how it works, pricing, generic alternatives, or storage instructions.' + DISCLAIMER;
            }
            return 'I can tell you more about ' + medicineContext.brand_name + '. Try asking:\n\n• "What is it used for?"\n• "What are the side effects?"\n• "How does it work?"\n• "Is there a cheaper generic?"\n• "What precautions should I take?"\n• "How should I store it?"' + DISCLAIMER;
        }
        // No medicine context — try to answer from knowledge base or general topics
        // Check if asking about a specific medicine by name
        if (knowledgeKey && MEDICINE_KNOWLEDGE[knowledgeKey]) {
            const knowledge = MEDICINE_KNOWLEDGE[knowledgeKey];
            if (lastMessage.match(/use|for what|what.*for|treat/)) {
                return '💊 **' + knowledgeKey.charAt(0).toUpperCase() + knowledgeKey.slice(1) + ':**\n\n' + knowledge.uses + DISCLAIMER;
            }
            if (lastMessage.match(/side.*effect|reaction/)) {
                return '⚡ **Side Effects of ' + knowledgeKey.charAt(0).toUpperCase() + knowledgeKey.slice(1) + ':**\n\n' + knowledge.sideEffects + DISCLAIMER;
            }
            if (lastMessage.match(/how.*work/)) {
                return '🔬 ' + knowledge.howItWorks + DISCLAIMER;
            }
            // General info about the medicine
            return '💊 **' + knowledgeKey.charAt(0).toUpperCase() + knowledgeKey.slice(1) + ':**\n\n' + knowledge.uses + '\n\n⚡ **Side Effects:** ' + knowledge.sideEffects + DISCLAIMER;
        }
        // Check general health topics
        for (const [topic, info] of Object.entries(GENERAL_TOPICS)) {
            if (lastMessage.includes(topic)) {
                return info + DISCLAIMER;
            }
        }
        // Try to search DB for medicine name mentioned
        const dbMatch = await this.searchMedicineInMessage(lastMessage);
        if (dbMatch) {
            return 'I found **' + dbMatch.brand_name + '** in our database:\n\n• **Generic:** ' + dbMatch.generic_name + '\n• **Strength:** ' + dbMatch.strength + '\n• **Manufacturer:** ' + dbMatch.manufacturer + '\n• **MRP:** ₹' + dbMatch.mrp.toFixed(2) + (dbMatch.nppa_ceiling_price ? '\n• **NPPA Ceiling:** ₹' + dbMatch.nppa_ceiling_price.toFixed(2) : '') + '\n\nScan this medicine to get full verification details including trust score and generic alternatives!' + DISCLAIMER;
        }
        // Thank you / bye
        if (lastMessage.match(/thank|thanks|shukriya|dhanyavad|bye|goodbye/)) {
            return 'You\'re welcome! Stay healthy and always verify your medicines. 💚\n\nRemember:\n• Buy from licensed pharmacies\n• Check expiry dates\n• Consider Jan Aushadhi generics to save money\n• Report suspicious medicines to CDSCO\n\nCome back anytime you need medicine information!';
        }
        // Help
        if (lastMessage.match(/help|kya.*kar|what.*can|feature/)) {
            return '🏥 **How I can help you:**\n\n1️⃣ **Medicine Information** — Ask about any common medicine (uses, side effects, warnings)\n2️⃣ **Price Check** — Compare MRP with government ceiling prices\n3️⃣ **Generic Alternatives** — Find cheaper generic versions\n4️⃣ **Health Topics** — Fever, diabetes, blood pressure, allergies, etc.\n5️⃣ **Scan Support** — Scan a medicine strip first, then ask me detailed questions\n\n💡 **Try asking:**\n• "Tell me about Paracetamol"\n• "What are side effects of Azithromycin?"\n• "What is Jan Aushadhi?"\n• "How to manage diabetes?"' + DISCLAIMER;
        }
        // Varied fallback based on message count
        const fallbacks = [
            'I can help with medicine information! Try asking about a specific medicine (like Paracetamol, Amoxicillin, or Pantoprazole), or scan a medicine strip first for detailed analysis.\n\nYou can also ask about general health topics like fever, diabetes, blood pressure, or antibiotics.',
            'I\'m best at answering specific medicine questions. You could ask:\n\n• "What is Azithromycin used for?"\n• "Side effects of Pantoprazole"\n• "Tell me about generic medicines"\n• "What is Jan Aushadhi scheme?"\n\nOr scan a medicine to get detailed info!',
            'I didn\'t quite understand that. I\'m specialized in medicine information for Indian medicines. Try:\n\n• Asking about a medicine by name\n• Scanning a medicine strip first\n• Asking about health topics like fever, allergies, or diabetes\n• Asking about generic medicines or Jan Aushadhi'
        ];
        const fallbackIndex = (messageCount - 1) % fallbacks.length;
        return fallbacks[fallbackIndex] + DISCLAIMER;
    }
    findKnowledgeKey(message) {
        for (const key of Object.keys(MEDICINE_KNOWLEDGE)) {
            if (message.includes(key)) {
                return key;
            }
        }
        // Check common brand names
        const brandToGeneric = {
            'dolo': 'paracetamol', 'crocin': 'paracetamol', 'calpol': 'paracetamol',
            'augmentin': 'amoxicillin', 'mox': 'amoxicillin',
            'azithral': 'azithromycin', 'zithromax': 'azithromycin',
            'pan-d': 'pantoprazole', 'pantocid': 'pantoprazole', 'pantop': 'pantoprazole',
            'atorva': 'atorvastatin', 'lipitor': 'atorvastatin',
            'telma': 'telmisartan', 'telmikind': 'telmisartan',
            'glycomet': 'metformin', 'glucophage': 'metformin',
            'cetzine': 'cetirizine', 'zyrtec': 'cetirizine', 'okacet': 'cetirizine',
            'omez': 'omeprazole',
            'brufen': 'ibuprofen', 'combiflam': 'ibuprofen',
            'ciplox': 'ciprofloxacin',
            'amlopress': 'amlodipine', 'stamlo': 'amlodipine',
            'montair': 'montelukast', 'singulair': 'montelukast'
        };
        for (const [brand, generic] of Object.entries(brandToGeneric)) {
            if (message.includes(brand)) {
                return generic;
            }
        }
        return null;
    }
    async searchMedicineInMessage(message) {
        try {
            // Extract potential medicine names (words with capital-like significance)
            const words = message.split(/\s+/).filter(w => w.length > 3);
            for (const word of words) {
                const results = await db.select().from(schema.medicines).where(or(like(schema.medicines.brand_name, '%' + word + '%'), like(schema.medicines.generic_name, '%' + word + '%')));
                if (results.length > 0) {
                    return results[0];
                }
            }
        }
        catch (e) {
            // ignore DB errors
        }
        return null;
    }
}
export class GeminiChatProvider {
    genAI = null;
    mockProvider = new MockAIChatProvider();
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        }
    }
    async chat(messages, medicineContext) {
        if (!this.genAI) {
            return this.mockProvider.chat(messages, medicineContext);
        }
        try {
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-3.5-flash'
            });
            let promptPrefix = '';
            if (medicineContext) {
                promptPrefix = 'Context: We are discussing ' + medicineContext.brand_name + ' (Generic: ' + medicineContext.generic_name + '). ' +
                    'Manufacturer: ' + medicineContext.manufacturer + '. ' +
                    'Dosage form: ' + medicineContext.dosage_form + ', Strength: ' + medicineContext.strength + '. ' +
                    'Category: ' + medicineContext.category + '. ' +
                    'MRP: Rs. ' + medicineContext.mrp +
                    (medicineContext.nppa_ceiling_price ? ' (NPPA ceiling: Rs. ' + medicineContext.nppa_ceiling_price + ')' : '') + '.\n\n';
            }
            const history = messages.slice(0, -1).map(function (msg) {
                return {
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                };
            });
            const lastMessage = messages[messages.length - 1];
            const chat = model.startChat({ history: history });
            const result = await chat.sendMessage(promptPrefix + lastMessage.content);
            return result.response.text();
        }
        catch (error) {
            console.error('Gemini API error:', error);
            return this.mockProvider.chat(messages, medicineContext);
        }
    }
}

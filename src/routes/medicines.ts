import { Router } from 'express';
import { SeedDataProvider } from '../providers/DataProvider.js';

const router = Router();
const dataProvider = new SeedDataProvider();

router.get('/', async (req, res) => {
  try {
    const medicines = await dataProvider.getAllMedicines();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

router.get('/search', async (req, res) => {
  const query = req.query.q as string;
  if (!query) {
    return res.json([]);
  }
  try {
    const results = await dataProvider.searchMedicines(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const medicine = await dataProvider.getMedicineById(parseInt(req.params.id));
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medicine details' });
  }
});

router.get('/:id/alternatives', async (req, res) => {
  try {
    const alternatives = await dataProvider.getGenericAlternatives(parseInt(req.params.id));
    res.json(alternatives);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alternatives' });
  }
});

export default router;

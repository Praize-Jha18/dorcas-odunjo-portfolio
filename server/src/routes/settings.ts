import { Router } from 'express';
import { Setting } from '../models/Setting';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/:key', async (req, res) => {
  const setting = await Setting.findOne({ key: req.params.key });
  res.json(setting?.data ?? {});
});

router.put('/:key', requireAuth, async (req, res) => {
  const setting = await Setting.findOneAndUpdate(
    { key: req.params.key },
    { $set: { data: req.body ?? {} } },
    { new: true, upsert: true }
  );
  res.json(setting.data);
});

export default router;

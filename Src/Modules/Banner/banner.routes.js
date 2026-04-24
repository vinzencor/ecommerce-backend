import express from 'express';
import bannerContainer from './banner.container.js';
import adminAuthenticate from '../../Middlewares/adminAuthenticate.js';
import upload from '../../Middlewares/upload.js';
import validate from '../../Middlewares/validate.js';
import { createBannerSchema, updateBannerSchema } from './banner.validation.js';

const router = express.Router();

// Middleware to parse JSON strings from form-data (e.g., productIds)
const parseFormDataArrays = (fields) => (req, res, next) => {
  fields.forEach((field) => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      try {
        const parsed = JSON.parse(req.body[field])
        if (Array.isArray(parsed)) {
          req.body[field] = parsed
        }
      } catch (e) {
      }
    }
  })
  next()
}

router.get('/all', bannerContainer.bannerController.getAll);
router.get('/:id', bannerContainer.bannerController.getById);

router.use(adminAuthenticate);

router.post('/create',upload.single('image'),parseFormDataArrays(['productIds']),validate(createBannerSchema),bannerContainer.bannerController.create);
router.patch('/update/:id',upload.single('image'),parseFormDataArrays(['productIds']),validate(updateBannerSchema),bannerContainer.bannerController.update);
router.patch('/toggle-status/:id',bannerContainer.bannerController.toggleStatus);
router.delete('/:id', bannerContainer.bannerController.delete);

export default router;

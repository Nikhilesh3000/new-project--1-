import express from 'express';
import {
  getVendors,
  addVendor,
  updateVendor,
  deleteVendor,

  getAllVendors,
  getExpenseHeads,
  getVendorDetails,
  getVendorById,
  calculateAmounts
} from '../controllers/vendorController.js';

const router = express.Router();

router.get('/', getVendors);
router.post('/', addVendor);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);


router.get("/", getAllVendors)
router.get("/expense-heads", getExpenseHeads)
router.get("/vendor-details", getVendorDetails)
router.get("/:id", getVendorById)
router.post("/calculate", calculateAmounts)


export default router;

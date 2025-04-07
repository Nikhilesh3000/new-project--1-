import express from 'express';
import {
  register,
  login,
  adminLogin,
  verifyAdminOTP,
  sendAdminOTP,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/admin/verify-otp', verifyAdminOTP);
router.post('/admin/send-otp', sendAdminOTP);

export default router;

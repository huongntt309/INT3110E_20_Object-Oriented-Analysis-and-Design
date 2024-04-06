import express from "express";

const accountController = require('../controllers/accountController');

const router = express.Router();

router.post('/sign-up', accountController.handleCreateNewAccount);
router.post('/login', accountController.handleLogin);
router.get('/logout', accountController.handleLogout);



export default router;

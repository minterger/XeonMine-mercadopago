const { Router } = require('express');
const router = Router();
const {
    loginForm,
    loginUser,
    registerForm,
    registerUser,
    profile,
    logout
} = require('../controllers/user.controllers');
const { isAuthenticated } = require('../helpers/auth');

router.get('/login', loginForm);

router.post('/login', loginUser);

router.get('/register', registerForm);

router.post('/register', registerUser);

router.get('/profile/:id', isAuthenticated, profile);

router.get('/logout', isAuthenticated, logout);

module.exports = router;
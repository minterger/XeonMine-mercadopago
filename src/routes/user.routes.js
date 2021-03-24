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
const { isAuthenticated, isAuthenticatedFalse } = require('../helpers/auth');

router.get('/login', isAuthenticatedFalse, loginForm);

router.post('/login', isAuthenticatedFalse, loginUser);

router.get('/register', isAuthenticatedFalse, registerForm);

router.post('/register', isAuthenticatedFalse, registerUser);

router.get('/profile/:id', isAuthenticated, profile);

router.get('/logout', isAuthenticated, logout);

module.exports = router;
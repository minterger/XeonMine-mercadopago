const { Router } = require('express');
const router = Router();
const {
    renderIndex,
    datosDonar,
    feedback,
    feedbackPost
} = require('../controllers/index.controllers');
const { isAuthenticated } = require('../helpers/auth');

router.get('/', renderIndex);

router.post('/donar', isAuthenticated, datosDonar);

router.get('/feedback', isAuthenticated, feedback);

router.post('/postfeedback', feedbackPost);

module.exports = router;
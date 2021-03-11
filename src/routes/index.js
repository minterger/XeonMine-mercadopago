const { Router } = require('express');
const router = Router();
const {
    renderIndex,
    datosDonar,
    feedback,
    feedbackPost
} = require('../controllers/index.controllers');

router.get('/', renderIndex);

router.post('/donar', datosDonar);

router.get('/feedback', feedback);
router.post('/postfeedback', feedbackPost);

module.exports = router;
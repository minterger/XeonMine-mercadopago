const { Router } = require('express');
const router = Router();
const {
    renderIndex,
    datosDonar,
    feedback,
    status,
    feedbackPost,
    payStatus,
    deletePay
} = require('../controllers/index.controllers');
const { isAuthenticated } = require('../helpers/auth');

router.get('/', renderIndex);

router.post('/donar', isAuthenticated, datosDonar);

router.get('/feedback', isAuthenticated, feedback);

// router.get('/status/:status', isAuthenticated, status)

router.post('/postfeedback', feedbackPost);

router.post('/pay-status/:external', isAuthenticated, payStatus);

router.delete('/delete-pay/:id', isAuthenticated, deletePay)

module.exports = router;
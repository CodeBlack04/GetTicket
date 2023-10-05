import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    req.session = null;
    //console.log('Logged out.')
    res.send({});
})

export { router as signoutRouter };
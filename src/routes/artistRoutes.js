const express = require('express');
const artistRoutes = express.Router();

artistRoutes.get('/artist', (req, res) => {
    res.json({ ok: 123 });
})

module.exports = artistRoutes;
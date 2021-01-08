const ArtistEvent = require('../models/ArtistEvent');
const Artist = require('../models/Artist');

module.exports = {
    async sendSolicitation(req, res) {
        //try{

        const artist = await Artist.findOne({
            where: { user_id: req.userId }
        });


        //} catch (err) {
        //  return res.send({ error: 'Erro ao solicitar participação em evento' })
        // }
    }
};
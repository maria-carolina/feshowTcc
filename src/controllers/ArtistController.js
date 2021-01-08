const ArtistEvent = require('../models/ArtistEvent');
const Artist = require('../models/Artist');
const { Op } = require('sequelize');

module.exports = {
    async sendSolicitation(req, res) {
        try {

            const { eventId, date, time } = req.body;

            const artist = await Artist.findOne({
                where: { user_id: req.userId }
            });

            //verificar artista no evento
            const artistEvents = await ArtistEvent.findAll({
                where: {
                    event_id: eventId,
                    artist_id: artist.id
                }
            })

            if (artistEvents.length > 0) {
                return res.send({ error: 'Artista já está no evento' });
            }

            //verificar se não há show acontecendo
            const verifyLineup = await ArtistEvent.findAll({
                where: {
                    event_id: eventId,
                    start_time: { [Op.eq]: time }
                }
            });

            if (verifyLineup.length > 0) {
                return res.send({ error: 'Há um artista encaixado neste horário' });
            }

            await ArtistEvent.create({
                event_id: eventId,
                artist_id: artist.id,
                date,
                start_time: time,
                status: 2
            });

            return res.status(200).send('ok');


        } catch (err) {
            return res.send({ error: 'Erro ao solicitar participação em evento' })
        }
    }
};
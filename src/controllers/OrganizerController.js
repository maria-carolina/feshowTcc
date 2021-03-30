const ArtistEvent = require('../models/ArtistEvent');
const Artist = require('../models/Artist');
const Event = require('../models/Event');
const Address = require('../models/Address');
const GenreVenue = require('../models/GenreVenue');
const User = require('../models/User');
const EventImage = require('../models/EventImage');
const Notification = require('../models/Notification');

const { Op } = require('sequelize');
const moment = require('moment');

function verifyArtist(artistId, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].artist_id === artistId) {
            return true;
        }
    }
    return false;
}

function verifyGenre(id, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].genre_id === id) {
            return true;
        }
    }
    return false;
}

function isUnique(id, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return false;
        }
    }
    return true;
}

module.exports = {

    /**
     * status convites/line-up
     *  1 - organizador convida artista
     *  2 - artista solicita participação
     *  3 - artista confirmado no line-up
     */

    async updateLineup(req, res) {
        try {
            const { id } = req.params;

            const { lineup } = req.body;

            //remover todos

            await ArtistEvent.destroy({
                where: {
                    [Op.and]: [{ event_id: id }, { status: 3 }]
                }
            });

            const event = await Event.findByPk(id);

            if (lineup !== undefined) {
                const newLineup = lineup.map(
                    data => {
                        return {
                            event_id: id,
                            artist_id: data.artist_id,
                            date: event.start_date,
                            start_time: data.time,
                            status: 3
                        }
                    });

                await ArtistEvent.bulkCreate(newLineup);

            }
            return res.status(200).send('ok');
        } catch (err) {
            return res.send({ error: 'Erro ao editar line-up' })
        }
    },

    async changeStatus(req, res) {

        const { id } = req.params;

        let event = await Event.findByPk(id);
        /**
         * status = 0 fechado
         * status = 1 aberto
        **/

        if (event.status == 0) {
            await Event.update({ status: 1 }, {
                where: { id }
            });
        } else {
            //verificar se não tem convites em aberto
            const verify = await ArtistEvent.findAll({
                where: {
                    event_id: id,
                    status: { [Op.ne]: 3 }
                }
            });

            if (verify.length > 0) {
                return res.send({ error: 'Há convites em aberto, para proseguir no fechamendo do evento é preciso recusar ou cancelar convites ligados a este evento.' })
            }

            await Event.update({ status: 0 }, {
                where: { id }
            });

        }

        //retornar evento igual eventController.show

        event = await Event.findByPk(id, {
            include: {
                association: 'venue',
                attributes: ['id', 'name']
            }
        });

        const eventImage = await EventImage.findOne({ where: { event_id: id } });

        const imageStatus = eventImage ? true : false;

        if (!event) {
            return res.send({ error: 'Erro ao exibir evento' });
        }

        event.dataValues.image = imageStatus;
        event.dataValues.start_time = moment(event.start_time, 'HH:mm:ss').format("HH:mm");
        event.dataValues.end_time = moment(event.end_time, 'HH:mm:ss').format("HH:mm");

        //pegar status do artista
        const user = await User.findByPk(req.userId);
        if (user.type === 0) {
            const artist = await Artist.findOne({
                where: { user_id: user.id }
            });

            const artistEvents = await ArtistEvent.findOne({
                where: {
                    artist_id: artist.id,
                    event_id: id
                }
            });

            let artistStatus = artistEvents ? artistEvents.status : 0;

            event.dataValues.artistStatus = artistStatus;
        }

        return res.send(event);
    },

    async getEventsOrganizer(req, res) {
        try {
            //usado para retornar eventos do orgnizador para convidar artista em seu perfil
            const { artistId } = req.params;
            const user = await User.findByPk(req.userId);
            let now = moment().format('YYYY-MM-DD');

            let eventsAll = await Event.findAll({
                attributes: ['id', 'name', 'start_date', 'status'],
                include: {
                    association: 'venue',
                    attributes: ['id', 'name']
                },
                where: {
                    organizer_id: user.id,
                    status: 1,
                    start_date: {
                        [Op.gte]: now
                    }
                },
                order: [
                    ['start_date', 'ASC']
                ]
            });

            //remover eventos que artistas já esteja relacionado
            let events = [];
            for (let event of eventsAll) {
                let artistEvent = await ArtistEvent.findOne({
                    where: {
                        artist_id: artistId,
                        event_id: event.id
                    }
                });
                if (!artistEvent) {
                    events.push(event);
                }
            }

            return res.send(events);

        } catch (err) {
            return res.send({ error: 'Erro ao exibir eventos futuros' })
        }
    },

};
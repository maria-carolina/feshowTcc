const Solicitation = require('../models/Solicitation');
const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Artist = require('../models/Artist');
const Producer = require('../models/Producer');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ArtistEvent = require('../models/ArtistEvent');

module.exports = {

    async sendOrganizationRequest(req, res) {
        try {
            let { venue_id, name, start_date, start_time, end_time, note } = req.body;

            if (note === undefined) {
                note = null;
            }

            const verifyEvent = await Event.findAll({
                where: {
                    start_date,
                    venue_id
                }
            });

            if (verifyEvent.length > 0) {
                return res.send({ error: 'Há um evento acontecendo nesta mesma data' });
            }

            await Solicitation.create({
                venue_id,
                user_id: req.userId,
                name,
                start_date,
                start_time,
                end_time,
                note
            });

            let venue = await Venue.findByPk(venue_id);
            let user = await User.findByPk(req.userId);
            let nameOrg; //user que quer ser organizador do evento
            if (user.type === 0) {
                let artistOrg = await Artist.findOne({
                    where: { user_id: user.id }
                });
                nameOrg = artistOrg.name;

            } else if (user.type === 1) {
                let venueOrg = await Venue.findOne({
                    where: { user_id: user.id }
                });
                nameOrg = venueOrg.name;

            } else {
                let producerOrg = await Producer.findOne({
                    where: { user_id: user.id }
                });
                nameOrg = producerOrg.name;
            }

            await Notification.create({
                user_id: venue.user_id,
                message: `${nameOrg} solicitou a criação de um evento em seu espaço`,
                status: 0
            });
    
            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao enviar solicitação de evento' })
        }

    },

    async index(req, res) {
        try {
            const venue = await Venue.findOne({
                where: { user_id: req.userId }
            });

            const solicitationRequests = await Solicitation.findAll({
                where: { venue_id: venue.id },
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            let solicitations = [];

            for (let solicitation of solicitationRequests) {
                let organizer;
                let user = await User.findByPk(solicitation.user_id);

                if (user.type === 0) {
                    organizer = await Artist.findOne({
                        where: { user_id: user.id }
                    });
                } else if (user.type === 1) {
                    organizer = await Venue.findOne({
                        where: { user_id: user.id }
                    });
                } else {
                    organizer = await Producer.findOne({
                        where: { user_id: user.id }
                    });
                }
                organizer.dataValues.userId = user.id;

                solicitations.push({
                    solicitation,
                    organizer
                });
            }
            return res.send(solicitations);
        } catch (err) {
            return res.send({ error: 'Erro ao listar requisições de solicitação de evento' })
        }
    },

    async acceptSolicitation(req, res) {
        try {
            const { idSolicitation } = req.params;

            const solicitation = await Solicitation.findByPk(idSolicitation);

            await Solicitation.destroy({
                where: { id: solicitation.id }
            });

            const event = await Event.create({
                organizer_id: solicitation.user_id,
                venue_id: solicitation.venue_id,
                name: solicitation.name,
                start_date: solicitation.start_date,
                start_time: solicitation.start_time,
                end_time: solicitation.end_time,
                status: 1
            });

            if (!event) {
                return res.send({ error: 'Erro ao gravar evento no sistema' });
            }

            const venue = await Venue.findByPk(solicitation.venue_id);

            const user = await User.findByPk(solicitation.user_id);

            let message;

            if (user.type === 0) {
                //vincular ao evento se o organizador for artista
                const artist = await Artist.findOne({
                    where: { user_id: user.id }
                });
                await ArtistEvent.create({
                    event_id: event.id,
                    artist_id: artist.id,
                    date: event.start_date,
                    start_time: event.start_time,
                    status: 3
                });

                message = `O ${venue.name} aceitou a solicitação de organização do ${solicitation.name} e você está no line-up do evento.`;
            } else {
                message = `O ${venue.name} aceitou a solicitação de organização do ${solicitation.name}`;
            }

            await Notification.create({
                user_id: solicitation.user_id,
                message: message,
                status: 2,
                auxiliary_id: event.id,
            });

            return res.send(event);
        } catch (err) {
            return res.send({ error: 'Erro ao criar evento solicitado' })
        }
    },

    async refuseSolicitation(req, res) {
        try {
            const { idSolicitation } = req.params;

            const solicitation = await Solicitation.findByPk(idSolicitation);
            const venue = await Venue.findByPk(solicitation.venue_id);

            await Notification.create({
                user_id: solicitation.user_id,
                message: `${venue.name} não aceitou a solicitação de criação do ${solicitation.name}`,
                status: 0
            });

            await Solicitation.destroy({
                where: { id: solicitation.id }
            });

            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao recusar evento solicitado' })
        }
    }
};
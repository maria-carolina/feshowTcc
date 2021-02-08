const Solicitation = require('../models/Solicitation');
const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Artist = require('../models/Artist');
const Producer = require('../models/Producer');
const User = require('../models/User');

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
    }
};
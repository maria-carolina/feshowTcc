const ArtistEvent = require('../models/ArtistEvent');
const Artist = require('../models/Artist');
const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Post = require('../models/Post');

const { Op } = require('sequelize');
const moment = require('moment');

module.exports = {

    async store(req, res) {
        try {
            const {
                venue_id,
                name,
                description,
                start_date,
                start_time,
                end_time
            } = req.body;

            let descript;

            if (description !== "") {
                descript = description;
            } else {
                descript = null;
            }

            //se tem evento na mesma data
            const verifyEvent = await Event.findAll({
                where: {
                    start_date,
                    venue_id
                }
            });

            if (verifyEvent.length > 0) {
                return res.send({ error: 'Já existe um evento nesta data' });
            }

            const event = await Event.create({
                organizer_id: req.userId,
                venue_id,
                name,
                description: descript,
                start_date,
                start_time,
                end_time,
                status: 1
            });

            if (!event) {
                return res.send({ error: 'Erro ao gravar evento no sistema' });
            }

            return res.send(event);

        } catch (err) {
            return res.send({ error: 'Erro ao gravar evento' })
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;

            const {
                venue_id,
                name,
                description,
                start_date,
                start_time,
                end_time
            } = req.body;

            let descript;

            if (description !== "") {
                descript = description;
            } else {
                descript = null;
            }

            //se tem evento na mesma data
            const verifyEvent = await Event.findAll({
                where: {
                    start_date,
                    venue_id,
                    id: {
                        [Op.ne]: id
                    }
                }
            });

            if (verifyEvent.length > 0) {
                return res.send({ error: 'Já existe um evento nesta data' });
            }

            const event = await Event.update({
                organizer_id: req.userId,
                venue_id,
                name,
                description: descript,
                start_date,
                start_time,
                end_time,
                status: 1
            }, {
                where: { id }
            });

            if (!event) {
                return res.send({ error: 'Erro ao editar evento no sistema' });
            }

            return res.send(event);

        } catch (err) {
            return res.send({ error: 'Erro ao editar evento' })
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;

            const event = await Event.findByPk(id);

            //verificar se não tem convites em aberto
            const verify = await ArtistEvent.findAll({
                where: {
                    event_id: id,
                    status: { [Op.ne]: 3 }
                }
            });

            if (verify.length > 0) {
                return res.send({ error: 'Há convites em aberto, para proseguir na exclusão é preciso recusar ou cancelar convites ligados a este evento.' })
            }

            // notificacoes
            await Notification.destroy({
                where: { auxiliary_id: event.id }
            });

            //notificar artistas presentes no evento
            let artistEvents = await ArtistEvent.findAll({
                where: {
                    event_id: event.id,
                    status: 3
                }
            });
        
            if (artistEvents.length > 0) {
                for (let artistEvent of artistEvents) {
                    let artist = await Artist.findByPk(artistEvent.artist_id);
                    await Notification.create({
                        user_id: artist.user_id,
                        message: `O ${event.name} foi apagado.`,
                        status: 0
                    });
                }
            }

            // artist_events
            await ArtistEvent.destroy({
                where: { event_id: event.id }
            });

            // posts
            await Post.destroy({
                where: { event_id: event.id }
            });

            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao deletar evento' })
        }
    },

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


        if (!event) {
            return res.send({ error: 'Erro ao exibir evento' });
        }

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
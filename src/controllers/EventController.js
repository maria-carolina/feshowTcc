const Event = require('../models/Event');
const ArtistEvent = require('../models/ArtistEvent');
const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

module.exports = {
    async store(req, res) {
        try {
            const {
                venue_id,
                name,
                description,
                start_date,
                end_date,
                start_time,
                end_time
            } = req.body;

            let endDate;

            end_date !== undefined ? endDate = end_date : endDate = start_date;

            const event = await Event.create({
                organizer_id: req.userId,
                venue_id,
                name,
                description,
                start_date,
                end_date: endDate,
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

    async storeImage(req, res) {
        const { id } = req.params;

        try {
            const { filename: key } = req.file;

            const event = await Event.findByPk(id)

            if (event.image !== "") { //remover caso seja update de imagem
                const file = path.resolve(__dirname, '..', '..', 'uploads', 'events', event.image);

                fs.unlink(file, function (err) {
                    if (err) throw err;
                    console.log('Arquivo deletado!');
                })
            }


            await Event.update({
                image: key
            }, {
                where: { id }
            });

            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao inserir imagem' })
        }
    },

    async removeImage(req, res) {
        try {
            const { id } = req.params;

            const event = await Event.findByPk(id)

            if (event.image !== "") { //remover caso seja update de imagem
                const file = path.resolve(__dirname, '..', '..', 'uploads', 'events', event.image);

                fs.unlink(file, function (err) {
                    if (err) throw err;
                    console.log('Arquivo deletado!');
                })
            }

            await Event.update({
                image: ""
            }, {
                where: { id }
            });

            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao remover imagem' })
        }
    },

    async show(req, res) {

        const { id } = req.params;

        const event = await Event.findByPk(id);

        if (!event) {
            return res.send({ error: 'Erro ao gravar evento no sistema' });
        }

        return res.send(event);

    },

    async showLineup(req, res) {

        const { id } = req.params;

        const lineup = await ArtistEvent.findAll({
            attributes: ['event_id', 'start_time'],
            where: { event_id: id },
            include: {
                association: 'artists',
                attributes: ['id', 'name']
            }
        });

        return res.send(lineup);

    },

    async showPostagens(req, res) {

        const { id } = req.params;

        const posts = await Post.findAll({ where: { event_id: id}})

        return res.send(posts);
    }
};

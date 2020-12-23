const Event = require('../models/Event');
const ArtistEvent = require('../models/ArtistEvent');
const Post = require('../models/Post');
const ArtistEquipment = require('../models/ArtistEquipment');
const EquipmentVenue = require('../models/EquipmentVenue');
const Equipment = require('../models/Equipment');
const Artist = require('../models/Artist');
const Producer = require('../models/Producer');
const Venue = require('../models/Venue');

const { Op, QueryTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

function searchEquipment(equipmentId, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].equipment_id === equipmentId) {
            return true;
        }
    }
    return false;
}

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

            let endDate, descript;

            if (end_date !== undefined || end_date !== "") {
                endDate = end_date;
            } else {
                endDate = start_date;
            }

            if (description !== undefined || description !== "") {
                descript = description;
            } else {
                descript = null;
            }

            const event = await Event.create({
                organizer_id: req.userId,
                venue_id,
                name,
                description: descript,
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

            if (event.image !== "" || event.image !== null) { //remover caso seja update de imagem
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


    async update(req, res) {
        try {
            const { id } = req.params;

            const {
                venue_id,
                name,
                description,
                start_date,
                end_date,
                start_time,
                end_time
            } = req.body;

            let endDate, descript;

            if (end_date !== undefined || end_date !== "") {
                endDate = end_date;
            } else {
                endDate = start_date;
            }

            if (description !== undefined || description !== "") {
                descript = description;
            } else {
                descript = null;
            }

            const event = await Event.update({
                organizer_id: req.userId,
                venue_id,
                name,
                description: descript,
                start_date,
                end_date: endDate,
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

    async removeImage(req, res) {
        try {
            const { id } = req.params;

            const event = await Event.findByPk(id)

            if (event.image !== null || event.image !== "") { //remover caso seja update de imagem
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

        const event = await Event.findByPk(id,{
            include: {
                association: 'venue',
                attributes: ['id', 'name']
            }
        });

        if (!event) {
            return res.send({ error: 'Erro ao gravar evento no sistema' });
        }

        return res.send(event);

    },

    async showLineup(req, res) {

        const { id } = req.params;

        const lineup = await ArtistEvent.findAll({
            attributes: ['event_id', 'start_time'],
            where: {
                [Op.and]: [{ event_id: id }, { status: 1 }]
            },
            include: {
                association: 'artists',
                attributes: ['id', 'name']
            }
        });

        return res.send(lineup);

    },

    async showPosts(req, res) {
        try {
            const { id } = req.params;

            const postagens = await Post.findAll({
                where: { event_id: id },
                include: {
                    association: 'users',
                    attributes: ['id', 'username', 'type']
                }
            });

            let posts = [];
            let obj = {}

            for (let post of postagens) {

                if (post.users.type == 0) {
                    user = await Artist.findOne({ where: { user_id: post.users.id } });
                }
                else if (post.users.type == 1) {
                    user = await Venue.findOne({ where: { user_id: post.users.id } });
                }
                else {
                    user = await Producer.findOne({ where: { user_id: post.users.id } });
                }

                posts.push({
                    postId: post.id,
                    name: user.name,
                    post: post.post,
                    userId: post.user_id,
                    updatedAt: post.updatedAt
                });

            };
            return res.send(posts);
        } catch (err) {
            return res.send({ error: 'Erro ao listar posts' })
        }
    },

    async showEquipments(req, res) {

        const { id } = req.params;

        //artistas no lineup
        const artistsLineup = await ArtistEvent.findAll({
            attributes: [],
            where: {
                [Op.and]: [{ event_id: id }, { status: 1 }]
            },
            include: {
                association: 'artists',
                attributes: ['id', 'name']
            }
        });

        const event = await Event.findByPk(id);

        let artistEquipment;
        let equipments = [];
        let obj = {};
        let equipment, artist, result;

        //espaço do evento
        const equipmentVenue = await EquipmentVenue.findAll({
            where: { venue_id: event.venue_id }
        });

        for (let artistLineup of artistsLineup) {
            artistEquipment = await ArtistEquipment.findAll({
                where: { artist_id: artistLineup.artists.id }
            });

            for (let equip of artistEquipment) {
                result = searchEquipment(equip.equipment_id, equipmentVenue);
                equipment = await Equipment.findByPk(equip.equipment_id);
                artist = await Artist.findByPk(equip.artist_id);

                if (result) {
                    //o espaço tem
                } else {
                    equipments.push({
                        artistId: artist.id,
                        name: artist.name,
                        equipment: equipment.name,
                        quantity: equip.quantity
                    });
                }
            }
        }

        return res.send(equipments);
    },

    async delete(req, res) {
        try {
            const { id } = req.params;

            const event = await Event.findByPk(id);

            if (event.image !== null) { //remover imagem do sistema
                const file = path.resolve(__dirname, '..', '..', 'uploads', 'events', event.image);

                fs.unlink(file, function (err) {
                    if (err) throw err;
                    console.log('Arquivo deletado!');
                })
            }

            await ArtistEvent.destroy({
                where: { event_id: id }
            });

            await Event.destroy({
                where: { id }
            });
            
            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao deletar evento' })
        }
    }

};

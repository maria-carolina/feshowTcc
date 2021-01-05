const Event = require('../models/Event');
const EventImage = require('../models/EventImage');
const ArtistEvent = require('../models/ArtistEvent');
const Post = require('../models/Post');
const ArtistEquipment = require('../models/ArtistEquipment');
const EquipmentVenue = require('../models/EquipmentVenue');
const Equipment = require('../models/Equipment');
const Artist = require('../models/Artist');
const Producer = require('../models/Producer');
const Venue = require('../models/Venue');

const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

function searchEquipment(equipmentId, array) {
    let qtd;
    for (var i = 0; i < array.length; i++) {
        if (array[i].equipment_id === equipmentId) {
            qtd = array[i].quantity;
            return qtd;
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
                start_time,
                end_time
            } = req.body;

            let descript;

            if (description !== "") {
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

        try {
            const { id } = req.params;
            const { filename: key } = req.file;

            const eventImage = await EventImage.findOne({ where: { event_id: id } });

            if (eventImage) { //remover caso seja update de imagem
                const file = path.resolve(__dirname, '..', '..', 'uploads', 'events', eventImage.name);

                if (fs.existsSync(file)) {
                    fs.unlink(file, function (err) {
                        if (err) throw err;
                        console.log('Arquivo deletado!');
                    })

                    await EventImage.update({
                        name: key
                    }, {
                        where: { event_id: id }
                    });
                }
            } else {
                await EventImage.create({
                    event_id: id,
                    name: key
                });
            }

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
                start_time,
                end_time
            } = req.body;

            let descript;

            if (description !== "") {
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

            const eventImage = await EventImage.findOne({ where: { event_id: id } });

            if (eventImage) {
                const file = path.resolve(__dirname, '..', '..', 'uploads', 'events', eventImage.name);

                if (fs.existsSync(file)) {
                    fs.unlink(file, function (err) {
                        if (err) throw err;
                        console.log('Arquivo deletado!');
                    })

                    await EventImage.destroy({
                        where: { event_id: id }
                    });
                }
            }
            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao remover imagem' })
        }
    },

    async show(req, res) {
        try {
            const { id } = req.params;

            let event = await Event.findByPk(id, {
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

            return res.send(event);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir evento' })
        }

    },

    async showLineup(req, res) {
        try {
            const { id } = req.params;

            const lineup = await ArtistEvent.findAll({
                attributes: ['event_id', 'date', 'start_time'],
                where: {
                    [Op.and]: [{ event_id: id }, { status: 3 }]
                },
                include: {
                    association: 'artists',
                    attributes: ['id', 'name']
                },
                order: [
                    ['date', 'ASC'],
                    ['start_time', 'ASC']
                ]
            });

            return res.send(lineup);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir line-up' })
        }

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

            posts.sort(function (a, b) {
                var dateA = new Date(a.updatedAt),
                    dateB = new Date(b.updatedAt);
                //maior para menor
                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;
                return 0;
            });

            return res.send(posts);
        } catch (err) {
            return res.send({ error: 'Erro ao listar posts' })
        }
    },

    async showEquipments(req, res) {
        try {
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
            let equipments = [], equipmentsVenue = [];
            let obj = {};
            let equipment, artist, result, qtd;

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
                        //result retorna quantidade que espaço tem 
                        if (equip.quantity > result) {
                            qtd = equip.quantity - result;

                            //o que o espaço irá emprestar
                            equipmentsVenue.push({
                                artistId: artist.id,
                                name: artist.name,
                                equipment: equipment.name,
                                quantity: result
                            });

                            equipments.push({
                                artistId: artist.id,
                                name: artist.name,
                                equipment: equipment.name,
                                quantity: qtd
                            });
                        } else if (equip.quantity <= result) {
                            equipmentsVenue.push({
                                artistId: artist.id,
                                name: artist.name,
                                equipment: equipment.name,
                                quantity: equip.quantity
                            });
                        }

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

            return res.send({ equipments, equipmentsVenue });
        } catch (err) {
            return res.send({ error: 'Erro ao exibir avisos' })
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;

            const event = await Event.findByPk(id);
            const eventImage = await EventImage.findOne({ where: { event_id: id } });

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

            await ArtistEvent.destroy({
                where: { event_id: id }
            });


            if (eventImage) { //remover imagem do sistema
                const file = path.resolve(__dirname, '..', '..', 'uploads', 'events', eventImage.name);
                if (fs.existsSync(file)) {
                    fs.unlink(file, function (err) {
                        if (err) throw err;
                        console.log('Arquivo deletado!');
                    });
                }

                await EventImage.destroy({
                    where: { event_id: id }
                });
            }

            await Event.destroy({
                where: { id }
            });

            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao deletar evento' })
        }
    },

    async getImage(req, res) {
        try {
            const { id } = req.params;

            const eventImage = await EventImage.findOne({ where: { event_id: id } });

            if (eventImage) {
                const file = path.resolve(__dirname, '..', '..', 'uploads', 'events', eventImage.name);
                if (fs.existsSync(file)) {
                    return res.sendFile(file);
                } else {
                    return res.send({ msg: 'Evento não possui imagem' })
                }
            } else {
                return res.send({ msg: 'Evento não possui imagem' })
            }
        } catch (err) {
            return res.send({ error: 'Erro ao exibir imagem' })
        }

    },

    async getDateTime(req, res) {

        try {
            const { id } = req.params;

            const event = await Event.findByPk(id);

            var limitTime = moment(event.end_time, 'kk:mm').subtract(30, 'minutes').format('kk:mm:ss')

            const eventDate = {
                id: event.id,
                start_date: event.start_date,
                start_time: event.start_time,
                end_time: limitTime
            }

            return res.send(eventDate);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir data e hora de evento' })
        }

    }

};

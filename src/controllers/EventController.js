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
const User = require('../models/User');

const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

function searchEquipment(equipmentId, array) {
    let qtd;
    for (let i = 0; i < array.length; i++) {
        if (array[i].equipment_id === equipmentId) {
            qtd = array[i].quantity;
            return qtd;
        }
    }
    return false;
}

function verifyEvent(eventId, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === eventId) {
            return true;
        }
    }
    return false;
}

function getTime(datatime) {

    datatime = moment.utc(datatime).format('YYYY-MM-DDTHH:mm:ss');

    let difference = moment().diff(datatime, 'seconds');

    if (difference <= 59) //segundos
        return "há alguns segundos atrás"
    else {
        difference = moment().diff(datatime, 'minutes');
        if (difference == 1) {
            return `há 1 minuto atrás`
        } else if (difference <= 59) { //horas
            return `há ${difference} minutos atrás`
        } else {
            difference = moment().diff(datatime, 'hours');
            if (difference == 1) {
                return `há 1 hora atrás`
            } else if (difference <= 4) { //até 4 horas
                return `há ${difference} horas atrás`
            } else {
                return moment.utc(datatime, 'YYYY-MM-DDTHH:mm:ssZ').format("DD/MM/YY HH:mm");
            }
        }
    }
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
        } catch (err) {
            return res.send({ error: 'Erro ao exibir evento' })
        }

    },

    async showLineup(req, res) {
        try {
            const { id } = req.params;

            let lineup = await ArtistEvent.findAll({
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

            lineup.forEach((data) => {
                data.dataValues.start_time = moment(data.start_time, 'HH:mm:ss').format("HH:mm");
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

                //ajustar horário
                let time = getTime(post.updatedAt);

                posts.push({
                    postId: post.id,
                    name: user.name,
                    post: post.post,
                    time: time,
                    userId: post.user_id,
                    updatedAt: post.updatedAt
                });

            };

            posts.sort(function (a, b) {
                let dateA = new Date(a.updatedAt),
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
                    [Op.and]: [{ event_id: id }, { status: 3 }]
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

            // artist_events
            await ArtistEvent.destroy({
                where: { event_id: event.id }
            });

            // posts
            await Post.destroy({
                where: { event_id: event.id }
            });

            //imagem
            let eventImage = await EventImage.findOne({ where: { event_id: event.id } });
            if (eventImage) { //remover imagem do sistema
                const file = path.resolve(__dirname, '..', '..', 'uploads', 'events', eventImage.name);
                if (fs.existsSync(file)) {
                    fs.unlink(file, function (err) {
                        if (err) throw err;
                        console.log('Arquivo deletado!');
                    });
                }
                await EventImage.destroy({
                    where: { event_id: event.id }
                });
            }

            //evento
            await Event.destroy({
                where: { id: event.id }
            })

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

            let limitTime = moment(event.end_time, 'kk:mm').subtract(30, 'minutes').format('kk:mm:ss')

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

    },

    async getFutureEventsOrganizer(req, res) {
        try {

            const { page } = req.params

            let limit = 10;
            let offset = limit * (page - 1);

            const user = await User.findByPk(req.userId);

            //eventos do orgnizador
            let events = await Event.findAll({
                attributes: ['id', 'name', 'start_date', 'status'],
                include: {
                    association: 'venue',
                    attributes: ['id', 'name']
                },
                limit,
                offset,
                where: {
                    organizer_id: user.id
                },
                order: [
                    ['start_date', 'ASC']
                ]
            });


            return res.send(events);

        } catch (err) {
            return res.send({ error: 'Erro ao exibir eventos futuros' })
        }
    },

    async getFutureEventsParticipation(req, res) {
        try {
            const { page } = req.params

            let limit = 10;
            let offset = limit * (page - 1);
            let now = moment().format('YYYY-MM-DD');

            const user = await User.findByPk(req.userId);

            //para verificar se evento já não sera puxado em getFutureEventsOrganizer para user do tipo venue
            let events = await Event.findAll({
                include: {
                    association: 'venue',
                    attributes: ['id', 'name']
                },
                where: {
                    start_date: {
                        [Op.gte]: now
                    },
                    organizer_id: user.id
                }
            });

            if (user.type == 0) {

                const artist = await Artist.findOne({
                    where: { user_id: user.id }
                });

                let artistEvents = [];

                let artistEvts = await ArtistEvent.findAll({
                    include: [
                        { association: 'artists' },
                        {
                            association: 'events',
                            where: {
                                start_date: {
                                    [Op.gte]: now
                                }
                            },
                            include: {
                                association: 'venue'
                            },
                        },
                    ],
                    where: {
                        artist_id: artist.id,
                        status: 3
                    }
                });

                artistEvts.forEach((event) => {
                    artistEvents.push({
                        id: event.events.id,
                        name: event.events.name,
                        start_date: event.events.start_date,
                        status: event.events.status,
                        venue: {
                            id: event.events.venue.id,
                            name: event.events.venue.name
                        }
                    });
                });

                //adicionando id de usuario do venue
                for (let event of artistEvents) {
                    let findVenue = await Venue.findByPk(event.venue.id);
                    event.venue.userId = findVenue.user_id;
                }

                //ordenar menor para maior
                artistEvents.sort(function (a, b) {
                    let dateA = new Date(a.start_date),
                        dateB = new Date(b.start_date);

                    if (dateA > dateB) return 1;
                    if (dateA < dateB) return -1;
                    return 0;
                });

                //paginação
                artistEvents = artistEvents.slice(offset).slice(0, limit),
                    total_pages = Math.ceil(artistEvents.length / limit);

                return res.send(artistEvents);

            } else if (user.type == 1) {
                const venue = await Venue.findOne({
                    where: { user_id: user.id }
                });

                let venueEvents = [];
                let result;

                let venueEvts = await Event.findAll({
                    attributes: ['id', 'name', 'start_date', 'status'],
                    include: {
                        association: 'venue',
                        attributes: ['id', 'name']
                    },
                    limit,
                    offset,
                    where: {
                        venue_id: venue.id
                    },
                    order: [
                        ['start_date', 'ASC']
                    ]
                });

                //verificar se evento ja não ta na lista de eventos do organizador
                venueEvts.forEach((event) => {
                    result = verifyEvent(event.id, events)
                    if (!result)
                        venueEvents.push(event);
                });

                //adicionando id de usuario do venue
                for (let event of venueEvents) {
                    let findVenue = await Venue.findByPk(event.venue.id);
                    event.venue.dataValues.userId = findVenue.user_id;
                }

                return res.send(venueEvents);

            } else {
                //adicionando id de usuario do venue
                console.log(events)
                for (let event of events) {
                    let findVenue = await Venue.findByPk(event.venue.id);
                    event.venue.dataValues.userId = findVenue.user_id;
                }
                return res.send(events);
            }

        } catch (err) {
            return res.send({ error: 'Erro ao exibir eventos futuros' })
        }

    },

    async getPastEvents(req, res) {
        try {
            const { id, page } = req.params;
            console.log(`${id} e ${page}`)
            let limit = 10;
            let offset = limit * (page - 1);
            let events;
            let now = moment().format('YYYY-MM-DD');

            const user = await User.findByPk(id);

            if (user.type == 0) {
                const artist = await Artist.findOne({
                    where: { user_id: user.id }
                });

                const artistEvents = await ArtistEvent.findAll({
                    include: [
                        {
                            association: 'artists',
                        }, {
                            association: 'events',
                            where: {
                                status: 0,
                                start_date: {
                                    [Op.lte]: now
                                }
                            },
                            include: {
                                association: 'venue',
                            },
                            order: [
                                ['start_date', 'DESC']
                            ]
                        },
                    ],
                    where: {
                        artist_id: artist.id,
                        status: 3
                    }
                });

                events = [];
                artistEvents.forEach((event) => {
                    events.push({
                        id: event.events.id,
                        name: event.events.name,
                        start_date: event.events.start_date,
                        status: event.events.status,
                        venue: {
                            id: event.events.venue.id,
                            name: event.events.venue.name,
                            userId: user.id
                        }
                    });
                });

                //adicionar id do user do espaço
                for (let event of events) {
                    let venue = await Venue.findByPk(event.venue.id);
                    event.venue.userId = venue.user_id;
                }

            } else if (user.type == 1) {
                const venue = await Venue.findOne({
                    where: { user_id: user.id }
                });

                events = await Event.findAll({
                    attributes: ['id', 'name', 'start_date', 'status'],
                    include: {
                        association: 'venue',
                        attributes: ['id', 'name']
                    },
                    limit,
                    offset,
                    where: {
                        venue_id: venue.id,
                        status: 0,
                        start_date: {
                            [Op.lte]: now
                        }
                    },
                    order: [
                        ['start_date', 'DESC']
                    ]
                });

                for (let event of events) {
                    let venue = await Venue.findByPk(event.venue.id);
                    event.venue.dataValues.userId = venue.user_id;
                }
            } else {
                events = await Event.findAll({
                    attributes: ['id', 'name', 'start_date', 'status'],
                    include: {
                        association: 'venue',
                        attributes: ['id', 'name']
                    },
                    limit,
                    offset,
                    where: {
                        organizer_id: id,
                        status: 0,
                        start_date: {
                            [Op.lte]: now
                        }
                    },
                    order: [
                        ['start_date', 'DESC']
                    ]
                });

                for (let event of events) {
                    let venue = await Venue.findByPk(event.venue.id);
                    event.venue.dataValues.userId = venue.user_id;
                }
            }

            return res.send(events);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir histórico' })
        }

    },

    async previewPastEvents(req, res) {
        try {
            const { id } = req.params;
            let limit = 5;
            let events;
            let now = moment().format('YYYY-MM-DD');

            const user = await User.findByPk(id);

            if (user.type == 0) {
                const artist = await Artist.findOne({
                    where: { user_id: user.id }
                });

                const artistEvents = await ArtistEvent.findAll({
                    include: [
                        { association: 'artists' },
                        {
                            association: 'events',
                            where: {
                                status: 0,
                                start_date: {
                                    [Op.lte]: now
                                }
                            },
                            include: { association: 'venue' },
                            order: [
                                ['start_date', 'DESC']
                            ]
                        },
                    ],
                    limit,
                    where: {
                        artist_id: artist.id,
                        status: 3
                    }
                });

                events = [];
                artistEvents.forEach((event) => {
                    events.push({
                        id: event.events.id,
                        name: event.events.name,
                        start_date: event.events.start_date,
                        status: event.events.status,
                        venue: {
                            id: event.events.venue.id,
                            name: event.events.venue.name,
                        }
                    });
                });

                for (let event of events) {
                    let venue = await Venue.findByPk(event.venue.id);
                    event.venue.userId = venue.user_id;
                }

            } else if (user.type == 1) {
                const venue = await Venue.findOne({
                    where: { user_id: user.id }
                });

                events = await Event.findAll({
                    attributes: ['id', 'name', 'start_date', 'status'],
                    include: {
                        association: 'venue',
                        attributes: ['id', 'name']
                    },
                    limit,
                    where: {
                        venue_id: venue.id,
                        status: 0,
                        start_date: {
                            [Op.lte]: now
                        }
                    },
                    order: [
                        ['start_date', 'DESC']
                    ]
                });

                for (let event of events) {
                    let venue = await Venue.findByPk(event.venue.id);
                    event.venue.dataValues.userId = venue.user_id;
                }

            } else {
                events = await Event.findAll({
                    attributes: ['id', 'name', 'start_date', 'status'],
                    include: {
                        association: 'venue',
                        attributes: ['id', 'name']
                    },
                    limit,
                    where: {
                        organizer_id: id,
                        status: 0,
                        start_date: {
                            [Op.lte]: now
                        }
                    },
                    order: [
                        ['start_date', 'DESC']
                    ]
                });

                for (let event of events) {
                    let venue = await Venue.findByPk(event.venue.id);
                    event.venue.dataValues.userId = venue.user_id;
                }

            }

            return res.send(events);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir prévia de histórico' })
        }

    },

    async getSchedule(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);

            let venue = {
                id: ''
            };

            let events = [];

            if (user.type === 1) {
                venue = await Venue.findOne({
                    where: { user_id: user.id }
                });
            }

            events = await Event.findAll({
                attributes: ['id', 'name', 'start_date', 'start_time', 'end_time'],
                include: {
                    association: 'venue',
                    attributes: ['id', 'name', 'user_id'],
                },
                where: {
                    [Op.or]: [{ organizer_id: id }, { venue_id: venue.id }],
                },
                order: [
                    ['start_date', 'ASC']
                ]
            });

            if (user.type === 0) {
                let artist = await Artist.findOne({
                    where: { user_id: user.id }
                });

                artistEvents = await Event.findAll({
                    attributes: ['id', 'name', 'start_date', 'start_time', 'end_time'],
                    include: [
                        {
                            association: 'venue',
                            attributes: ['id', 'name', 'user_id'],
                        }, {
                            association: 'invitations',
                            where: {
                                artist_id: artist.id,
                                status: 3
                            }
                        }
                    ],
                    order: [
                        ['start_date', 'ASC']
                    ]
                });

                events = events.concat(artistEvents);

                //ordenar da data menor para maior
                events.sort(function (a, b) {
                    let dateA = new Date(a.start_date),
                        dateB = new Date(b.start_date);
                    if (dateA > dateB) return 1;
                    if (dateA < dateB) return -1;
                    return 0;
                });

            }

            events.forEach((event) => {
                event.dataValues.start_time = moment(event.start_time, 'HH:mm:ss').format("HH:mm");
                event.dataValues.end_time = moment(event.end_time, 'HH:mm:ss').format("HH:mm");
            });

            return res.send(events);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir agenda' })
        }
    },

    async deleteImage(req, res) {
        try {
            const { id } = req.params;

            const eventImage = await EventImage.findOne({ where: { event_id: id } });

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

            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao deletar imagem de evento' })
        }
    }
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const authConfig = require('../config/auth.json');
const moment = require('moment');

//models
const User = require('../models/User');
const ImageUser = require('../models/ImageUser');
const Artist = require('../models/Artist');
const Producer = require('../models/Producer');
const Venue = require('../models/Venue');
const Rider = require('../models/Rider');
const Genre = require('../models/Genre');
const Instrument = require('../models/Instrument');
const Equipment = require('../models/Equipment');
const ArtistEquipment = require('../models/ArtistEquipment');
const ArtistInstrument = require('../models/ArtistInstrument');
const EquipmentVenue = require('../models/EquipmentVenue');
const Address = require('../models/Address');
const Event = require('../models/Event');
const ArtistEvent = require('../models/ArtistEvent');
const Notification = require('../models/Notification');
const GenreVenue = require('../models/GenreVenue');
const ArtistGenre = require('../models/ArtistGenre');
const Post = require('../models/Post');
const EventImage = require('../models/EventImage');
const Solicitation = require('../models/Solicitation');

function generateToken(params = {}) {
    //expirar em 1 ano 
    return jwt.sign(params, authConfig.secret, {
        expiresIn: '365d'
    });

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
            const { username, email, password, type } = req.body

            const user = await User.create({
                username, email, password, type
            });

            user.password = undefined; //nao retornar senha 

            if (type == 0) {

                const { profile: {
                    name, cache, state, city, members, genres, equipment, instruments
                } } = req.body;

                const artist = await Artist.create({
                    name, cache, state, city, members, user_id: user.id
                });

                if (equipment !== undefined) {
                    const equipments = equipment.map(
                        data => {
                            return {
                                artist_id: artist.id,
                                equipment_id: data.id,
                                quantity: data.quantity
                            }
                        });

                    await ArtistEquipment.bulkCreate(equipments);

                }

                if (instruments !== undefined) {
                    const instrument = instruments.map(
                        data => {
                            return {
                                artist_id: artist.id,
                                instrument_id: data.id,
                                quantity: data.quantity
                            }
                        });

                    await ArtistInstrument.bulkCreate(instrument);

                }

                if (genres !== undefined) {
                    artist.setGenres(genres);
                }

                user.dataValues.artistId = artist.id;
            }

            else if (type == 1) {

                const {
                    profile: {
                        name, capacity, genres, equipment,
                        address: { city: cityVenue, district, number, street, uf, zipcode },
                        openinghours: { finalDay, finalHour, initialDay, initialHour }
                    }
                } = req.body;

                const venue = await Venue.create({
                    name, capacity, finalDay, finalHour, initialDay, initialHour, user_id: user.id
                });

                await Address.create({
                    city: cityVenue, district, number, street, uf, zipcode, venue_id: venue.id
                });

                if (equipment !== undefined) {
                    const equipments = equipment.map(
                        data => {
                            return {
                                venue_id: venue.id,
                                equipment_id: data.id,
                                quantity: data.quantity
                            }
                        });

                    await EquipmentVenue.bulkCreate(equipments);
                }

                if (genres !== undefined) {
                    venue.setGenres(genres);
                }

                user.dataValues.venueId = venue.id;

            } else {
                const {
                    profile: { name, state, city }
                } = req.body;

                await Producer.create({ name, chat_permission: 0, state, city, user_id: user.id });
            }

            return res.send({
                user,
                token: generateToken({ id: user.id })
            });

        } catch (err) {
            return res.send({ error: 'Erro ao cadastrar usuário' })
        }

    },

    async storeImage(req, res) {
        try {
            const { filename: key } = req.file;

            const imageUser = await ImageUser.findOne({
                where: { user_id: req.userId }
            });

            if (imageUser) { //remover caso seja update de imagem
                const file = path.resolve(__dirname, '..', '..', 'uploads', 'images', imageUser.name);

                if (fs.existsSync(path)) {
                    fs.unlink(file, function (err) {
                        if (err) throw err;
                        console.log('Arquivo deletado!');
                    });
                }

                await ImageUser.update({
                    name: key
                }, {
                    where: { user_id: req.userId }
                });

            } else {
                await ImageUser.create({
                    user_id: req.userId,
                    name: key
                });
            }

            return res.send({ message: "Imagem inserida com sucesso" })
        } catch (err) {
            return res.send({ error: 'Erro ao inserir imagem' })
        }
    },

    async storeRider(req, res) {
        try {
            const { filename: key } = req.file;

            const artist = await Artist.findAll({ where: { user_id: req.userId } })
            await Rider.create({
                name: key,
                artist_id: artist.id
            });

            return res.send({ message: "Rider inserido com sucesso" })
        } catch (err) {
            return res.send({ error: 'Erro ao inserir rider' })
        }

    },

    async getEquipments(req, res) {
        const equipments = await Equipment.findAll();
        return res.json(equipments);
    },

    async getInstruments(req, res) {
        const instruments = await Instrument.findAll();
        return res.json(instruments);
    },

    async getGenres(req, res) {
        const genres = await Genre.findAll();
        return res.json(genres);
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;
            console.log('back-end:' + username)
            const user = await User.findOne({
                where: {
                    [Op.or]: [{ username }, { email: username }]
                }
            });

            if (!user) {
                return res.send({ error: 'Usuário não encontrado no sistema' })
            }

            if (!await bcrypt.compare(password, user.password)) {
                return res.send({ error: 'Senha incorreta' })
            }

            user.password = undefined; //nao retornar senha 

            if (user.type == 0) {
                const artist = await Artist.findOne({
                    where: { user_id: user.id }
                });
                user.dataValues.artistId = artist.id;
            } else if (user.type == 1) {
                const venue = await Venue.findOne({
                    where: { user_id: user.id }
                });
                user.dataValues.venueId = venue.id;
            }

            //quantidade de novas notificações
            const notifications = await Notification.count({
                where: {
                    user_id: {
                        [Op.eq]: user.id
                    },
                    new: {
                        [Op.eq]: 1
                    }
                }
            });

            user.dataValues.notifications = notifications;

            return res.send({
                user,
                token: generateToken({ id: user.id })
            });
        } catch (err) {
            return res.send({ error: 'Erro realizar login' })
        }
    },

    async recoverPassword(req, res) {
        try {
            const { email } = req.body;

            const account = await User.findOne({
                where: { email }
            });

            if (!account) {
                return res.send({ error: 'Usuário não encontrado no sistema' })
            }

            /*if (account.type == 0) {
                const user = await Venue.findOne({
                    where: { user_id: account.id }
                });
            } else if (account.type == 1) {
                const user = await Artist.findOne({
                    where: { user_id: account.id }
                });
            } else {
                const user = await Producer.findOne({
                    where: { user_id: account.id }
                });
            }

            console.log(user.name);
            return;*/

            //gerar código 6 dígitos 
            let max = 100000, min = 999999, code;

            min = Math.ceil(min);
            max = Math.floor(max);
            code = Math.floor(Math.random() * (max - min)) + min;


            const html = `
            <head>
                <style>
                    .button {
                        background-color: purple; /* Green */
                        border: none;
                        color: white;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        margin: 4px 2px;
                        cursor: pointer;
                    }
                </style>
        </head>
        <body>
            <h4 style="color:purple">Redefinir senha</h4>
            <p>
                Olá, <br><br>
                Recebemos um pedido para redefinir sua senha. <br>
                Para isso é preciso que informe o código abaixo no aplicativo do Feshow. <br>
                <center> <button class="button"> ${code} </button></center>
                <br>
                <h6 style="color:purple">Equipe Feshow</h6>
            </p>
        </body>`;

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'feshowtcc@gmail.com',
                    pass: 'feshowfeshado123'
                }
            });

            await transporter.sendMail({
                from: `Feshow  <feshowtcc@gmail.com>`,
                to: account.email,
                subject: 'Recuperar senha',
                text: 'Recuperar senha',
                html: html
            }).then(meassage => {
                console.log(meassage);
                return res.send({ code })
            }).catch(err => {
                console.log(err)
                return res.send({ error: 'Erro ao enviar e-mail' });
            });
        } catch (err) {
            return res.send({ error: 'Erro ao encontrar usuário' })
        }
    },

    async updatePassword(req, res) {
        try {
            const { email, password } = req.body;

            const hash = await bcrypt.hash(password, 10);

            const user = await User.update({
                password: hash
            }, {
                where: { email }
            });

            if (!user) {
                return res.send({ error: 'Usuário não encontrado no sistema' })
            }

            return res.send({ user })

        } catch (err) {
            return res.send({ error: 'Erro ao alterar senha' })
        }
    },

    async verifyEmail(req, res) {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });

        if (user) {
            return res.send({ error: 'Este e-mail já existe no sistema' })
        }

        return res.status(200).send('ok');

    },

    async verifyUsername(req, res) {
        const { username } = req.body;

        const user = await User.findOne({ where: { username } });

        if (user) {
            return res.send({ error: 'Este username já existe no sistema' })
        }

        return res.status(200).send('ok');
    },

    async verifyEmailUpdate(req, res) {
        const { email } = req.body;


        const user = await User.findOne({
            where: {
                email,
                id: { [Op.ne]: req.userId }
            }
        });

        if (user) {
            return res.send({ error: 'Este e-mail já existe no sistema' })
        }

        return res.status(200).send('ok');

    },

    async verifyUsernameUpdate(req, res) {
        const { username } = req.body;

        const user = await User.findOne({
            where: {
                username,
                id: { [Op.ne]: req.userId }
            }
        });

        if (user) {
            return res.send({ error: 'Este username já existe no sistema' })
        }

        return res.status(200).send('ok');
    },

    async getInvitations(req, res) {
        try {

            const user = await User.findByPk(req.userId);

            let received = [],
                sent = [];

            //recebido do organizador
            let organizerReceived = await ArtistEvent.findAll({
                include: [
                    {
                        association: 'artists',
                        attributes: ['id', 'name']
                    },
                    {
                        association: 'events',
                        attributes: ['id', 'name'],
                        where: {
                            organizer_id: user.id
                        }
                    }
                ],
                where: { status: 2 }
            });

            //enviado pelo organizador
            let organizerSent = await ArtistEvent.findAll({
                include: [
                    {
                        association: 'artists',
                        attributes: ['id', 'name']
                    },
                    {
                        association: 'events',
                        attributes: ['id', 'name'],
                        where: {
                            organizer_id: user.id
                        }
                    }
                ],
                where: { status: 1 }
            });


            if (user.type == 0) {
                const artist = await Artist.findOne({ where: { user_id: user.id } });

                let artistReceived = await ArtistEvent.findAll({
                    include: [
                        {
                            association: 'artists',
                            attributes: ['id', 'name']
                        },
                        {
                            association: 'events',
                            attributes: ['id', 'name']
                        }
                    ],
                    where: [
                        { artist_id: artist.id },
                        { status: 1 }
                    ]
                });

                let artistSent = await ArtistEvent.findAll({
                    include: [
                        {
                            association: 'artists',
                            attributes: ['id', 'name']
                        },
                        {
                            association: 'events',
                            attributes: ['id', 'name']
                        }
                    ],
                    where: [
                        { artist_id: artist.id },
                        { status: 2 }
                    ]
                });

                received = organizerReceived.concat(artistReceived);
                sent = organizerSent.concat(artistSent);

            } else {
                received = organizerReceived;
                sent = organizerSent;
            }

            received.sort(function (a, b) {
                let dateA = new Date(a.updatedAt),
                    dateB = new Date(b.updatedAt);
                //maior para menor
                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;
                return 0;
            });

            sent.sort(function (a, b) {
                let dateA = new Date(a.updatedAt),
                    dateB = new Date(b.updatedAt);
                //maior para menor
                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;
                return 0;
            });

            return res.send({ received, sent });
        } catch (err) {
            return res.send({ error: 'Erro ao exibir convites' })
        }
    },

    async show(req, res) {
        try {
            const { id } = req.params;

            let user = await User.findByPk(id);
            user.password = undefined;

            if (user.type == 0) {

                const artist = await Artist.findOne({
                    include: {
                        association: 'genres'
                    },
                    where: { user_id: user.id }
                });

                const artistInstruments = await ArtistInstrument.findAll({
                    where: { artist_id: artist.id }
                });

                instruments = [];
                for (let artistInstrument of artistInstruments) {
                    let instrument = await Instrument.findByPk(artistInstrument.instrument_id);
                    instruments.push({
                        id: instrument.id,
                        name: instrument.name,
                        quantity: artistInstrument.quantity
                    });
                }

                const artistEquipments = await ArtistEquipment.findAll({
                    where: { artist_id: artist.id }
                });

                equipments = [];
                for (let artistEquipment of artistEquipments) {
                    let equipment = await Equipment.findByPk(artistEquipment.equipment_id);
                    equipments.push({
                        id: equipment.id,
                        name: equipment.name,
                        quantity: artistEquipment.quantity
                    });
                }

                //organizando objeto
                user.dataValues.artistId = artist.id;
                user.dataValues.name = artist.name;
                user.dataValues.description = artist.description;
                user.dataValues.state = artist.state;
                user.dataValues.city = artist.city;
                user.dataValues.members = artist.members;
                user.dataValues.cache = artist.cache;
                user.dataValues.genres = artist.genres;
                user.dataValues.instruments = instruments;
                user.dataValues.equipments = equipments;

            } else if (user.type == 1) {

                const venue = await Venue.findOne({
                    include: [
                        { association: 'address' },
                        { association: 'genres' }
                    ],
                    where: { user_id: user.id }
                });

                const equipmentsVenue = await EquipmentVenue.findAll({
                    where: { venue_id: venue.id }
                });

                equipments = [];
                for (let equipmentVenue of equipmentsVenue) {
                    let equipment = await Equipment.findByPk(equipmentVenue.equipment_id);
                    equipments.push({
                        id: equipment.id,
                        name: equipment.name,
                        quantity: equipmentVenue.quantity
                    });
                }

                let openinghours = {
                    initialHour: moment(venue.initialHour, 'HH:mm:ss').format("HH:mm"),
                    finalHour: moment(venue.finalHour, 'HH:mm:ss').format("HH:mm"),
                    initialDay: venue.initialDay,
                    finalDay: venue.finalDay
                }

                //organizando objeto
                user.dataValues.venueId = venue.id;
                user.dataValues.name = venue.name;
                user.dataValues.description = venue.description;
                user.dataValues.openinghours = openinghours;
                user.dataValues.capacity = venue.capacity;
                user.dataValues.genres = venue.genres;
                user.dataValues.address = venue.address;
                user.dataValues.equipments = equipments;

            } else {
                const producer = await Producer.findOne({
                    where: { user_id: user.id }
                });

                user.dataValues.producerId = producer.id;
                user.dataValues.name = producer.name;
                user.dataValues.description = producer.description;
                user.dataValues.state = producer.state;
                user.dataValues.city = producer.city;

            }
            const userImage = await ImageUser.findOne({ where: { user_id: id } });
            user.dataValues.imageStatus = userImage ? true : false;

            return res.send(user);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir perfil do usuário' })
        }
    },

    async getImage(req, res) {
        try {
            const { id } = req.params;

            const userImage = await ImageUser.findOne({ where: { user_id: id } });

            if (userImage) {
                const file = path.resolve(__dirname, '..', '..', 'uploads', 'images', userImage.name);
                if (fs.existsSync(file)) {
                    return res.sendFile(file);
                } else {
                    return res.send({ msg: 'Usuário não possui imagem' })
                }
            } else {
                return res.send({ msg: 'Usuário não possui imagem' })
            }
        } catch (err) {
            return res.send({ error: 'Erro ao exibir imagem' })
        }

    },

    async getNotifications(req, res) {
        try {
            let notifications = await Notification.findAll({
                where: { user_id: req.userId },
                order: [
                    ['createdAt', 'DESC']
                ]
            });

            notifications.forEach((notification) => {
                notification.dataValues.time = getTime(notification.createdAt);
            });

            await Notification.update({
                new: 0
            }, {
                where: {
                    user_id: req.userId,
                    new: {
                        [Op.eq]: 1
                    }
                }
            });

            return res.send(notifications);

        } catch (err) {
            return res.send({ error: 'Erro ao exibir notificações' })
        }
    },

    async updateGenres(req, res) {
        try {
            const { genres } = req.body;
            const user = await User.findByPk(req.userId);

            if (user.type === 0) {
                const artist = await Artist.findOne({
                    where: { user_id: user.id }
                })
                await ArtistGenre.destroy({
                    where: { artist_id: artist.id }
                });

                if (genres !== undefined) {
                    artist.setGenres(genres);
                }

            } else if (user.type === 1) {

                const venue = await Venue.findOne({
                    where: { user_id: user.id }
                })
                await GenreVenue.destroy({
                    where: { venue_id: venue.id }
                });

                if (genres !== undefined) {
                    venue.setGenres(genres);
                }
            }
            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao editar generos' })
        }
    },

    async updateInstruments(req, res) {
        try {
            const { instruments } = req.body;

            const user = await User.findByPk(req.userId);

            const artist = await Artist.findOne({
                where: { user_id: user.id }
            });

            await ArtistInstrument.destroy({
                where: { artist_id: artist.id }
            });

            if (instruments !== undefined) {
                const instrument = instruments.map(
                    data => {
                        return {
                            artist_id: artist.id,
                            instrument_id: data.id,
                            quantity: data.quantity
                        }
                    });

                await ArtistInstrument.bulkCreate(instrument);
            }

            return res.status(200).send('ok');
        } catch (err) {
            return res.send({ error: 'Erro ao editar instrumentos' })
        }

    },

    async updateEquipments(req, res) {
        try {
            const { equipments } = req.body;

            const user = await User.findByPk(req.userId);

            if (user.type == 0) {
                const artist = await Artist.findOne({
                    where: { user_id: user.id }
                });

                await ArtistEquipment.destroy({
                    where: { artist_id: artist.id }
                });

                if (equipments !== undefined) {
                    const equip = equipments.map(
                        data => {
                            return {
                                artist_id: artist.id,
                                equipment_id: data.id,
                                quantity: data.quantity
                            }
                        });

                    await ArtistEquipment.bulkCreate(equip);

                }
            } else if (user.type == 1) {
                const venue = await Venue.findOne({
                    where: { user_id: user.id }
                });

                await EquipmentVenue.destroy({
                    where: { venue_id: venue.id }
                });

                if (equipments !== undefined) {
                    const equip = equipments.map(
                        data => {
                            return {
                                venue_id: venue.id,
                                equipment_id: data.id,
                                quantity: data.quantity
                            }
                        });

                    await EquipmentVenue.bulkCreate(equip);
                }
            }

            return res.status(200).send('ok');
        } catch (err) {
            return res.send({ error: 'Erro ao editar equipamentos' })
        }

    },

    async update(req, res) {
        try {
            let { username, email } = req.body;

            const user = await User.findByPk(req.userId);

            await User.update({
                username, email
            }, {
                where: { id: user.id }
            });

            if (user.type == 0) {
                const { profile: {
                    name, cache, state, description, city, members, genres, equipment, instruments
                } } = req.body;

                let descript;

                if (description !== "") {
                    descript = description;
                } else {
                    descript = null;
                }

                const artist = await Artist.findOne({
                    where: { user_id: user.id }
                });

                await Artist.update({
                    name, description: descript, cache, state, city, members
                }, {
                    where: { id: artist.id }
                });

                await ArtistEquipment.destroy({
                    where: { artist_id: artist.id }
                });

                if (equipment !== undefined) {
                    const equipments = equipment.map(
                        data => {
                            return {
                                artist_id: artist.id,
                                equipment_id: data.id,
                                quantity: data.quantity
                            }
                        });

                    await ArtistEquipment.bulkCreate(equipments);
                }

                await ArtistInstrument.destroy({
                    where: { artist_id: artist.id }
                });

                if (instruments !== undefined) {
                    const instrument = instruments.map(
                        data => {
                            return {
                                artist_id: artist.id,
                                instrument_id: data.id,
                                quantity: data.quantity
                            }
                        });

                    await ArtistInstrument.bulkCreate(instrument);
                }

                await ArtistGenre.destroy({
                    where: { artist_id: artist.id }
                });

                if (genres !== undefined) {
                    artist.setGenres(genres);
                }
            }

            else if (user.type == 1) {
                const {
                    profile: {
                        name, description, capacity, genres, equipment,
                        address: { city: cityVenue, district, number, street, uf, zipcode },
                        openinghours: { finalDay, finalHour, initialDay, initialHour }
                    }
                } = req.body;

                let descript;

                if (description !== "") {
                    descript = description;
                } else {
                    descript = null;
                }

                const venue = await Venue.findOne({
                    where: { user_id: user.id }
                });

                await Venue.update({
                    name, description: descript, capacity, finalDay, finalHour, initialDay, initialHour
                }, {
                    where: { id: venue.id }
                });

                await Address.update({
                    city: cityVenue, district, number, street, uf, zipcode
                }, {
                    where: { venue_id: venue.id }
                });

                await EquipmentVenue.destroy({
                    where: { venue_id: venue.id }
                });

                if (equipment !== undefined) {
                    const equipments = equipment.map(
                        data => {
                            return {
                                venue_id: venue.id,
                                equipment_id: data.id,
                                quantity: data.quantity
                            }
                        });

                    await EquipmentVenue.bulkCreate(equipments);
                }

                await GenreVenue.destroy({
                    where: { venue_id: venue.id }
                });

                if (genres !== undefined) {
                    venue.setGenres(genres);
                }

            } else {
                const {
                    profile: { name, description, state, city }
                } = req.body;

                let descript;

                if (description !== "") {
                    descript = description;
                } else {
                    descript = null;
                }

                await Producer.update({
                    name, description: descript, chat_permission: 0, state, city
                }, {
                    where: { user_id: user.id }
                });
            }

            return res.status(200).send('ok');
        } catch (err) {
            return res.send({ error: 'Erro ao editar usuário' })
        }
    },

    async delete(req, res) {
        try {
            const user = await User.findByPk(req.userId);

            //Remover imagem
            const imageUser = await ImageUser.findOne({
                where: { user_id: user.id }
            });

            if (imageUser) {
                const file = path.resolve(__dirname, '..', '..', 'uploads', 'images', imageUser.name);

                if (fs.existsSync(path)) {
                    fs.unlink(file, function (err) {
                        if (err) throw err;
                        console.log('Arquivo deletado!');
                    });
                }

                await ImageUser.destroy({
                    where: { user_id: user.id }
                });
            }

            // remover postagens 
            await Post.destroy({
                where: { user_id: user.id }
            });

            // remover notificações
            await Notification.destroy({
                where: { user_id: user.id }
            });

            // remover solicitações enviada pelo user logado
            await Solicitation.destroy({
                where: { user_id: user.id }
            });

            //pegar eventos organzados pelo usuário logado
            let events = await Event.findAll({
                where: { organizer_id: user.id }
            });

            if (events.length > 0) {
                for (let event of events) {
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
                }
            }

            if (user.type == 0) {
                let artist = await Artist.findOne({
                    where: { user_id: user.id }
                })

                //remover artist_events
                await ArtistEvent.destroy({
                    where: { artist_id: artist.id }
                });

                // remover equipametos
                await ArtistEquipment.destroy({
                    where: { artist_id: artist.id }
                });

                // remover instrumentos 
                await ArtistInstrument.destroy({
                    where: { artist_id: artist.id }
                });

                // remover generos 
                await ArtistGenre.destroy({
                    where: { artist_id: artist.id }
                });

                // remover artist_events
                await ArtistEquipment.destroy({
                    where: { artist_id: artist.id }
                });

                //remover artista
                await Artist.destroy({
                    where: { id: artist.id }
                });

            } else if (user.type == 1) {
                let venue = await Venue.findOne({
                    where: { user_id: user.id }
                });

                // remover endereço
                await Address.destroy({
                    where: { venue_id: venue.id }
                });

                // remover equipametos 
                await EquipmentVenue.destroy({
                    where: { venue_id: venue.id }
                });

                // remover generos 
                await GenreVenue.destroy({
                    where: { venue_id: venue.id }
                });

                // remover eventos que acontecerão neste espaço 
                let events = await Event.findAll({
                    where: { venue_id: venue.id }
                });

                if (events.length > 0) {
                    for (let event of events) {
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
                    }
                }

                // remover solicitações de requisição de evento que acontecerão neste espaço
                await Solicitation.destroy({
                    where: { venue_id: venue.id }
                });

                //remover espaço
                await Venue.destroy({
                    where: { id: venue.id }
                });
            } else {

                //remover produtor
                await Producer.destroy({
                    where: { user_id: user.id }
                });

            }
            await User.destroy({
                where: { id: user.id }
            });

            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao deletar usuário' })
        }
    },

    async deleteImage(req, res) {
        try {
            const user = await User.findByPk(req.userId);

            //Remover imagem
            const imageUser = await ImageUser.findOne({
                where: { user_id: user.id }
            });

            if (imageUser) {
                const file = path.resolve(__dirname, '..', '..', 'uploads', 'images', imageUser.name);

                if (fs.existsSync(path)) {
                    fs.unlink(file, function (err) {
                        if (err) throw err;
                        console.log('Arquivo deletado!');
                    });
                }

                await ImageUser.destroy({
                    where: { user_id: user.id }
                });
            }
            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao deletar imagem de usuário' })
        }
    }
};
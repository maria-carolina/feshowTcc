const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const authConfig = require('../config/auth.json');

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

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 84600
    });

}

module.exports = {
    async store(req, res) {
        const { username, email, password, type } = req.body

        try {
            const user = await User.create({
                username, email, password, type
            });

            user.password = undefined; //nao retornar senha 

            if (type == 0) {

                const { profile: {
                    name, cache, city, members, genres, equipment, instruments
                } } = req.body;

                const artist = await Artist.create({
                    name, cache, city, members, user_id: user.id
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


            } else {
                const {
                    profile: { name, city }
                } = req.body;

                await Producer.create({ name, chat_permission: 0, city, user_id: user.id });
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

    },

    async storeRider(req, res) {
        const { filename: key } = req.file;

        const artist = await Artist.findAll({ where: { user_id: req.userId } })
        await Rider.create({
            name: key,
            artist_id: artist.id
        });

        return res.send({ message: "Rider inserido com sucesso" })

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

        return res.send({
            user,
            token: generateToken({ id: user.id })
        });
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
    }
};
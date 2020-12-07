const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
const User = require('../models/User');
const Artist = require('../models/Artist');
const Producer = require('../models/Producer');
const Venue = require('../models/Venue');
const Rider = require('../models/Rider');
const Genre = require('../models/Genre');
const Instrument = require('../models/Instrument');
const Equipment = require('../models/Equipment');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 84600
    });

}

module.exports = {
    async store(req, res) {
        const {
            username, email, password, type,
            profile: {
                name, cache, city, members,
            },
            genre,
        } = req.body;

        try {
            const user = await User.create({
                username, email, password, type
            });

            user.password = undefined; //nao retornar senha 

            if (type == 0) {
                const artist = await Artist.create({
                    name, cache, city, members, user_id: user.id
                });
    
                artist.setGenres(genre);
            }
    
            /*else if(type == 1){ 
                const venue = await Venue.create({
                    name, cache, city, members, user_id: user.id
                });
    
                venue.setGenres(genre);
            } else {
    
            }*/

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

        const user = await User.update({
            image: key
        }, {
            where: { id: 35 }
        });

        return res.send({ message: "Imagem inserida com sucesso" })

    },

    async storeRider(req, res) {
        const { filename: key } = req.file;

        const user = await Rider.create({
            name: key,
            artist_id: 13
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
    }

};
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

        //try {
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

            const equipments = equipment.map(
                data => {
                    return {
                        artist_id: artist.id,
                        equipment_id: data.id,
                        quantity: data.quantity
                    }
                });

            const instrument = instruments.map(
                data => {
                    return {
                        artist_id: artist.id,
                        instrument_id: data.id,
                        quantity: data.quantity
                    }
                });

            await ArtistEquipment.bulkCreate(equipments);
            await ArtistInstrument.bulkCreate(instrument);
            artist.setGenres(genres);
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

            const equipments = equipment.map(
                data => {
                    return {
                        venue_id: venue.id,
                        equipment_id: data.id,
                        quantity: data.quantity
                    }
                });

            venue.setGenres(genres);
            await EquipmentVenue.bulkCreate(equipments);

        } else {
            const {
                profile: { name, city} 
            } = req.body;

            await Producer.create({ name, chat_permission: 0, city, user_id: user.id });
        }

        return res.send({
            user,
            token: generateToken({ id: user.id })
        });

        //  } catch (err) {
        //       return res.send({ error: 'Erro ao cadastrar usuário' })
        // }

    },

    async storeImage(req, res) {
        const { filename: key } = req.file;

        const user = await User.update({
            image: key
        }, {
            where: { id: req.userId }
        });

        return res.send({ message: "Imagem inserida com sucesso" })

    },

    async storeRider(req, res) {
        const { filename: key } = req.file;

        const artist = await Artist.findAll({ where: { user_id: req.userId }})
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
    }

};
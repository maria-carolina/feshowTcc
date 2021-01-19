const ArtistEvent = require('../models/ArtistEvent');
const Artist = require('../models/Artist');
const Event = require('../models/Event');
const Address = require('../models/Address');
const GenreVenue = require('../models/GenreVenue');
const User = require('../models/User');
const EventImage = require('../models/EventImage');

const { Op } = require('sequelize');
const moment = require('moment');

function verifyArtist(artistId, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].artist_id === artistId) {
            return true;
        }
    }
    return false;
}

function verifyGenre(id, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].genre_id === id) {
            return true;
        }
    }
    return false;
}

function isUnique(id, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return false;
        }
    }
    return true;
}

module.exports = {

    /**
     * status convites/line-up
     *  1 - organizador convida artista
     *  2 - artista solicita participação
     *  3 - artista confirmado no line-up
     */

    async store(req, res) {
        try {
            const { artistId, eventId, date, time } = req.body;

            const event = await Event.findByPk(eventId);

            //verificar artista no evento
            const artist = await ArtistEvent.findAll({
                where: {
                    event_id: eventId,
                    artist_id: artistId
                }
            })

            if (artist.length > 0) {
                return res.send({ error: 'Artista já está no evento' });
            }

            //verificar se não há show acontecendo
            const verifyLineup = await ArtistEvent.findAll({
                where: {
                    event_id: eventId,
                    start_time: { [Op.eq]: time }
                }
            });

            if (verifyLineup.length > 0) {
                return res.send({ error: 'Há um artista encaixado neste horário' });
            }

            await ArtistEvent.create({
                event_id: eventId,
                artist_id: artistId,
                date,
                start_time: time,
                status: 1
            });

            return res.status(200).send('ok');


        } catch (err) {
            return res.send({ error: 'Erro ao enviar convite a artista' })
        }
    },

    async getSuggestions(req, res) {
        try {
            const { id } = req.params;
            let artistVerified = [],
                artistsCity = [],
                cityGenre = [],
                artistsGenres = [],
                otherArtists = [],
                artists = [];

            let result, resultGenre;

            const artistsAll = await Artist.findAll({
                attributes: ['id', 'name', 'city'],
                include: {
                    association: 'genres',
                    attributes: ['id', 'name']
                }
            });
            const event = await Event.findByPk(id);
            const address = await Address.findByPk(event.venue_id);
            const genreVenue = await GenreVenue.findAll({ where: { venue_id: event.venue_id } })

            const invitations = await ArtistEvent.findAll({
                where: { event_id: id }
            });

            artistsAll.forEach((artist) => {
                //pegar os que nao estão no evento
                result = verifyArtist(artist.id, invitations)
                if (!result) {
                    artistVerified.push(artist);
                }
            });

            artistVerified.forEach((artist) => {
                artist.genres.forEach((genre) => {
                    resultGenre = verifyGenre(genre.id, genreVenue)

                    if (artist.city === address.city) {
                        if (resultGenre) {
                            if (isUnique(artist.id, cityGenre) && isUnique(artist.id, artistsCity))
                                cityGenre.push(artist);
                        } else {
                            if (isUnique(artist.id, cityGenre) && isUnique(artist.id, artistsCity))
                                artistsCity.push(artist);
                        }
                    }
                    else {
                        if (resultGenre) {
                            if (isUnique(artist.id, artistsGenres) && isUnique(artist.id, otherArtists))
                                artistsGenres.push(artist);
                        } else {
                            if (isUnique(artist.id, artistsGenres) && isUnique(artist.id, otherArtists))
                                otherArtists.push(artist);
                        }
                    }
                });

            });
            artists = cityGenre.concat(artistsCity, artistsGenres, otherArtists);

            return res.send(artists);

        } catch (err) {
            return res.send({ error: 'Erro ao exibir sugestões' })
        }

    },

    async search(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            let artistVerified = [];
            let status;

            const invitations = await ArtistEvent.findAll({
                where: { event_id: id }
            });

            const artists = await Artist.findAll({
                attributes: ['id', 'name'],
                where: {
                    name: {
                        [Op.like]: '%' + name + '%'
                    }
                }
            });

            artists.forEach((artist) => {
                result = verifyArtist(artist.id, invitations)
                if (!result) {
                    status = 0  //fora do evento
                } else {
                    status = 1  //dentro do evento
                }

                artistVerified.push({
                    id: artist.id,
                    name: artist.name,
                    status: status
                });
            });

            return res.send(artistVerified);
        } catch (err) {
            return res.send({ error: 'Erro ao realizar busca' })
        }
    },

    async removeAssociation(req, res) {
        try {
            const { artistId, eventId } = req.body;

            const user = await User.findByPk(req.userId);

            const artistEvent = await ArtistEvent.findOne({
                where: [
                    { artist_id: artistId },
                    { event_id: eventId }
                ]
            });

            if (!artistEvent)
                return res.send({ error: 'Relação não encontrada' });

            const evento = await Event.findByPk(eventId);

            if (user.type == 0 && artistEvent.status == 1) {
                //artista recusa convite
                console.log("saiuu")
            } else if (user.type == 0 && artistEvent.status == 2) {
                //artista cancelou solicitação

            } else if (user.type == 0 && artistEvent.status == 3) {
                //artista saiu do evento 
                //verificar se ta fechado
                if (evento.status == 0)
                    return res.send({ error: 'Evento está fechado' })

            } else if (user.type == 1 && artistEvent.status == 1) {
                //organizador cancela convite

            } else if (user.type == 0 && artistEvent.status == 2) {
                //organizador recusa solicitação

            } else if (user.type == 1 && artistEvent.status == 3) {
                //remover artista
                //verificar se ta fechado
                if (evento.status == 0)
                    return res.send({ error: 'Evento está fechado' })
            }

            await ArtistEvent.destroy({
                where: [
                    { artist_id: artistId },
                    { event_id: eventId }
                ]
            });

            return res.status(200).send('ok');
        } catch (err) {
            return res.send({ error: 'Erro ao remover artista do evento' })
        }
    },

    async acceptParticipation(req, res) {

        try {
            const { artistId, eventId } = req.body;

            await ArtistEvent.update({
                status: 3
            }, {
                where: [
                    { artist_id: artistId },
                    { event_id: eventId }
                ]
            });

            return res.status(200).send('ok');
        } catch (err) {
            return res.send({ error: 'Erro ao aceitar participaçãoem evento' })
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
    }

};
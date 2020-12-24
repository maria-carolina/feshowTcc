const ArtistEvent = require('../models/ArtistEvent');
const Artist = require('../models/Artist');
const Event = require('../models/Event');
const Address = require('../models/Address');
const GenreVenue = require('../models/GenreVenue');

const { Op } = require('sequelize');

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

            if (date < event.start_date || date > event.end_date) {
                return res.send({ error: 'O evento não acontecerá nesta data' })
            }

            if(time < event.start_time || time > event.end_time) {
                return res.send({ error: 'O evento não acontecerá neste horário' })
            }
            
            const artist = await ArtistEvent.findAll({ 
                where: { 
                    event_id: eventId,
                    artist_id: artistId
                }
            })

            if (artist.length > 0){
                return res.send({ error: 'Artista já incluso no evento'})
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

    },

    async search(req, res) {

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

    }
};
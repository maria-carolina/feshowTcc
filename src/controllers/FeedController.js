const Artist = require('../models/Artist');
const Producer = require('../models/Producer');
const Venue = require('../models/Venue');
const User = require('../models/User');
const Event = require('../models/Event');

function inArray(id, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return true; //existe no array
        }
    }
    return false;
}

module.exports = {
    async feedArtist(req, res) {

        const user = await User.findByPk(req.userId);

        let city, resultGenre, artistAuth;
        let artistsCity = [],
            cityGenre = [],
            artistsGenre = [],
            otherArtists = [],
            artists = [],
            genres = [];

        if (user.type == 0) {
            artistAuth = await Artist.findOne({
                include: { association: 'genres' },
                where: { user_id: user.id }
            });
            city = artistAuth.city;
            genres = artistAuth.genres;

        } else if (user.type == 1) {
            const venueAuth = await Venue.findOne({
                include: [
                    { association: 'address' },
                    { association: 'genres' }
                ],
                where: { user_id: user.id }
            });
            city = venueAuth.address.city;
            genres = venueAuth.genres;

        } else {
            const producerAuth = await Producer.findOne({ where: { user_id: user.id } });
            city = producerAuth.city;
        }

        let artistsAll = await Artist.findAll({
            attributes: ['id', 'name', 'city', 'user_id'],
            include: {
                association: 'genres',
                attributes: ['id', 'name']
            }
        });

        if (genres.length === 0) { //caso usuario logado nao tenha generos

            artistsAll.forEach((artist) => {
                if (artist.city === city) {
                    artistsCity.push(artist);
                } else {
                    otherArtists.push(artist);
                }
            });

            artists = artistsCity.concat(otherArtists);
            return res.send(artists);

        } else {
            artistsAll.forEach((artist) => {
                if (artist.genres.length > 0) {
                    artist.genres.forEach((genre) => {
                        resultGenre = inArray(genre.id, genres)

                        if (artist.city === city && resultGenre) {
                            cityGenre.push(artist);
                        } else if (artist.city === city && !resultGenre) {
                            artistsCity.push(artist);
                        } else if (artist.city !== city && resultGenre) {
                            artistsGenre.push(artist);
                        } else {
                            otherArtists.push(artist);
                        }
                    });
                } else { //artista nao tem genero
                    if (artist.city === city) {
                        artistsCity.push(artist);
                    } else {
                        otherArtists.push(artist);
                    }
                }

            });
        }
        artistsAll = cityGenre.concat(artistsCity, artistsGenre, otherArtists);

        //remover duplicidade
        artistsAll.forEach((artist) => {

            if (user.type === 0) { //remover artista logado da lista 
                if (artistAuth.id !== artist.id) {
                    !inArray(artist.id, artists) ? artists.push(artist) : ''
                }
            } else {
                !inArray(artist.id, artists) ? artists.push(artist) : ''
            }

        });

        return res.send(artists);
    },

    async feedVenue(req, res) {
        const user = await User.findByPk(req.userId);

        let city, resultGenre, venueAuth;
        let venuesCity = [],
            cityGenre = [],
            venuesGenre = [],
            otherVenues = [],
            venues = [],
            genres = [];

        if (user.type == 0) {
            const artistAuth = await Artist.findOne({
                include: { association: 'genres' },
                where: { user_id: user.id }
            });
            city = artistAuth.city;
            genres = artistAuth.genres;

        } else if (user.type == 1) {
            venueAuth = await Venue.findOne({
                include: [
                    { association: 'address' },
                    { association: 'genres' }
                ],
                where: { user_id: user.id }
            });
            city = venueAuth.address.city;
            genres = venueAuth.genres;

        } else {
            const producerAuth = await Producer.findOne({ where: { user_id: user.id } });
            city = producerAuth.city;
        }

        let venuesAll = await Venue.findAll({
            attributes: ['id', 'name', 'user_id'],
            include: [
                {
                    association: 'genres',
                    attributes: ['id', 'name']
                },
                { association: 'address' }
            ]
        });

        if (genres.length === 0) { //caso usuario logado nao tenha generos

            venuesAll.forEach((venue) => {
                if (venue.address.city === city) {
                    venuesCity.push(venue);
                } else {
                    otherVenues.push(venue);
                }
            });

            venues = venuesCity.concat(otherVenues);
            return res.send(venues);

        } else {
            venuesAll.forEach((venue) => {
                if (venue.genres.length > 0) {
                    venue.genres.forEach((genre) => {
                        resultGenre = inArray(genre.id, genres)

                        if (venue.address.city === city && resultGenre) {
                            cityGenre.push(venue);
                        } else if (venue.address.city === city && !resultGenre) {
                            venuesCity.push(venue);
                        } else if (venue.address.city !== city && resultGenre) {
                            venuesGenre.push(venue);
                        } else {
                            otherVenues.push(venue);
                        }
                    });
                } else { //espaço nao tem genero
                    if (venue.address.city === city) {
                        venuesCity.push(venue);
                    } else {
                        otherVenues.push(venue);
                    }
                }

            });
        }
        venuesAll = cityGenre.concat(venuesCity, venuesGenre, otherVenues);

        //remover duplicidade
        venuesAll.forEach((venue) => {

            if (user.type === 1) { //remover espaço logado da lista 
                if (venueAuth.id !== venue.id) {
                    !inArray(venue.id, venues) ? venues.push(venue) : ''
                }
            } else {
                !inArray(venue.id, venues) ? venues.push(venue) : ''
            }

        });

        return res.send(venues);
    },

    async feedEvent(req, res) {

        const events = await Event.findAll({
            attributes: ['id', 'name', 'start_date', 'start_time', 'status'],
            include: [
                {
                    association: 'venue',
                    attributes: ['id', 'name', 'user_id'],
                    include: {
                        association: 'address',
                        attributes: ['city']
                    }
                },
                {
                    association: 'organizer',
                    attributes: ['id']
                },
                {
                    association: 'lineup',
                    attributes: ['status'],
                    include: {
                        association: 'artists',
                        attributes: ['name']
                    }
                }
            ]
        });
        return res.send(events);
    }
};
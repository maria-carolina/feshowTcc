const Artist = require('../models/Artist');
const Producer = require('../models/Producer');
const Venue = require('../models/Venue');
const User = require('../models/User');
const Event = require('../models/Event');
const ImageUser = require('../models/ImageUser');

const moment = require('moment');

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
        try {
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
                attributes: ['id', 'name', 'members', 'city', 'user_id'],
                include: {
                    association: 'genres',
                    attributes: ['name']
                }
            });

            for (let artist of artistsAll) {
                //status se existe ou não imagem
                let image = await ImageUser.findOne({ where: { user_id: artist.user_id } });
                let imageStatus = image ? true : false;
                artist.dataValues.image = imageStatus;
            }

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
        } catch (err) {
            return res.send({ error: 'Erro ao exibir feed de artistas' })
        }
    },

    async feedVenue(req, res) {
        try {
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
                attributes: ['id', 'name', 'capacity', 'user_id'],
                include: [
                    {
                        association: 'genres',
                        attributes: ['name']
                    },
                    {
                        association: 'address',
                        attributes: ['city']
                    }
                ]
            });

            for (let venue of venuesAll) {
                //status se existe ou não imagem
                let image = await ImageUser.findOne({ where: { user_id: venue.user_id } });
                let imageStatus = image ? true : false;
                venue.dataValues.image = imageStatus;
            }

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
        } catch (err) {
            return res.send({ error: 'Erro ao exibir feed de espaços' })
        }
    },

    async feedEvent(req, res) {
        try {
            const user = await User.findByPk(req.userId);

            let city, resultGenre, artistAuth;
            let eventsCity = [],
                cityGenre = [],
                eventsGenre = [],
                otherEvents = [],
                events = [],
                genres = [];

            if (user.type == 0) {
                artistAuth = await Artist.findOne({
                    include: { association: 'genres' },
                    where: { user_id: user.id }
                });
                city = artistAuth.city;
                genres = artistAuth.genres;

            } else if (user.type == 1) {
                let venueAuth = await Venue.findOne({
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

            let eventsAll = await Event.findAll({
                attributes: ['id', 'name', 'start_date', 'start_time', 'end_time', 'status'],
                include: [
                    {
                        association: 'venue',
                        attributes: ['id', 'name', 'user_id'],
                        include: [
                            {
                                association: 'address',
                                attributes: ['city']
                            }, {
                                association: 'genres'
                            }
                        ]
                    },
                    {
                        association: 'organizer',
                        attributes: ['id']
                    }
                ]
            });

            for (let event of eventsAll) { //artistas no lineup
                let artists = await Artist.findAll({
                    attributes: ['id', 'name'],
                    include: {
                        association: 'events',
                        attributes: [],
                        where: { status: 3 }
                    }
                });
                event.dataValues.lineup = artists;

                //ajuste horario e data
                event.dataValues.start_date = moment(event.start_date, 'YYYY-MM-DD').format("DD/MM/YYYY");
                event.dataValues.start_time = moment(event.start_time, 'HH:mm:ss').format("HH:mm");
                event.dataValues.end_time = moment(event.end_time, 'HH:mm:ss').format("HH:mm");

                //pegar nome do organizador
                let userOrganizer = await User.findByPk(event.organizer.id);
                if (userOrganizer.type === 0) {
                    let artist = await Artist.findOne({
                        where: { user_id: userOrganizer.id }
                    });
                    event.organizer.dataValues.name = artist.name;

                } else if (userOrganizer.type === 1) {
                    let venue = await Venue.findOne({
                        where: { user_id: userOrganizer.id }
                    });
                    event.organizer.dataValues.name = venue.name;

                } else {
                    let producer = await Producer.findOne({
                        where: { user_id: userOrganizer.id }
                    });
                    event.organizer.dataValues.name = producer.name;
                }
            }

            // organização do feed

            if (genres.length === 0) { //caso usuario logado nao tenha generos

                eventsAll.forEach((event) => {
                    if (event.venue.address.city === city) {
                        eventsCity.push(event);
                    } else {
                        otherEvents.push(event);
                    }
                    event.dataValues.inEvent = false;
                });

                events = eventsCity.concat(otherEvents);
                return res.send(events);

            } else {
                eventsAll.forEach((event) => {
                    if (event.venue.genres.length > 0) {
                        event.venue.genres.forEach((genre) => {
                            resultGenre = inArray(genre.id, genres)

                            if (event.venue.address.city === city && resultGenre) {
                                cityGenre.push(event);
                            } else if (event.venue.address.city === city && !resultGenre) {
                                eventsCity.push(event);
                            } else if (event.venue.address.city !== city && resultGenre) {
                                eventsGenre.push(event);
                            } else {
                                otherEvents.push(event);
                            }
                        });
                    } else { //espaço nao tem genero
                        if (event.venue.address.city === city) {
                            eventsCity.push(event);
                        } else {
                            otherEvents.push(event);
                        }
                    }

                });
            }

            eventsAll = cityGenre.concat(eventsCity, eventsGenre, otherEvents);

            //remover duplicidade
            eventsAll.forEach((event) => {
                if (user.type === 0) { //inEvent serve para ver se artista logado está no evento
                    event.dataValues.lineup.forEach((lineup) => {
                        if (artistAuth.id === lineup.id) {
                            event.dataValues.inEvent = true;
                        } else {
                            event.dataValues.inEvent = false;
                        }
                    });
                } else {
                    event.dataValues.inEvent = false;
                }
                !inArray(event.id, events) ? events.push(event) : ''
            });

            return res.send(events);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir feed de eventos' })
        }
    },

    async feedProducer(req, res) {
        try {
            const user = await User.findByPk(req.userId);

            let producerAuth, city;
            let producersCity = [],
                otherProducers = [],
                producers = [];

            if (user.type == 0) {
                let artistAuth = await Artist.findOne({
                    where: { user_id: user.id }
                });
                city = artistAuth.city;

            } else if (user.type == 1) {
                let venueAuth = await Venue.findOne({
                    where: { user_id: user.id }
                });
                city = venueAuth.address.city;

            } else {
                producerAuth = await Producer.findOne({ where: { user_id: user.id } });
                city = producerAuth.city;
            }

            let producersAll = await Producer.findAll();

            for (let producer of producersAll) {

                if (producer.city === city) {
                    producersCity.push(producer);
                } else {
                    otherProducers.push(producer);
                }

                let image = await ImageUser.findOne({ where: { user_id: producer.user_id } });
                let imageStatus = image ? true : false;
                producer.dataValues.image = imageStatus;
            };

            producers = producersCity.concat(otherProducers);
            return res.send(producers)
        } catch (err) {
            return res.send({ error: 'Erro ao exibir feed de produtores' })
        }
    }
};
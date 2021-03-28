const Artist = require('../models/Artist');
const Producer = require('../models/Producer');
const Venue = require('../models/Venue');
const User = require('../models/User');
const Event = require('../models/Event');
const ImageUser = require('../models/ImageUser');
const ArtistEquipment = require('../models/ArtistEquipment');
const ArtistEvent = require('../models/ArtistEvent');

const moment = require('moment');
const { Op } = require('sequelize');


function inArray(id, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return true; //existe no array
        }
    }
    return false;
}

function shuffle(array) { //para misturar array do search
    let m = array.length, t, i;

    while (m) {

        i = Math.floor(Math.random() * m--);

        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
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
                    attributes: ['id', 'name']
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
                        attributes: ['id', 'name']
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

            let venueAuth = {
                id: ''
            }

            if (user.type == 0) {
                artistAuth = await Artist.findOne({
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
                                association: 'genres',
                                attributes: ['id', 'name']
                            }
                        ]
                    },
                    {
                        association: 'organizer',
                        attributes: ['id']
                    }
                ],
                where: {
                    organizer_id: {
                        [Op.ne]: user.id
                    },
                    status: {
                        [Op.ne]: 0
                    },
                    venue_id: {
                        [Op.ne]: venueAuth.id
                    }
                }
            });

            //remover eventos com artista logado que estejam vinculados ao evento
            if (user.type === 0) {
                for (let event of eventsAll) { //artistas no lineup        
                    let artistEvents = await ArtistEvent.findAll({
                        where: {
                            artist_id: artistAuth.id,
                            event_id: event.id
                        }
                    });

                    if (artistEvents.length == 0) {
                        events.push(event);
                    }
                }
                eventsAll = events;
                events = [];
            }

            for (let event of eventsAll) { //artistas no lineup            

                let artists = await Artist.findAll({
                    attributes: ['id', 'name'],
                    include: {
                        association: 'events',
                        attributes: [],
                        where: {
                            event_id: event.id,
                            status: 3
                        }
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
                });

                eventsAll = eventsCity.concat(otherEvents);

                return res.send(eventsAll);

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
                    include: { association: 'address' },
                    where: { user_id: user.id }
                });
                city = venueAuth.address.city;

            } else {
                producerAuth = await Producer.findOne({ where: { user_id: user.id } });
                city = producerAuth.city;
            }

            let producersAll = await Producer.findAll();

            for (let producer of producersAll) {

                let image = await ImageUser.findOne({ where: { user_id: producer.user_id } });
                let imageStatus = image ? true : false;
                producer.dataValues.image = imageStatus;

                if (producer.city === city) {
                    producersCity.push(producer);
                } else {
                    otherProducers.push(producer);
                }
            };

            producers = producersCity.concat(otherProducers);
            return res.send(producers)
        } catch (err) {
            return res.send({ error: 'Erro ao exibir feed de produtores' })
        }
    },
    async search(req, res) {
        try {
            const { name } = req.body;
            let artists = await Artist.findAll({
                attributes: ['id', 'name', 'members', 'city', 'user_id'],
                include: {
                    association: 'genres',
                    attributes: ['id', 'name']
                },
                where: {
                    name: {
                        [Op.like]: '%' + name + '%'
                    },
                    user_id: { //nao retornar usuario logado
                        [Op.ne]: req.userId,
                    }
                }
            });

            for (let artist of artists) {
                //status se existe ou não imagem
                let image = await ImageUser.findOne({ where: { user_id: artist.user_id } });
                let imageStatus = image ? true : false;
                artist.dataValues.image = imageStatus;
                artist.dataValues.type = 0;
            }

            let venues = await Venue.findAll({
                attributes: ['id', 'name', 'capacity', 'user_id'],
                include: [
                    {
                        association: 'genres',
                        attributes: ['id', 'name']
                    },
                    {
                        association: 'address',
                        attributes: ['city']
                    }
                ],
                where: {
                    name: {
                        [Op.like]: '%' + name + '%'
                    },
                    user_id: { //nao retornar usuario logado
                        [Op.ne]: req.userId,
                    }
                }
            });

            for (let venue of venues) {
                //status se existe ou não imagem
                let image = await ImageUser.findOne({ where: { user_id: venue.user_id } });
                let imageStatus = image ? true : false;
                venue.dataValues.image = imageStatus;
                venue.dataValues.type = 1;
            }

            let events = await Event.findAll({
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
                                association: 'genres',
                                attributes: ['id', 'name']
                            }
                        ]
                    },
                    {
                        association: 'organizer',
                        attributes: ['id']
                    }
                ],
                where: {
                    name: {
                        [Op.like]: '%' + name + '%'
                    }
                }
            });

            for (let event of events) { //artistas no lineup
                let artists = await Artist.findAll({
                    attributes: ['id', 'name'],
                    include: {
                        association: 'events',
                        attributes: [],
                        where: {
                            event_id: event.id,
                            status: 3
                        }
                    }
                });
                event.dataValues.lineup = artists;
                event.dataValues.type = 3;
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

            let producers = await Producer.findAll({
                where: {
                    name: {
                        [Op.like]: '%' + name + '%'
                    },
                    user_id: { //nao retornar usuario logado
                        [Op.ne]: req.userId,
                    }
                }
            });

            for (let producer of producers) {
                let image = await ImageUser.findOne({ where: { user_id: producer.user_id } });
                let imageStatus = image ? true : false;
                producer.dataValues.image = imageStatus;
                producer.dataValues.type = 2;
            };

            let result = artists.concat(venues, events, producers)
            result = shuffle(result);
            return res.send(result);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir pesquisa no feed' })
        }
    },

    async filterArtistGenre(req, res) {
        try {
            const user = await User.findByPk(req.userId);

            let resultGenre, artistAuth;
            let artists = [],
                genres = [];

            if (user.type == 0) {
                artistAuth = await Artist.findOne({
                    include: { association: 'genres' },
                    where: { user_id: user.id }
                });
                genres = artistAuth.genres;

            } else if (user.type == 1) {
                const venueAuth = await Venue.findOne({
                    include: { association: 'genres' },
                    where: { user_id: user.id }
                });
                genres = venueAuth.genres;
            }

            let artistsAll = await Artist.findAll({
                attributes: ['id', 'name', 'members', 'city', 'user_id'],
                include: {
                    association: 'genres',
                    attributes: ['id', 'name']
                }
            });

            for (let artist of artistsAll) {

                //status se existe ou não imagem
                let image = await ImageUser.findOne({ where: { user_id: artist.user_id } });
                let imageStatus = image ? true : false;
                artist.dataValues.image = imageStatus;

                artist.genres.forEach((genre) => {
                    resultGenre = inArray(genre.id, genres)
                    if (resultGenre) {
                        if (user.type === 0) { //remover artista logado da lista 
                            if (artistAuth.id !== artist.id) {
                                artists.push(artist)
                            }
                        } else {
                            artists.push(artist);
                        }
                    }

                });
            }

            artistsAll = artists;

            //remover duplicidade
            artistsAll.forEach((artist) => {
                !inArray(artist.id, artists) ? artists.push(artist) : ''
            });

            return res.send(artists);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir filtro de artistas por gêneros' })
        }
    },

    async filterArtistCity(req, res) {
        try {
            const user = await User.findByPk(req.userId);

            let city, artistAuth;
            let artists = [];

            if (user.type == 0) {
                artistAuth = await Artist.findOne({
                    where: { user_id: user.id }
                });
                city = artistAuth.city;

            } else if (user.type == 1) {
                const venueAuth = await Venue.findOne({
                    include: [
                        { association: 'address' },
                    ],
                    where: { user_id: user.id }
                });
                city = venueAuth.address.city;

            } else {
                const producerAuth = await Producer.findOne({ where: { user_id: user.id } });
                city = producerAuth.city;
            }

            let artistsAll = await Artist.findAll({
                attributes: ['id', 'name', 'members', 'city', 'user_id'],
                include: {
                    association: 'genres',
                    attributes: ['id', 'name']
                }
            });

            for (let artist of artistsAll) {
                //status se existe ou não imagem
                let image = await ImageUser.findOne({ where: { user_id: artist.user_id } });
                let imageStatus = image ? true : false;
                artist.dataValues.image = imageStatus;

                if (user.type === 0) {
                    if (artistAuth.id !== artist.id) {
                        if (artist.city === city)
                            artists.push(artist);
                    }
                } else {
                    if (artist.city === city)
                        artists.push(artist);
                }
            }

            return res.send(artists);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir filtro de artistas por cidade' })
        }
    },

    async filterVenueGenre(req, res) {
        try {
            const user = await User.findByPk(req.userId);

            let resultGenre, venueAuth;
            let venues = [],
                genres = [];

            if (user.type == 0) {
                const artistAuth = await Artist.findOne({
                    include: { association: 'genres' },
                    where: { user_id: user.id }
                });
                genres = artistAuth.genres;

            } else if (user.type == 1) {
                venueAuth = await Venue.findOne({
                    include: [
                        { association: 'genres' }
                    ],
                    where: { user_id: user.id }
                });
                genres = venueAuth.genres;
            }

            let venuesAll = await Venue.findAll({
                attributes: ['id', 'name', 'capacity', 'user_id'],
                include: [
                    {
                        association: 'genres',
                        attributes: ['id', 'name']
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

                if (venue.genres.length > 0) {
                    venue.genres.forEach((genre) => {
                        resultGenre = inArray(genre.id, genres)

                        if (user.type === 1) { //remover espaço logado da lista 
                            if (venueAuth.id !== venue.id) {
                                if (resultGenre)
                                    venues.push(venue);
                            }
                        }
                        else {
                            if (resultGenre)
                                venues.push(venue);
                        }
                    });
                }
            }

            venuesAll = venues;
            //remover duplicidade
            venuesAll.forEach((venue) => {
                !inArray(venue.id, venues) ? venues.push(venue) : ''
            });

            return res.send(venues);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir filtro de espaço por gêneros' })
        }

    },

    async filterVenueCity(req, res) {
        try {
            const user = await User.findByPk(req.userId);

            let city, venueAuth;
            let venues = [];

            if (user.type === 0) {
                const artistAuth = await Artist.findOne({
                    where: { user_id: user.id }
                });
                city = artistAuth.city;

            } else if (user.type == 1) {
                venueAuth = await Venue.findOne({
                    include: [
                        { association: 'address' },
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
                        attributes: ['id', 'name']
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

                if (user.type === 1) {
                    if (venueAuth.id !== venue.id) {
                        if (venue.address.city === city) {//para nao entrar no array caso espaço esteja logado
                            venues.push(venue);
                        }
                    }
                } else {
                    if (venue.address.city === city)
                        venues.push(venue);
                }
            }

            return res.send(venues);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir filtro de espaço por cidade' })
        }
    },

    async filterEventGenre(req, res) {
        try {
            const user = await User.findByPk(req.userId);

            let resultGenre, artistAuth;
            let events = [],
                genres = [];
            let venueAuth = {
                id: ''
            }

            if (user.type == 0) {
                artistAuth = await Artist.findOne({
                    include: { association: 'genres' },
                    where: { user_id: user.id }
                });
                genres = artistAuth.genres;

            } else if (user.type == 1) {
                venueAuth = await Venue.findOne({
                    include: [
                        { association: 'genres' }
                    ],
                    where: { user_id: user.id }
                });
                genres = venueAuth.genres;

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
                                association: 'genres',
                                attributes: ['id', 'name']
                            }
                        ]
                    },
                    {
                        association: 'organizer',
                        attributes: ['id']
                    }
                ],
                where: {
                    organizer_id: {
                        [Op.ne]: user.id
                    },
                    status: {
                        [Op.ne]: 0
                    },
                    venue_id: {
                        [Op.ne]: venueAuth.id
                    }

                }
            });

            //remover eventos com artista logado que estejam vinculados ao evento
            if (user.type === 0) {
                for (let event of eventsAll) { //artistas no lineup        
                    let artistEvents = await ArtistEvent.findAll({
                        where: {
                            artist_id: artistAuth.id,
                            event_id: event.id
                        }
                    });

                    if (artistEvents.length == 0) {
                        events.push(event);
                    }
                }
                eventsAll = events;
                events = [];
            }

            for (let event of eventsAll) { //artistas no lineup
                let artists = await Artist.findAll({
                    attributes: ['id', 'name'],
                    include: {
                        association: 'events',
                        attributes: [],
                        where: {
                            event_id: event.id,
                            status: 3
                        }
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

            eventsAll.forEach((event) => {
                event.venue.genres.forEach((genre) => {
                    resultGenre = inArray(genre.id, genres)
                    if (resultGenre)
                        events.push(event);
                });
            });

            eventsAll = events;
            events = [];

            //remover duplicidade
            eventsAll.forEach((event) => {
                !inArray(event.id, events) ? events.push(event) : ''
            });

            return res.send(events);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir filtro de evento por gêneros' })
        }
    },

    async filterEventCity(req, res) {
        try {
            const user = await User.findByPk(req.userId);

            let city, artistAuth;
            let events = [],
                genres = [];
            let venueAuth = {
                id: ''
            }

            if (user.type == 0) {
                artistAuth = await Artist.findOne({
                    where: { user_id: user.id }
                });
                city = artistAuth.city;

            } else if (user.type == 1) {
                venueAuth = await Venue.findOne({
                    include: [
                        { association: 'address' },
                    ],
                    where: { user_id: user.id }
                });
                city = venueAuth.address.city;

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
                                association: 'genres',
                                attributes: ['id', 'name']
                            }
                        ]
                    },
                    {
                        association: 'organizer',
                        attributes: ['id']
                    }
                ],
                where: {
                    organizer_id: {
                        [Op.ne]: user.id
                    },
                    status: {
                        [Op.ne]: 0
                    },
                    venue_id: {
                        [Op.ne]: venueAuth.id
                    }

                }
            });

            //remover eventos com artista logado que estejam vinculados ao evento
            if (user.type === 0) {
                for (let event of eventsAll) { //artistas no lineup        
                    let artistEvents = await ArtistEvent.findAll({
                        where: {
                            artist_id: artistAuth.id,
                            event_id: event.id
                        }
                    });

                    if (artistEvents.length == 0) {
                        events.push(event);
                    }
                }
                eventsAll = events;
                events = [];
            }

            for (let event of eventsAll) { //artistas no lineup
                let artists = await Artist.findAll({
                    attributes: ['id', 'name'],
                    include: {
                        association: 'events',
                        attributes: [],
                        where: {
                            event_id: event.id,
                            status: 3
                        }
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
            events = [];
            
            //separar por cidade
            eventsAll.forEach((event) => {
                if (event.venue.address.city === city) {
                    !inArray(event.id, events) ? events.push(event) : ''
                }
            });

            return res.send(events);
        } catch (err) {
            return res.send({ error: 'Erro ao exibir filtro de evento por cidade' })
        }
    },

    async filterProducerCity(req, res) {
        try {
            const user = await User.findByPk(req.userId);

            let producerAuth, city;
            let producers = [];

            if (user.type == 0) {
                let artistAuth = await Artist.findOne({
                    where: { user_id: user.id }
                });
                city = artistAuth.city;

            } else if (user.type == 1) {
                let venueAuth = await Venue.findOne({
                    include: { association: 'address' },
                    where: { user_id: user.id }
                });
                city = venueAuth.address.city;

            } else {
                producerAuth = await Producer.findOne({ where: { user_id: user.id } });
                city = producerAuth.city;
            }

            let producersAll = await Producer.findAll();

            for (let producer of producersAll) {

                let image = await ImageUser.findOne({ where: { user_id: producer.user_id } });
                let imageStatus = image ? true : false;
                producer.dataValues.image = imageStatus;

                if (user.type === 2) {
                    if (producerAuth.id !== producer.id) {
                        if (producer.city === city)
                            producers.push(producer);
                    }
                } else {
                    if (producer.city === city)
                        producers.push(producer);
                }
            };
            return res.send(producers)
        } catch (err) {
            return res.send({ error: 'Erro ao exibir filtro de produtor por cidade' })
        }
    },

    async filterEquipments(req, res) {
        try {
            const user = await User.findByPk(req.userId);
            let venuesCompatible = [];
            let checkCompatibility = true;
            if (user.type === 0) {
                const artist = await Artist.findOne({
                    where: { user_id: user.id }
                });

                const artistEquipments = await ArtistEquipment.findAll({
                    where: { artist_id: artist.id }
                });

                const venues = await Venue.findAll({
                    attributes: ['id', 'name', 'capacity', 'user_id'],
                    include: [
                        {
                            association: 'genres',
                            attributes: ['id', 'name']
                        },
                        {
                            association: 'address',
                            attributes: ['city']
                        },
                        {
                            association: 'equipments',
                            include: { association: 'equipments' }
                        }
                    ]
                });

                venues.forEach((venue) => {
                    checkCompatibility = true;
                    artistEquipments.forEach((artistEquipment) => {
                        //se nao espaço não tiver equipamento que artista tem
                        result = venue.equipments.find(equipments => equipments.equipment_id !== artistEquipment.equipment_id);
                        if (result === undefined) {
                            checkCompatibility = false;
                        }
                    });
                    if (checkCompatibility) {
                        venuesCompatible.push(venue);
                    }
                });
            }

            return res.send(venuesCompatible);

        } catch (err) {
            return res.send({ error: 'Erro ao exibir filtro por equipamentos' })
        }
    }

};
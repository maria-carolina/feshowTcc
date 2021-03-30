const ArtistEvent = require('../models/ArtistEvent');
const Artist = require('../models/Artist');
const Event = require('../models/Event');
const Address = require('../models/Address');
const GenreVenue = require('../models/GenreVenue');
const User = require('../models/User');
const EventImage = require('../models/EventImage');
const Notification = require('../models/Notification');

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

            //verificar se artista já está neste evento
            const artistEvent = await ArtistEvent.findAll({
                where: {
                    event_id: eventId,
                    artist_id: artistId
                }
            })

            if (artistEvent.length > 0) {
                return res.send({ error: 'Artista já está no evento' });
            }

            //verificar se não há artista encaixado no mesmo horário 
            const verifyLineup = await ArtistEvent.findAll({
                where: {
                    event_id: eventId,
                    start_time: { [Op.eq]: time }
                }
            });

            if (verifyLineup.length > 0) {
                return res.send({ error: 'Há um artista encaixado neste horário' });
            }

            /*verificar se artista já não ta tocando nesse mesmo horário,
             mas em outro evento*/

            const verifyArtist = await ArtistEvent.findAll({
                where: {
                    artist_id: artistId,
                    date
                }
            });

            if (verifyArtist.length > 0) {
                return res.send({ error: 'Este artista está em outro evento nesta data' });
            }

            const artist = await Artist.findOne({
                where: { id: artistId }
            });

            await Notification.create({
                user_id: artist.user_id,
                message: `Você foi convidado para participar do ${event.name}`,
                status: 1
            });

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
                attributes: ['id', 'name', 'city', 'user_id'],
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
            
            const user = await User.findByPk(req.userId);
           
            artistsAll.forEach((artist) => {
                //pegar os que nao estão no evento e não pegar artista logado 
                result = verifyArtist(artist.id, invitations)
                if (!result && user.id != artist.user_id) {
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
                attributes: ['id', 'name', 'city'],
                include: {
                    association: 'genres'
                },
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
                    city: artist.city,
                    genres: artist.genres,
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

            const event = await Event.findByPk(eventId);

            const artist = await Artist.findOne({
                where: { id: artistId }
            }); 1

            if ((user.type == 0 && artistEvent.status == 1) && req.userId != event.organizer_id) {

                //artista recusa convite
                await Notification.create({
                    user_id: event.organizer_id,
                    message: `${artist.name} recusou convite para o ${event.name}`,
                    status: 0
                });

            } else if ((user.type == 0 && artistEvent.status == 2) && req.userId != event.organizer_id) {
                //artista cancelou solicitação
                await Notification.create({
                    user_id: event.organizer_id,
                    message: `${artist.name} desfez convite para o ${event.name}`,
                    status: 0
                });
            } else if ((user.type == 0 && artistEvent.status == 3) && req.userId != event.organizer_id) {

                //artista saiu do evento 
                if (event.status == 0) { //verificar se ta fechado
                    return res.send({ error: 'Evento está fechado' })
                }

                await Notification.create({
                    user_id: event.organizer_id,
                    message: `${artist.name} saiu do line-up do ${event.name}`,
                    status: 2,
                    auxiliary_id: event.id,
                });


            } else if ((user.type == 1 || req.userId == event.organizer_id) && artistEvent.status == 1) {
                //organizador desfaz convite
                await Notification.create({
                    user_id: artist.user_id,
                    message: `Seu convite para participar do ${event.name} foi desfeito`,
                    status: 0
                });
            } else if ((user.type == 1 || req.userId == event.organizer_id) && artistEvent.status == 2) {

                //organizador recusa solicitação
                await Notification.create({
                    user_id: artist.user_id,
                    message: `Sua solicitação para o ${event.name} não foi aceita`,
                    status: 0
                });

            } else if ((user.type == 1 || req.userId == event.organizer_id) && artistEvent.status == 3) {
                //remover artista
                if (event.status == 0) {//verificar se ta fechado
                    return res.send({ error: 'Evento está fechado' })
                }

                await Notification.create({
                    user_id: artist.user_id,
                    message: `Você foi removido do line-up do ${event.name}`,
                    status: 0
                });
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

            const artistEvent = await ArtistEvent.findOne({
                where: [
                    { artist_id: artistId },
                    { event_id: eventId }
                ]
            });

            if (!artistEvent)
                return res.send({ error: 'Relação não encontrada' });

            const artist = await Artist.findOne({
                where: { id: artistId }
            });

            const event = await Event.findByPk(eventId);

            if (artistEvent.status == 1) {
                //artista aceitou solicitação
                await Notification.create({
                    user_id: event.organizer_id,
                    message: `Agora ${artist.name} está no line-up do ${event.name}`,
                    auxiliary_id: event.id,
                    status: 2
                });

            } else if (artistEvent.status == 2) {

                //organizador aceitou solicitação
                await Notification.create({
                    user_id: artist.user_id,
                    message: `Agora você está no line-up do ${event.name}`,
                    auxiliary_id: event.id,
                    status: 2
                });

            }

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

    async sendSolicitation(req, res) {
        try {

            const { eventId, date, time } = req.body;

            const artist = await Artist.findOne({
                where: { user_id: req.userId }
            });

            //verificar artista no evento
            const artistEvents = await ArtistEvent.findAll({
                where: {
                    event_id: eventId,
                    artist_id: artist.id
                }
            })

            if (artistEvents.length > 0) {
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
                artist_id: artist.id,
                date,
                start_time: time,
                status: 2
            });

            const event = await Event.findByPk(eventId);

            await Notification.create({
                user_id: event.organizer_id,
                message: `${artist.name} solicitou particitar do ${event.name}`,
                status: 1
            });

            return res.status(200).send('ok');


        } catch (err) {
           return res.send({ error: 'Erro ao solicitar participação em evento' })
        }
    }
    
};
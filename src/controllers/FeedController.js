const Artist = require('../models/Artist');
const Producer = require('../models/Producer');
const Venue = require('../models/Venue');
const User = require('../models/User');

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
            attributes: ['id', 'name', 'city'],
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
    }
};
const User = require ('../models/User');
const Artist = require('../models/Artist');
const Producer = require ('../models/Producer');
const Venue = require ('../models/Venue');

module.exports = {
    async store(req, res) {
        const { 
            username, email, password, type,
            profile:{name, cache, city, members},
            genre
        } = req.body;

        const user = await User.create({
            username, email, password, type
        });


        if(type == 0){ 
            const artist = await Artist.create({
                name, cache, city, members, user_id: user.id
            });

            artist.setGenres(genre);
        } 
        
        else if(type == 1){ 
            const venue = await Venue.create({
                name, cache, city, members, user_id: user.id
            });

            venue.setGenres(genre);
        } else {

        }
        
        console.log(genre);
        return res.json({hello: user})
    }
};
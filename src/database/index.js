const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const connection = new Sequelize(dbConfig);

//models
const Address = require('../models/Address');
const Artist = require('../models/Artist');
const ArtistEquipment = require('../models/ArtistEquipment');
const ArtistEvent = require('../models/ArtistEvent');
const ArtistInstrument = require('../models/ArtistInstrument');
const Chat = require('../models/Chat');
const Equipment = require('../models/Equipment');
const EquipmentVenue = require('../models/EquipmentVenue');
const Event = require('../models/Event');
const Genre = require('../models/Genre');
const GenreVenue = require('../models/GenreVenue');
const Instrument = require('../models/Instrument');
const Notice = require('../models/Notice');
const Notification = require('../models/Notification');
const Post = require('../models/Post');
const Producer = require('../models/Producer');
const Rider = require('../models/Rider');
const Solicitation = require('../models/Solicitation');
const User = require('../models/User');
const Venue = require('../models/Venue');

//passando conexão
Address.init(connection);
Artist.init(connection);
ArtistEquipment.init(connection);
ArtistEvent.init(connection);
ArtistInstrument.init(connection);
Chat.init(connection);
Equipment.init(connection);
EquipmentVenue.init(connection);
Event.init(connection);
Genre.init(connection);
GenreVenue.init(connection);
Instrument.init(connection);
Notice.init(connection);
Notification.init(connection);
Post.init(connection);
Producer.init(connection);
Rider.init(connection);
Solicitation.init(connection);
User.init(connection);
Venue.init(connection);


//passando models para as associações
Address.associate(connection.models);
Artist.associate(connection.models);
ArtistEquipment.associate(connection.models);
ArtistEvent.associate(connection.models);
ArtistInstrument.associate(connection.models);
Chat.associate(connection.models);
Equipment.associate(connection.models);
EquipmentVenue.associate(connection.models);
Event.associate(connection.models);
Genre.associate(connection.models);
GenreVenue.associate(connection.models);
Instrument.associate(connection.models);
Notice.associate(connection.models);
Notification.associate(connection.models);
Post.associate(connection.models);
Producer.associate(connection.models);
Rider.associate(connection.models);
Solicitation.associate(connection.models);
User.associate(connection.models);
Venue.associate(connection.models);


module.exports = connection;

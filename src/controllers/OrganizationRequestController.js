const Solicitation = require('../models/Solicitation');
const Event = require('../models/Event');

module.exports = {

    async sendOrganizationRequest(req, res) {
        try {
            let { venue_id, name, start_date, start_time, end_time, note } = req.body;

            if (note === undefined) {
                note = null;
            }

            const verifyEvent = await Event.findAll({
                where: {
                    start_date,
                    venue_id
                }
            });

            if (verifyEvent.length > 0) {
                return res.send({ error: 'Há um evento acontecendo nesta mesma data' });
            }

            await Solicitation.create({
                venue_id,
                user_id: req.userId,
                name,
                start_date,
                start_time,
                end_time,
                note
            });

            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao enviar solicitação de evento' })
        }


    }

};
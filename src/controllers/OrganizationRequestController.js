const Solicitation = require('../models/Solicitation');

module.exports = {

    async sendOrganizationRequest(req, res) {
        try {
            let { venue_id, name, start_date, start_time, end_time, note } = req.body;

            if (note === undefined) {
                note = null;
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
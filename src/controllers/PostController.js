const User = require('../models/User');
const Post = require('../models/Post');

module.exports = {

    async store(req, res) {
        try {
            const { post, eventId } = req.body;

            await Post.create({
                event_id: eventId,
                user_id: req.userId,
                post
            });
            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao inserir postagem' });
        }
    },

    async update(req, res) {
        try {
            const { post, postId } = req.body;

            await Post.update({
                post
            }, {
                where: { id: postId }
            });

            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao alterar postagem' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;

            await Post.destroy({
                where: { id }
            });

            return res.status(200).send('ok');

        } catch (err) {
            return res.send({ error: 'Erro ao deletar postagem' });
        }
    }

};
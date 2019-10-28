const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
    async index(req, res){
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        const users = await Dev.find({
            $and: [
                {_id: { $ne: user } }, //ne = not equal
                {_id: { $nin: [loggedDev.likes] } }, //nin = not in
                {_id: { $nin: [loggedDev.dislikes] } },
            ]
        })

        return res.json(users);
    },

    async store(req, res){
        const { username } = req.body;

        const userExits = await Dev.findOne({ user: username});

        if (userExits) { 
            return res.json(userExits); 
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { name, bio, avatar_url: avatar } = response.data;
        try {
            const dev = await Dev.create({ name, user: username, bio, avatar });
            return res.json(dev);
        } catch (error) {
            console.log(error);
            const dev = { valor: "Nao deu" };
            return res.json(dev);
        };  
    }
}
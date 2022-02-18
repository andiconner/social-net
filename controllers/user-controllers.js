const { User } = require('../models');

const userController = {
    //get all users
    getAllUser(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v' //exlude the property I don't want to show u
            })
            .populate({//left join in sql
                path: 'friends',//referring to the array
                select: '-__v'
            })
            .select('-__v')//refer here again because it is refering to 2 
            .sort({ _id: -1 })
            .then(dbUser => res.json(dbUser))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    // get one user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUser => res.json(dbUser))
            .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    //create an user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUser => res.json(dbUser))
            .catch(err => res.json(err));
    },
    // update user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbUser => {
                if (!dbUser) {
                    res.status(404).json({ message: 'No user found with this id!'});
                    return;
                    }
                    res.json(dbUser);
                    })
                    .catch(err => res.json(err));               
    },

    //delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUser => res.json(dbUser))
            .catch(err => res.json(err));
    },
    //add a new friend to a user's list
    addFriend({ params, body }, res) {
        User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { friends: body } },
                { new: true }
            )  
            .then(dbUser => {
                if (!dbUser) {
                    res.status(404).json({ message: 'No user found with this id!'});
                    return;
                }
                res.json(dbUser);
            })
            .catch(err => res.json(err));
    },
    //delete a friend from a user's friend list
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.friendId },
            { $pull: { friends: { friendId: params.friendId } } },
            { new: true }  
        )
            .then(dbUser => res.json(dbUser))
            .catch(err => res.json(err));
    }
};

module.exports = userController;
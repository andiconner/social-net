const { Thought, User } = require('../models');

const thoughtController = {
        //get all thoughts
        getAllThoughts(req, res) {
            Thought.find({})
                .populate({
                    path: 'username',
                    select: '-__v' //exlude the property I don't want to show u
                })
            
                .select('-__v')//refer here again because it is refering to 2 
                .sort({ _id: -1 })
                .then(dbThought => res.json(dbThought))
                .catch(err => {
                    console.log(err);
                    res.sendStatus(400);
                });
        },
        // get one thought by id
        getThoughtById({ params }, res) {
            Thought.findOne({ _id: params.id })
                .populate({
                    path: 'username',
                    select: '-__v'
                })
                .select('-__v')
                .then(dbThought => res.json(dbThought))
                .catch(err => {
                console.log(err);
                res.sendStatus(400);
          });
        },
    
        //create a thought 
        //to create a new thought (don't forget to push the created thought's _id 
        //to the associated user's thoughts array field)
        createThought({ params, body }, res) {
            Thought.create(body)
                .then(({ _id }) => {
                    return User.findOneAndUpdate(
                        { _id: body.userId },
                        { $push: { thoughts:_id } },
                        { new: true }
                    );
                })
                .then(dbUser => {
                    if (!dbUser) {
                        res.status(400).json({ message: 'No user found with this id!'});
                        return;
                    }
                    res.json(dbUser);
                })
                .catch(err => res.json(err));
        },
        // update thought
        updateThought({ params, body }, res) {
            Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
                .then(dbThought => {
                    if (!dbThought) {
                        res.status(404).json({ message: 'No thought found with this id!'});
                        return;
                        }
                        res.json(dbThought);
                        })
                        .catch(err => res.json(err));               
        },
    
        //delete user
        deleteThought({ params }, res) {
            Thought.findOneAndDelete({ _id: params.id })
                .then(dbThought => res.json(dbThought))
                .catch(err => res.json(err));
        },
        //add a new reaction stored in a single thought's reactions array field
        addReaction({ params, body }, res) {
            Thought.findOneAndUpdate({ _id: params.thoughtId }, { $push: { reactions: body} }, { new: true })
                .then(dbUser => {
                    if (!dbUser) {
                        res.status(404).json({ message: 'No user found with this id!'});
                        return;
                    }
                    res.json(dbUser);
                })
                .catch(err => res.json(err));
        },
        //delete to pull and remove a reaction by the reactions's reactionId
        removeReaction({ params }, res) {
            Thought.findOneAndUpdate(
              { _id: params.thoughtId },
              { $pull: { reactions: { reactionId: params.reactionId } } },
              { new: true }
            )
              .then(dbUser => res.json(dbUser))
              .catch(err => res.json(err));
          }
    };
   
    module.exports = thoughtController; 

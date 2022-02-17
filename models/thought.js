const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat')

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required:'Reaction Body is required!',
            maxlength: 280
        },
        username: {
            type: String,
            required: 'Username is required'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required:'Thought text is required',
            minlength: 1,
            maxlength: 280
            //Must be between 1 and 280 characters
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }, 
        username: [//(The user that created this thought)
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        //reactions (These are like replies)
        reactions: [ReactionSchema]//Array of nested documents created with the reactionSchema
    },
        {
            toJSON: {
                virtuals: true,
                getters: true
            }
        }
);

ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

// create the thought model using the ThoughtSchema
const Thought = model('Thought', ThoughtSchema);

//export the Thought model
module.exports = Thought;
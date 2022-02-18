const {Schema, model, Types} = require('mongoose');

const UserSchema = new Schema ({
    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        trim: true //to trim the white space
    },
    email: {
        type: String,
        required: 'Email is Required',
        unique: true,
        match: [/.+@.+\..+/]
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
            ref: 'User'
        }
    ]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

UserSchema.virtual('friendCount').get(function(){
    return this.friends.length;
});

// create the user model using the UserSchema
const User = model('User', UserSchema);

//export the User model
module.exports = User;
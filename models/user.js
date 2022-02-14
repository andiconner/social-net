const {Schema, model} = require('mongoose');

const UserSchema = new Schema ({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }
});

// create the user model using the UserSchema
const User = model('User', UserSchema);

//export the User model
module.exports = User;
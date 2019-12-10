import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = mongoose.Schema({
    emailID: {
        type: String, required: true, unique: true, trim: true
    },
    password: {
        type: String, required: true, trim: true
    },
    notes: [
        {
            title: { type: String, required: true, trim: true },
            description: { type: String, required: true, trim: true },
            created: { type: Date, default: Date.now },
            updated: { type: Date }
        }
    ]
});
UserSchema.plugin(uniqueValidator);
let Users = mongoose.model('Users', UserSchema);
export default Users;
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
            _id: { type: mongoose.Schema.Types.ObjectId, required: true, trim: true },
            title: { type: String, required: true, trim: true },
            description: { type: String, required: true, trim: true },
            lastEdited: { type: Date }
        }
    ]
});
UserSchema.plugin(uniqueValidator);
let Users = mongoose.model('Users', UserSchema);
export default Users;
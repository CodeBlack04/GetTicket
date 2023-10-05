import mongoose from "mongoose";
import { PasswordManager } from '../services/password-hashing';

// An interface that describe the properties
// that are required to create a new user
interface UserAttrs {
    email: string;
    password: string
}

// An interface that describe the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describe the properties
// that a User Doc has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required : [true, 'Please add a valid email.']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Please add a password between 4 to 20 characters.']
    }
},
{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

UserSchema.pre('save', async function(done) { //mongoose is not good at async function. So, we are responsible for
    if (this.isModified('password')) {         //calling done after doing all the processings. 
        const hashed = await PasswordManager.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
})

UserSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

export { User };
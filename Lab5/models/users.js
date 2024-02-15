const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    dob: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password; // Remove password field from JSON
        return ret;
      },
    },
  },
);
usersSchema.pre('findOneAndUpdate', async function foau(next) {
  this.options.runValidators = true;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
usersSchema.pre('save', async function preSave() {
  this.password = await bcrypt.hash(this.password, 10);
});
usersSchema.methods.verifyPassword = async function verifyPassword(password) {
  const valid = await bcrypt.compare(password, this.password);
  return valid;
};
const Users = mongoose.model('Users', usersSchema);

module.exports = Users;

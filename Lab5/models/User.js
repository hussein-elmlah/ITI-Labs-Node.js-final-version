const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const CustomError = require("../lib/customError");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    dob: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true, runValidators: true }
);

// Define a toJSON method to control the JSON output when converting Mongoose documents to JSON
userSchema.set("toJSON", {
  // The transform function allows you to modify the JSON representation of the document
  transform: function (doc, ret) {
    // Rename the '_id' field to 'id' for better readability
    ret.id = ret._id;
    // Remove the '_id' and '__v' fields from the JSON output
    delete ret._id;
    delete ret.__v;
    // Remove the 'password' field from the JSON output for security reasons
    delete ret.password;
  },
});

// Hook to trim all input strings before validating
userSchema.pre("validate", function (next) {
  for (const key in this._doc) {
    if (this._doc.hasOwnProperty(key) && typeof this._doc[key] === "string") {
      this._doc[key] = this._doc[key].trim();
    }
  }
  next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Validate in update
userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    // Trim string fields in the update object
    for (const key in this._update) {
      if (
        this._update.hasOwnProperty(key) &&
        typeof this._update[key] === "string"
      ) {
        this._update[key] = this._update[key].trim();
      }
    }
    // Enable validation for the update operation
    this.options.runValidators = true;

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    // Check if doc exists
    if (!doc) {
      // Handle the case where no user is found
      throw new CustomError("user not found", 404);
    }
    // Save the document to persist the changes
    if (this._update.$set.password && typeof this._update.$set.password === "string") {
      // Access the document being updated and mark 'password' field as modified
      doc.markModified("password");
    }
    await doc.save();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = function verifyPassword (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);

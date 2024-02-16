const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 20,
    },
    status: {
      type: String,
      enum: ["to-do", "in progress", "done"],
      default: "to-do",
    },
    tags: {
      type: [String],
      maxlength: 10,
    },
  },
  { timestamps: true, runValidators: true }
);

// Hook to trim all input strings before validating
todoSchema.pre("validate", function (next) {
  for (const key in this._doc) {
    if (this._doc.hasOwnProperty(key) && typeof this._doc[key] === "string") {
      this._doc[key] = this._doc[key].trim();
    }
  }
  next();
});

// Validate in update
todoSchema.pre("findOneAndUpdate", async function (next) {
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
    for ( let tag = 0 ; tag < this._update.tags.length ; ++tag ) {
      this._update.tags[tag] = this._update.tags[tag].trim();
      if ( this._update.tags[tag] === "" ) {
        this._update.tags.splice( tag, 1 );
        tag--;
      }
    }
    // Enable validation for the update operation
    this.options.runValidators = true;

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Todo", todoSchema);

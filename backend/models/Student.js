const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  home: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }
  },
  destination: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }
  }
});

StudentSchema.index({ home: "2dsphere" });
StudentSchema.index({ destination: "2dsphere" });

module.exports = mongoose.model("Student", StudentSchema);

// models/ProfessionalResponse.js
const ProfessionalResponseSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  response: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "ProfessionalResponse",
  ProfessionalResponseSchema
);

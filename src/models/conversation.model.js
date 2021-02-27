const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new mongoose.Schema({
  members: [
    { type: Schema.Types.ObjectId, ref: 'user' }
  ],
  messages: [{
    kind: String,
    content: String,
    status: String,
    created: Date,
    sender: { type: Schema.Types.ObjectId, ref: 'user' },
  }],
  is_blocked: {
    type: String,
    default: "false"
  },
},{
  timestamps:{}
});

const conversation = mongoose.model("conversation", conversationSchema);

module.exports = conversation;
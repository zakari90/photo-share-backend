import { model, Schema } from "mongoose";

const likeSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

export default model("Like", likeSchema);

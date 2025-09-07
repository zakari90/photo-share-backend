import { model, Schema } from "mongoose";

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default model("Post", postSchema);

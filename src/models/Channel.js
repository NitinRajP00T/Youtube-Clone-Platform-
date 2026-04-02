const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: [true, "A channel must have a name"],
      unique: true,
      trim: true,
      maxlength: 50,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A channel must belong to a user"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    banner: {
      type: String,
      default: "",
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    uploadedVideos: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },

    // videos: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   ref: "Video",
    // },
  },
  { timestamps: true },
);
//the better approach for getting all associated videos by the channel is to use the video model and query for the channel id
//  channelSchema.virtual('videos', {
//     ref: 'Video',
//     foreignField: 'channel',

//     localField: '_id'
// });
// This virtual does the same thing as:
// Video.find({ channel: channel._id })
const Channel = mongoose.model("Channel", channelSchema);
module.exports = Channel;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    is_friend: Boolean,
    same_friends: Number,
    phonenumber: String,
    email: String,
    username: String,
    password: String,
    avatar: String,
    token: String,
    birthday: String,
    is_blocked: String,
    cover_image: String,
    blocks: [
        {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    savedSearch: [
        {
            keyword: String,
            created: Date,
        },
    ],
    sentRequestFriends: [
        {
            created: Date,
            user: {
                type: Schema.Types.ObjectId,
                ref: "user",
            }
        }
    ]
    ,
    receivedRequestFriends: [
        {
            created: Date,
            user: {
                type: Schema.Types.ObjectId,
                ref: "user",
            }
        }
    ]
    ,
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    settings: {
        sound: String,
        // 0-only my 1-friend 2-friend of friend 3-anyone
        publicInfo: {
            birthday: {
                type: Number,
                default: 3
            },
            friends: {
                type: Number,
                default: 3
            },
            photos: {
                type: Number,
                default: 3
            },
            about: {
                type: Number,
                default: 3
            },
            posts: {
                type: Number,
                default: 3
            },
        }
    },
    conversations: [
        {
            type: Schema.Types.ObjectId,
            ref: "conversation",
        },
    ],
    myConversation: {
        type: Schema.Types.ObjectId,
        ref: "conversation",
    },
    notifications: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: "notification",
        },
        read: String
    },],
},{
    timestamps:{}
});

const User = mongoose.model("user", userSchema);

module.exports = User
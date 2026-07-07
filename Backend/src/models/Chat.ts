import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    role: {

        type: String,

        enum: [

            "user",

            "assistant"

        ]

    },

    content: String,

    createdAt: {

        type: Date,

        default: Date.now

    }

});

const chatSchema = new mongoose.Schema({

    projectId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Project"

    },

    userId: {
    type: String,
    required: true,
},

    title: String,

    provider: String,

    agent: String,

    messages: [

        messageSchema

    ]

}, {

    timestamps: true

});

export default mongoose.model(

    "Chat",

    chatSchema

);
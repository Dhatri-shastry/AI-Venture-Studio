import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

    userId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User"

    },

    title: {

        type: String,

        required: true

    },

    description: String,

    status: {

        type: String,

        default: "Draft"

    }

}, {

    timestamps: true

});

export default mongoose.model(

    "Project",

    projectSchema

);
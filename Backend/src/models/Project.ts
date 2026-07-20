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

    },

    // Persistent, always-included project memory - idea, target users,
    // pricing, known competitors, roadmap, key decisions. Maintained by
    // updateProjectProfile.node.ts. Distinct from RAG (which retrieves
    // only what's semantically relevant to the current message) - this
    // is included in full on every request so core facts about the
    // venture are never "forgotten."
    profile: {

        type: String,

        default: ""

    }

}, {

    timestamps: true

});

export default mongoose.model(

    "Project",

    projectSchema

);

import mongoose from "mongoose";

/**
 * A record of something ingested into a project's RAG memory (pasted
 * text, an uploaded file, or a scraped URL). Chroma holds the actual
 * chunk embeddings for retrieval - this collection exists purely so the
 * Documents tab has something to list without querying Chroma directly
 * (which has no concept of "distinct sources" out of the box).
 */
const documentSchema = new mongoose.Schema({

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },

    source: {
        type: String,
        required: true,
    },

    // "manual-input" | filename | URL - whatever was passed as `source`
    // to loadTextIntoRAG. Kept as free text rather than an enum since
    // filenames/URLs don't fit a fixed set of values.
    chunksAdded: {
        type: Number,
        default: 0,
    },

}, {
    timestamps: true,
});

export default mongoose.model("Document", documentSchema);

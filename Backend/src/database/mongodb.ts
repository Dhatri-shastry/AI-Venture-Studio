import mongoose from "mongoose";

export async function connectDatabase() {

    try {

        await mongoose.connect(process.env.MONGODB_URI!);

        console.log(" MongoDB Connected");

    }

    catch (error) {

        console.error(error);

        process.exit(1);

    }

}

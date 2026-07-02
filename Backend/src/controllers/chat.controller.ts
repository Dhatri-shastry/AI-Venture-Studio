import { Request, Response } from "express";
import { ventureGraph } from "../graph/graph";

const chatService = new ChatService();

export const sendMessage = async (
    req: Request,
    res: Response
) => {

    try {

        const {

            message,

            provider

        } = req.body;

        if (!message) {

            return res.status(400).json({

                success: false,

                message: "Message is required"

            });

        }

        const response = await chatService.chat(

            message,

            provider

        );

        res.json({

            success: true,

            response

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};
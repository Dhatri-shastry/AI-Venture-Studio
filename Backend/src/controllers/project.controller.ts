import { Request, Response } from "express";
import Project from "../models/Project";

interface AuthedRequest extends Request {
    user?: { uid: string };
}

export const createProject = async (req: AuthedRequest, res: Response) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "title is required" });
        }

        const project = await Project.create({
            userId: req.user?.uid,
            title,
            description,
        });

        res.status(201).json({ success: true, project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getProjects = async (req: AuthedRequest, res: Response) => {
    try {
        const projects = await Project.find({ userId: req.user?.uid }).sort({ createdAt: -1 });
        res.json({ success: true, projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getProjectById = async (req: AuthedRequest, res: Response) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            userId: req.user?.uid,
        });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        res.json({ success: true, project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

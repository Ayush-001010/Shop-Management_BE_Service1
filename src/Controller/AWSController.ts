import { Request, Response } from "express";
import { getUploadedFileURL } from "../AWS/aws-operation";

export const getURLForUploadFileInS3 = async (req: Request, res: Response) => {
    try {
        const { contentType, key } = req.body;
        const url = await getUploadedFileURL(contentType, key);
        if (url) {
            return res.send({ success: true, data: url });
        } else {
            return res.send({ success: false });
        }
    } catch (error) {
        console.log(error);
        return res.send({ success: false });
    }
}
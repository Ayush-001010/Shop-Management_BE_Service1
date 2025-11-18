import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3ClientObj = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId:  process.env.accessKeyId || "",
        secretAccessKey: process.env.secretAccessKey || ""
    }
});

export const getUploadedFileURL = async (contentType: string, key: string) => {
    try {
        console.log(key );
        const command = new PutObjectCommand({
            Bucket: "project-shop-management",
            Key: key,
            ContentType: contentType,
        });

        const url = await getSignedUrl(s3ClientObj, command, { expiresIn: 60 });
        return url;
    } catch (error) {
        console.log("Error  ",error);
        return null;
    }
};

export const getFileURL = async (keyName: string) => {
    try {
        if(keyName === null) return "";
        const command = new GetObjectCommand({
            Bucket: "project-shop-management",
            Key: keyName
        });
        const url = await getSignedUrl(s3ClientObj, command, { expiresIn: 60 });
        return url;
    } catch (error) {
        console.log("Error Hey !! ", error);
        return "";
    }
}
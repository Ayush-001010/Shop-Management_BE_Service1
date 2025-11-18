import express, { Request, Response } from 'express';
import sequelize from '../Sequelize/dbConfig';
import MasterDetailsRoutes from './Routes/MasterDetailsRoutes';
import InventoryRoutes from './Routes/InventoryRoutes';
import AuthenticationRoutes from './Routes/AuthenticationRoutes';
import ShopInventoryRoutes from './Routes/ShopInventoryRoutes';
import ImageRoutes from './Routes/ImageRoutes';
import TeamChatRoutes from './Routes/TeamChatRoutes';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { Redis } from "ioredis";
import model from '../Sequelize/model';
import { Sequelize } from 'sequelize';
import EComRoutes from "./Routes/EComRoutes";
import AWSRoutes from './Routes/AWSRoutes';
import LayoutRoutes from './Routes/LayoutRoutes';
import cookieParser from "cookie-parser";
import * as dotenv from 'dotenv';
import storeNotificationOnRabbitMQ from './RabbitMQ/RabbitMQ';
import { getFileURL } from './AWS/aws-operation';

dotenv.config();

const redisClient = new Redis();

const app = express();
const PORT = process.env.PORT || 8000;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});


app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const imageDir = path.resolve(__dirname, './Controller/Image');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${file.originalname}-${moment().format("YYYY_MM_DD_HH_mm_ss")}}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });

io.on("connection", (socket) => {
  socket.on("register", async (emailID: string) => {
    try {
      redisClient.set(`UserEmail:${emailID}`, socket.id);
      const data = await model.ChatMessage.findAll({
        attributes: [
          "SendBy",
          [Sequelize.fn('COUNT', Sequelize.col('SendBy')), "NewMessageCount"]
        ],
        where: {
          IsMessageNotSend: true,
          RecivedBy: emailID
        },
        group: ["SendBy"]
      });
      if (data && data.length > 0) {
        socket.emit("new-message-recived", data);
      }
      return;
    } catch (error) {
      // console.log("Error  ", error);
      return;
    }
  })
  socket.on("sent-message", async (details) => {
    let { message, toEmailID, fromEmailID, RecivedByName, SendByName, ReplyChatID, FileURL } = details;
    const val = await redisClient.get(`UserEmail:${toEmailID}`);
    const response = await model.ChatMessage.create({
      Message: message,
      SendBy: fromEmailID,
      RecivedBy: toEmailID,
      SendByName: SendByName,
      RecivedByName: RecivedByName,
      IsMessageNotSend: !val ? true : false,
      ReplyChatID,
      FileURL,
      isLinkMessage: (message as string).includes("https")
    });
    await storeNotificationOnRabbitMQ({
      Message: message,
      By: fromEmailID,
      Reciver: toEmailID,
      Type: "Chat"
    });
    if (val) {
      FileURL = await getFileURL(FileURL);
      io.to(val).emit("message-recived", ({ Message: message, SendBy: fromEmailID, RecivedBy: toEmailID, createdAt: new Date(), ID: -1, RecivedByName, SendByName, ReplyChatID, FileURL }));
    };
    const obj = { Message: message, SendBy: fromEmailID, RecivedBy: toEmailID, createdAt: new Date(), RecivedByName, SendByName, ReplyChatID, FileURL, ID: response.ID };
    socket.emit("message-recived-confirm", obj);
  })
  socket.on("join-group", (rooms) => {
    rooms.forEach((room: string) => socket.join(room));
  })
  socket.on("group-message", async (details) => {
    const { message, fromEmailID, SendByName, groupID, FileURL } = details;
    const response = await model.ChatMessage.create({
      Message: message,
      SendBy: fromEmailID,
      SendByName: SendByName,
      GroupID: groupID,
      FileURL,
      isLinkMessage: (message as string).includes("https")
    });
    socket.to(groupID).emit("group-recived-messages", { Message: message, SendBy: fromEmailID, RecivedBy: "", createdAt: new Date(), ID: response.ID, RecivedByName: "", SendByName, GroupID: groupID });
  })
  socket.on("disconnect", () => {
    // console.log("Disconnect!! ");
  });
  socket.on("notification-register", async (val: Record<string, string>) => {
    const { emailID, userID } = val;
    redisClient.set(`Notification-UserEmail:${emailID}`, socket.id);
    const data = await model.Notification.findAll({
      where: {
        usermastertableID: userID
      }
    });
    if (data && data.length > 0) {
      socket.emit("new-notification-recived", data);
    }
  })
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript!');
});

app.use('/master', MasterDetailsRoutes);
app.use('/authentication', AuthenticationRoutes);
app.use('/inventory', InventoryRoutes);
app.use('/shopInventory', ShopInventoryRoutes);
app.use('/image', upload.single("image"), ImageRoutes);
app.use('/teamChat', TeamChatRoutes);
app.use("/ecom", EComRoutes);
app.use("/aws", AWSRoutes);
app.use("/layout", LayoutRoutes);

server.listen(PORT, () => {
  sequelize.sync().then(() => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
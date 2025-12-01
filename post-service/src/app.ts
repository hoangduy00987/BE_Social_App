import express from "express";
import cors from "cors";
import corsOptions from "./config/cors.config.js";
import routes from "./routes/index.js";
import errorHandler from "./shared/middlewares/error.middleware.js";
import { httpRequestLogger } from "./shared/middlewares/logger.middleware.js";
// import { clerkMiddleware } from "@clerk/express";
import notFoundHandler from "./shared/utils/404.js";
// import { producer } from "./lib/kafkaClient.js";

const app = express();

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Morgan middleware for HTTP request logging
app.use(httpRequestLogger);

// // Clerk middleware
// app.use(clerkMiddleware());

// Routes
app.use("/api", routes);

// app.post("/posts", async (req, res) => {
//   const { title, author_id } = req.body;

//   // Giả lập lưu DB
//   const post = {
//     id: Math.floor(Math.random() * 10000),
//     title,
//     author_id,
//     created_at: new Date(),
//   };

//   // Gửi event qua Kafka
//   await producer.send({
//     topic: "post_events",
//     messages: [
//       {
//         key: "post_created",
//         value: JSON.stringify({
//           event: "post_created",
//           post_id: post.id,
//           author_id: post.author_id,
//           title: post.title,
//           created_at: post.created_at,
//         }),
//       },
//     ],
//   });

//   console.log(`📤 Event "post_created" sent for post ${post.title}`);
//   res.json({ message: "Post created", post });
// });

app.get("/", (req, res) => res.send("<p>This is Post Service</p>"));

app.use(notFoundHandler);

// Global error handling middleware
app.use(errorHandler);

export default app;

import express from "express";
import morgan from "morgan";
import cors from "cors";
import communityRoutes from "@/routes/community.route.js";
import communityTypeRoutes from "@/routes/communityType.route.js";
import communityMemberRoutes from "@/routes/communityMember.route.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/community-type", communityTypeRoutes);
app.use("/api/community-member", communityMemberRoutes);
app.use("/api/community", communityRoutes);

export default app;

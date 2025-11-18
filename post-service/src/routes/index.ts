import { Router } from "express";
import postRoutes from "./post.routes.js";
import voteRoutes from "./vote.routes.js";
import commentRoutes from "./comment.routes.js";

const router = Router();

const defaultRoutes = [
  { path: "/posts", route: postRoutes },
  { path: "/votes", route: voteRoutes },
  { path: "/comments", route: commentRoutes },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;

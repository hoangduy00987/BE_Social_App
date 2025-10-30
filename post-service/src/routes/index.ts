import { Router } from "express";
import postRoutes from "./post.routes";
import voteRoutes from "./vote.routes";
import commentRoutes from "./comment.routes";

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

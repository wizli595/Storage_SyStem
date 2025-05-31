import axios from "axios";
import { router, publicProcedure } from "../trpc";

export const appRouter = router({
  example: router({
    hello: publicProcedure.query(async () => {
      return { message: "Hello, world!" };
    }),
    getItems: publicProcedure.query(async () => {
      const res = await axios.get("http://localhost:5000/items");
      return res.data;
    }),
  }),
});

export type AppRouter = typeof appRouter;

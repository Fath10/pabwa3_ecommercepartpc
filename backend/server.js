import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import cartRoutes from "./routes/carts.js";
import chatRoutes from "./routes/chat.js";
import badgeRoutes from "./routes/badge.js";
import reviewRoutes from "./routes/reviews.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

app.use(
  "/api/auth",
  authRoutes
);

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      status: "OK",
      message:
        "e-BuildPC API berjalan",
    });
  }
);

app.use(
  "/uploads",
  express.static("uploads")
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/badges",
  badgeRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/chat-ai",
  chatRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
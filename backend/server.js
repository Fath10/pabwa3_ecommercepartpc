import express from "express";
import cors from "cors";
import compression from "compression";
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

// ── CORS ──────────────────────────────────────────────
// Allow the frontend origins listed in CLIENT_URL (comma-separated).
// Requests with no Origin header (curl, server-to-server, same-origin) pass through.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json());

// Disable compression untuk SSE endpoint (chat-ai)
app.use((req, res, next) => {
  if (req.path.includes("/chat-ai")) {
    return next();
  }
  compression()(req, res, next);
});

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
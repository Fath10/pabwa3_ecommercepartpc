import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import cartRoutes from "./routes/carts.js";

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
  "/api/categories",
  categoryRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);



const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
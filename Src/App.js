import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./Routes.js";

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const normalizeOrigin = (value) => value?.trim().replace(/\/+$/, "");

const allowedOrigins = [
  process.env.CLIENT_URL_PROD,
  process.env.CLIENT_URL_LOCAL,
  "https://ecommercer-user.netlify.app",
  "https://ecommerce-user11.netlify.app",
  "https://ecommerce-codeedex.netlify.app",
  "https://ecommerce-admin-zxsf-iabg0fghz-vinzencors-projects.vercel.app",
  "http://localhost:5173",
]
  .filter(Boolean)
  .map(normalizeOrigin)
  .filter(Boolean);

const allowedOriginPatterns = [
  /^https:\/\/ecommerce-user[\w-]*\.netlify\.app$/,
  /^https:\/\/ecommercer-user[\w-]*\.netlify\.app$/,
  /^https:\/\/ecommerce-admin-[\w-]*\.vercel\.app$/,
  /^https:\/\/ecommerce-admin[\w-]*\.vercel\.app$/,
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalizedOrigin = normalizeOrigin(origin);
    if (
      allowedOrigins.includes(normalizedOrigin) ||
      allowedOriginPatterns.some((pattern) => pattern.test(normalizedOrigin))
    ) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}. Allowed: ${allowedOrigins.join(", ")}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(cookieParser());

app.use("/api", routes);

app.get("/health", (req, res) => {
  res.send("Welcome to Codeedex Ecommerce API");
});

//404 handler 
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

//Global error handler 
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

export default app;
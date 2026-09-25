import express, { type Express, type Request, type Response } from "express";
import http from "http";
import { Buffer } from "node:buffer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sendError } from "./constants/error.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.text());
app.set('trust proxy', true);


app.use((req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = (body) => {
        const size = Buffer.byteLength(JSON.stringify(body), "utf8");
        console.log(`${req.method} ${req.originalUrl} → ${(size / 1024).toFixed(2)} KB`);
        return originalJson(body);
    };

    next();
});

/////// cors  config  ///////
const allowedOrigins = [
    process.env.CLIENT_URL,  //*
    process.env.CLIENT_URL_TWO, //www.*
    process.env.SERVER_URL,
    process.env.ADMIN_URL
];

interface CorsOptions {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders: string[];
}

const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        // LOG THIS to see what the browser is actually sending
        //console.log("Request Origin:", origin);
        //console.log("Allowed Origins:", allowedOrigins);

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS Blocked for origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },

    credentials: true,
    //methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    //allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
    exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));


/**
 * ROUTES
*/
import projectRoutes from "@/routes/projects.routes.js";
import contactRoutes from "@/routes/contact.routes.js";


app.use("/api/projects", projectRoutes)
app.use("/api/contact", contactRoutes)

//////////////////// Static files ///////////////////
app.use("/uploads", express.static(path.join(__dirname, "public/uploads"), { maxAge: 365 * 24 * 60 * 60 * 1000, immutable: true }));
app.use("/api/uploads", express.static(path.join(__dirname, "public/uploads"), { maxAge: 365 * 24 * 60 * 60 * 1000, immutable: true }));
app.use("/", express.static(path.join(__dirname, "public"), { index: "index.html" }));


app.get('/api/proxy-image', async (req, res) => {

    const targetUrl = req.query.url as string;

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 8000);

    try {

        const url = new URL(targetUrl);

        // const thisServer = new URL(
        //     process.env.SERVER_URL || "https://localhost"
        // );

        // const host = url.hostname;
        // const thisServerHost = thisServer.hostname;

        let cleanOrigin = url.origin;

        // if (host === thisServerHost) {
        //     cleanOrigin = `http://127.0.0.1:4000`;
        // }

        const fixedUrl =
            `${cleanOrigin}${url.pathname}${url.search}`;

        const response = await fetch(fixedUrl, {
            signal: controller.signal,
            redirect: "follow",
            headers: {
                Host: url.hostname
            }
        });

        if (!response.ok && !fixedUrl.includes('localdev.com')) {
            throw new Error('Failed to fetch image');
        }

        res.setHeader(
            'Cache-Control',
            'public, max-age=2592000, immutable'
        );

        const contentType =
            response.headers.get('content-type');

        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        const reader = response.body?.getReader();

        if (!reader) {
            throw new Error("Failed to fetch image");
        }

        while (true) {

            const { done, value } = await reader.read();

            if (done) break;

            res.write(value);
        }

        return res.end();

    } catch (err) {

        if (res.headersSent) {
            return res.end();
        }

        if ((err as Error).name === "AbortError") {
            return res
                .status(504)
                .send("Image fetch timeout");
        }

        console.log((err as Error).message);

        return res
            .status(500)
            .send("Error fetching image");

    } finally {
        clearTimeout(timeout);
    }
});


app.use(/.*/, (req, res) => {
    let ui: boolean = Boolean(req.query.ui) ?? Boolean(req.body.ui);
    return ui ? sendError(res, "Route Not Found", 404) : res.json({ status: 404, message: "Route not found!" });
});

//Error handling
app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

process.on("uncaughtException", (err: Error): void => {
    console.error("Uncaught Exception:", err.message);
    process.exit(1);
});
process.on("unhandledRejection", (reason: unknown): void => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
});


// Server Logic
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3500;

// 20 minutes in milliseconds
const MAX_TIMEOUT = 1200000;

const server = http.createServer(app)

// --- ADDED TIMEOUT SETTINGS ---
server.timeout = MAX_TIMEOUT;
server.headersTimeout = MAX_TIMEOUT + 1000; // Must be slightly higher than timeout
server.keepAliveTimeout = MAX_TIMEOUT + 10000; // Ensure this is higher than Apache's keepalive

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Production Server running on port ${PORT}`);
});
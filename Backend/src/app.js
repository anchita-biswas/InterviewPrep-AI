const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cookieParser());

/* require all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* require all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

/*
 * Serve the built React app. The frontend and the API share one origin in
 * production, so no CORS setup is needed here.
 */
const frontendDist = path.join(__dirname, "..", "..", "Frontend", "dist");

app.use(express.static(frontendDist));

/*
 * React Router handles routing in the browser, so any request that is not an
 * API call and not a real file must fall back to index.html. Registered last
 * so it never shadows the API routes above.
 */
app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/")) {
        return next();
    }
    res.sendFile(path.join(frontendDist, "index.html"));
});

/*
 * Errors must be logged and returned as JSON, the default Express handler
 * replies with HTML that the frontend cannot parse.
 */
app.use((err, req, res, next) => {
    console.error(`${req.method} ${req.path} failed:`, err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
});

module.exports = app;

import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'
import { errorHandler } from "./middleware/error.middlewares.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

// common middleware
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static('public'))
app.use(cookieParser())

// import routes
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from './routes/user.routes.js'


// routes
app.use('/api/v1/healthcheck', healthcheckRouter)
app.use('/api/v1/users', userRouter)

// Error middlerware - Not neccessory but recommended
app.use(errorHandler)

export { app };
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'
import router from './app/routes'
const app: Application = express()
import cookieParser from 'cookie-parser'

// parser
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: ['http://localhost:5173/'] }))

// application routes
app.use('/api/v1', router)

const test = async (req: Request, res: Response) => {
    const a = 10
    res.send(a)
}

app.get('/', test)

app.use(globalErrorHandler)

// Not Found
app.use(notFound)

export default app

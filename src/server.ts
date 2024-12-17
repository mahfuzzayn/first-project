import app from './app'
import config from './app/config'
import mongoose from 'mongoose'
import { Server } from 'http'

let server: Server

async function main() {
    try {
        await mongoose.connect(config.database_url as string)
        server = app.listen(config, () => {
            console.log(`App listening on port ${config.port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

main()

process.on('unhandledRejection', (error) => {
    console.log('😡 unhandledRejection is detected, shutting down ...', error)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
})

process.on('uncaughtException', () => {
    console.log('😡 uncaughtException is detected, shutting down ...')
    process.exit(1)
})

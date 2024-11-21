import app from './app'
import config from './app/config'
import mongoose from 'mongoose'

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    app.listen(config, () => {
      console.log(`Example app listening on port ${config}`)
    })
  } catch (error) {
    console.log(error)
  }
}

main()

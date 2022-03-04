import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import ItemRouter from './resources/item/item.router'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/api/item', ItemRouter)

export const start = () => {
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server started')
    const url =
      process.env.MONGODB_URI ||
      process.env.DB_URL ||
      'mongodb://localhost:27017/tipe-devapi-testing'
    let connectUrl = url.split('<password>')
    connectUrl = connectUrl[0] + process.env.DB_PASSWORD + connectUrl[1]
    mongoose
      .connect(
        connectUrl + 'tipe-devapi-testing',
        {
          useNewUrlParser: true,
          autoIndex: true
        }
      )
      .then(() => console.log('connected to mongo'))
      .catch(err => console.log(err))
  })
}

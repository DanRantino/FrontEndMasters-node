import mongoose from 'mongoose'
import options from '../config'
import dotenv from 'dotenv'
dotenv.config()

export const connect = (url = options.dbUrl, opts = {}) => {
  return mongoose.connect(
    url,
    { ...opts, useNewUrlParser: true }
  )
}

export const disconnect = () => {
  return mongoose.disconnect()
}

export const returnUrl = () => {
  const url = process.env.MONGODB_URI || process.env.DB_URL
  // || 'mongodb://localhost:27017/tipe-devapi-testing'
  let connectUrl = url.split('<password>')
  connectUrl = connectUrl[0] + process.env.DB_PASSWORD + connectUrl[1]
  return connectUrl
}

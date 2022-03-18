import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import ItemRouter from './resources/item/item.router'
import ListRouter from './resources/list/list.router'
import UserRouter from './resources/user/user.router'
import { signup, signin, protect } from './utils/auth'
import { connect, returnUrl, disconnect } from './utils/db'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :date[iso]'
  )
)
app.use('/signup', signup)
app.use('/signin', signin)

app.use('/api', protect)

app.use('/api/user', UserRouter)
app.use('/api/item', ItemRouter)
app.use('/api/list', ListRouter)

export const start = () => {
  app.listen(process.env.PORT || 3000, () => {
    console.log('On Port 3000')
  })
  connect(returnUrl() + 'api-test')
    .then(() => console.log('connected Mongo'))
    .catch(err => console.log(err))
}

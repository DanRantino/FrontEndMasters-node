import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  const { email, password } = req.body
  if (!email) {
    return res.status(400).send({ message: 'You must enter an email address.' })
  }
  if (!password) {
    return res.status(400).send({ message: 'You must enter a password.' })
  }
  const user = await User.create({ email, password })
  const token = newToken(user)
  console.log(token, verifyToken(token))
  res.status(201).send({ token })
}

export const signin = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).send({ message: 'bad email/password' })
  const match = await user.checkPassword(password)
  if (!match) return res.status(401).send({ message: 'bad email/password' })
  const token = newToken(user)
  res.send({ token })
}

export const protect = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    res.status(401).send({ message: 'must authenticate' })
    return
  }
  try {
    const { id } = await verifyToken(token)
    const user = await User.findById(id)
    if (!user) {
      res.status(401).send({ message: 'bad token' })
      return
    }
    req.user = user
  } catch (e) {
    console.error('protected error', e)
    return
  }
  next()
}

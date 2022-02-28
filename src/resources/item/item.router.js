import { Router } from 'express'
// import { getAll, getOne, create, update, deleteOne } from './item.controllers'

const router = Router()

const controller = (req, res) => {
  res.json({ msg: 'item route' })
}

router
  .route('/')
  .get(controller)
  .post(controller)

router
  .route('/:id')
  .get(controller)
  .put(controller)
  .delete(controller)

export default router

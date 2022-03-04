import { Router } from 'express'
import controller from './item.controllers'

const router = Router()

router
  .route('/')
  .get(controller.getAll)
  .post(controller.create)

router
  .route('/:id')
  .get(controller.getOne)
  .put(controller.update)
  .delete(controller.deleteOne)

export default router

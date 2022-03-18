import { crudControllers } from '../crud'
import { List } from '../../resources/list/list.model'
import mongoose from 'mongoose'

const { getOne, getMany, createOne, updateOne, removeOne } = crudControllers(
  List
)

describe('crud controllers', () => {
  describe('getOne', async () => {
    test('finds by authenticated user and id', async () => {
      expect.assertions(2)

      const user = mongoose.Types.ObjectId()
      const list = await List.create({ name: 'list', createdBy: user })

      const req = {
        params: {
          id: list._id
        },
        user: {
          _id: user
        }
      }

      const res = {
        status(status) {
          expect(status).toBe(200)
          return this
        },
        json(result) {
          expect(result.data._id.toString()).toBe(list._id.toString())
        }
      }

      await getOne(req, res)
    })

    test('404 if no doc was found', async () => {
      expect.assertions(1)
      const user = mongoose.Types.ObjectId()

      const req = {
        params: {
          id: mongoose.Types.ObjectId()
        },
        user: {
          _id: user
        }
      }

      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        end() {
          expect(true).toBe(true)
        }
      }
      await getOne(req, res)
    })
  })

  describe('getMany', () => {
    test('finds array of docs by authenticated user', async () => {
      expect.assertions(3)

      const user = '622fecd1e8b9a739b5ff9e53'
      await List.create([
        { name: 'list', createdBy: '622fecd1e8b9a739b5ff9e53' },
        { name: 'other', createdBy: '622fecd1e8b9a739b5ff9e53' },
        { name: 'list1', createdBy: '622fecd1e8b9a739b5ff9e52' }
      ])

      const req = {
        user: {
          _id: user
        }
      }

      const res = {
        status(status) {
          expect(status).toBe(200)
          return this
        },
        json(result) {
          expect(result.data).toHaveLength(2)
          result.data.forEach(doc => expect(`${doc.createdBy}`).toBe(`${user}`))
        }
      }
      await getMany(req, res)
    })
  })

  describe('createOne', () => {
    test('creates a new doc', async () => {
      expect.assertions(1)
      const user = mongoose.Types.ObjectId()
      const body = { name: 'name' }

      const req = {
        user: { _id: user },
        body
      }

      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        json(results) {
          expect(results.data.name).toBe(body.name)
        }
      }
      const { createOne } = crudControllers(List)
      await createOne(req, res)
    })

    test('createdBy should be the authenticated user', async () => {
      expect.assertions(1)
      const user = mongoose.Types.ObjectId()
      const body = { name: 'name' }

      const req = {
        user: { _id: user },
        body
      }

      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        json(results) {
          expect(`${results.data.createdBy}`).toBe(`${user}`)
        }
      }
      await createOne(req, res)
    })
  })

  describe('updateOne', () => {
    test('finds doc by authenticated user and id to update', async () => {
      expect.assertions(3)

      const user = mongoose.Types.ObjectId()
      const list = await List.create({ name: 'name', createdBy: user })
      const update = { name: 'hello' }

      const req = {
        params: { id: list._id },
        user: { _id: user },
        body: update
      }

      const res = {
        status(status) {
          expect(status).toBe(200)
          return this
        },
        json(results) {
          expect(`${results.data._id}`).toBe(`${list._id}`)
          expect(results.data.name).toBe(update.name)
        }
      }

      await updateOne(req, res)
    })

    test('400 if no doc', async () => {
      expect.assertions(2)

      const user = mongoose.Types.ObjectId()
      const update = { name: 'hello' }

      const req = {
        params: { id: mongoose.Types.ObjectId() },
        user: { _id: user },
        body: update
      }

      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        end() {
          expect(true).toBe(true)
        }
      }

      await updateOne(req, res)
    })
  })

  describe('removeOne', () => {
    test('first doc by authenticated user and id to remove', async () => {
      expect.assertions(1)

      const user = mongoose.Types.ObjectId()
      const list = await List.create({ name: 'name', createdBy: user })

      const req = {
        params: { id: list._id },
        user: { _id: user }
      }

      const res = {
        status(status) {
          expect(status).toBe(200)
          return this
        },
        json(results) {
          expect(`${results.data._id}`).toBe(`${list._id}`)
        }
      }

      await removeOne(req, res)
    })

    test('400 if no doc', async () => {
      expect.assertions(2)
      const user = mongoose.Types.ObjectId()

      const req = {
        params: { id: mongoose.Types.ObjectId() },
        user: { _id: user }
      }

      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        end() {
          expect(true).toBe(true)
        }
      }

      await removeOne(req, res)
    })
  })
})

import mongoose from 'mongoose'

export const getOne = model => async (req, res) => {
  const { id } = req.params
  const doc = await model.findOne({ _id: id }).exec()
  if (!doc) {
    res.status(404)
    return
  }
  res.status(200).json({ data: doc })
}

export const getMany = model => async (req, res) => {
  const id = req.user._id

  const itens = await model.find({ createdBy: id })
  res.json({ data: itens })
}

export const createOne = model => async (req, res) => {
  let createdBy = req.user._id
  if (!createdBy) {
    createdBy = mongoose.Types.ObjectId()
  }
  const doc = await model.create({
    ...req.body,
    createdBy
  })
  res.json({ data: doc })
}

export const updateOne = model => async (req, res) => {
  const { id } = req.params
  const doc = await model.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    req.body,
    {
      new: true
    }
  )
  if (!doc) {
    res.status(400).end()
    return
  }
  res.status(200).json({ data: doc })
}

export const removeOne = model => async (req, res) => {
  const { id } = req.params
  const doc = await model.findOneAndDelete({ _id: id })
  if (!doc) {
    res.status(400).end()
    return
  }
  res.json({ data: doc })
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})

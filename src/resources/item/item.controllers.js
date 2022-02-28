const getAll = (req, res) => {
  res.send({ msg: 'getAll route' })
}

const getOne = (req, res) => {
  res.send({ msg: 'getOne route' })
}

const create = (req, res) => {
  res.send({ msg: 'create route' })
}

const update = (req, res) => {
  res.send({ msg: 'update route' })
}

const deleteOne = (req, res) => {
  res.send({ msg: 'delete route' })
}

export default { getAll, getOne, create, update, deleteOne }

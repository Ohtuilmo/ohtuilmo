const express = require('express')
const { checkAdmin } = require('../middleware')

const tagsRouter = express.Router()
const db = require('../models/index')


tagsRouter.get('/', checkAdmin, async (req, res) => {
  try {
    const tags = await db.Tag.findAll({
      attributes: ['id', 'name'],
      raw: true
    })
    res.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    res.status(500).json({ error: 'Error fetching tags' })
  }
})

tagsRouter.post('/', checkAdmin, async (req, res) => {
  const { name } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Name is missing.' })
  }

  try {
    const tag = await db.Tag.create({ name })
    res.status(201).json(tag)
  } catch (error) {
    console.error('Error creating tag:', error)
    res.status(500).json({ error: 'Error creating tag.' })
  }
})

tagsRouter.delete('/:id', checkAdmin, async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    await db.Tag.destroy({ where: { id } })
    res.status(204).end()
  } catch (error) {
    console.error('Error deleting tag:', error)
    res.status(500).json({ error: 'Error deleting tag.' })
  }
})

module.exports = tagsRouter
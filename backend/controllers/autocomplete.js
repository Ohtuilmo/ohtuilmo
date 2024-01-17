const express = require('express')
const db = require('../models/index')
const { checkAdmin } = require('../middleware')

const router = express()

const ok = () => ({ ok: true })
const error = (reason) => ({ ok: false, error: reason })

const validateUsersQuery = (query) => {
  if (!query || !query.name || typeof query.name !== 'string') {
    return error('Name must be a string')
  }

  if (query.name.length < 2) {
    return error('Name must contain at least 2 characters')
  }

  return ok()
}

/* GET /users?name=foo
 * response, up to 25 matches:
 * [
 *   { "student_number": "012345678", "first_names": "Jofoo Biz", "last_name": "Bar" },
 *   ...
 * ]
 */
router.get('/users', checkAdmin, async (req, res) => {
  const { ok, error } = validateUsersQuery(req.query)
  if (!ok) {
    return res.status(400).json({ error })
  }

  const { name } = req.query
  const matches = await db.sequelize.query(
    'SELECT "student_number", "first_names", "last_name" FROM "users" AS "u" ' +
      'WHERE lower("u"."first_names") LIKE $name ' +
      'OR lower("u"."last_name") LIKE $name ' +
      'LIMIT 10',
    {
      bind: { name: `%${name.toLowerCase()}%` },
      type: db.sequelize.QueryTypes.SELECT
    }
  )

  res.status(200).json(matches)
})

module.exports = router

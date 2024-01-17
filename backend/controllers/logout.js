const logoutRouter = require('express').Router()

const handleDatabaseError = (res, error) => {
  console.log(error)
  res.status(500).json({ error: 'Something is wrong... try reloading the page' })
}

logoutRouter.post('/', async (req, res) => {
  try {
    const logoutUrl = req.headers.shib_logout_url
    const { returnUrl } = req.body
    if (logoutUrl) {
      return res
        .status(200)
        .send({ logoutUrl: `${logoutUrl}?return=${returnUrl}` })
        .end()
    }
    res
      .status(200)
      .send({ logoutUrl: returnUrl })
      .end()
  } catch (error) {
    handleDatabaseError(res, error)
  }
})

module.exports = logoutRouter

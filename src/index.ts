import express from 'express'
import userRouter from '~/users.routes'
const app = express()
const port = 3000

app.post('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

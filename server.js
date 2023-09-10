const http = require('http')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app)
const rateLimiter = require('./middleware/rate-limiter')
app.use(rateLimiter(2,5))
app.use('/api1',(req,res,next)=>{
    res.status(200).json({message:"Response from api1"})
})
app.use('/api2', (req, res, next) => {
    res.status(200).json({ message: "Response from api2" })
})
app.use('/api3', (req, res, next) => {
    res.status(200).json({ message: "Response from api3" })
})
server.listen(port, () => console.log(`Server listening on port 3000`))
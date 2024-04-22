const express = require('express')
const port = 3000
const fileRouter = require('./routes/index')

const app = express();
app.use(express.json());
app.use('/api', fileRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

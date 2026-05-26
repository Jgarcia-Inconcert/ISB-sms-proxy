const app = require('./api/index');
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
const express = require('express');

const routerApi = require('./routes');
// los middlewares de tipo error se deben hacer despues de definir el routing
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler')

const app = express();

app.use(express.json());

// Routes
app.get('/api', (req, res) => {
    res.send('API operativa');
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'API operativa ruta test'});
});

routerApi(app); // Se modulariza las rutas

// en el orden en el que se declaran es en el orden en que se ejecutarian
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

module.exports = app;
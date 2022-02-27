const express = require('express');
const exphbs = require('express-handlebars');
const indexRouter = require('./routes/index.route');
const quinielaRouter = require('./routes/quiniela.route');

const app = express();
const port = 3000;

app.use(express.static(__dirname + "/public"));

//handlebars settings
 app.set('view engine', 'hbs');
 app.engine('hbs', exphbs({
     extname: 'hbs',
     defaultLayout: 'index',
     layoutsDir: __dirname + '/views/layouts',
     partialsDir: __dirname + '/views/partials',
     helpers: {
        // getBaseUrl: () => process.env.BASE_URL
     }
 }));


app.use('/', indexRouter);
app.use('/quinielas', quinielaRouter);

app.listen(port, () => console.log(`App listening to port http://localhost:${port}`));
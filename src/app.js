const path = require('path')
const express = require('express')
const hbs= require('hbs')
const geoCode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirpath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

// setup static directory to serve
const helpPage = path.join(publicDirpath, 'help')

app.use(express.static(publicDirpath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Gaurav Hajare'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
       title: 'About me',
       name: 'Gaurav Hajare' 
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'This is the help message to be displayed.',
        name: 'Gaurav'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }else {
        geoCode(req.query.address, (error, {latitude, longitude, location} = {}) => {
            if (error) {
                return res.send({ error })
            }
        
            forecast(latitude, longitude, (error, forecastData) => {
                if(error) {
                    return res.send({ error })
                }

                res.send({
                    forecast: forecastData,
                    location: location,
                    address: req.query.address
                })
            })
        })
    }
    
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('error404', {
        title: '404',
        errorText: 'Help article not found',
        name: 'Gaurav Hajare'
    })
})

app.get('*', (req, res) => {
    res.render('error404', {
        title: '404',
        errorText: 'Page not found',
        name: 'Gaurav Hajare'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
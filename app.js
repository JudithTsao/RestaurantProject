const express = require('express')
const mongoose = require('mongoose') 
mongoose.connect('mongodb://localhost/restaurant-list') 

const app = express()

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

const restaurantList = require('./restaurant.json')
const port = 3000

const exphbs = require('express-handlebars')
app.engine('handlebars',exphbs({defaultLayout:'main'}))
app.set('view engine','handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index',{restaurants: restaurantList.results})
})

app.get('/restaurants/:restaurant_id',(req,res)=>{
    const restaurant = restaurantList.results.find(restaurant => 
        restaurant.id.toString() === req.params.restaurant_id)
    res.render('show', {restaurant: restaurant })
    
})

app.get('/search',(req,res)=>{
    const keyword = req.query.keyword.toLowerCase()
    const restaurants = restaurantList.results.filter(restaurant =>
    restaurant.name.toLowerCase().includes(keyword) || restaurant.category.toLowerCase().includes(keyword)
    )
    res.render('index',{restaurants,keyword})
   
})
   

app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}`)
    
})

const express = require('express')
const mongoose = require('mongoose') 
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
mongoose.connect('mongodb://localhost/restarant-list') 

const app = express()

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

//const restaurantList = require('./restaurant.json')
const port = 3000

const exphbs = require('express-handlebars')
app.engine('handlebars',exphbs({defaultLayout:'main'}))
app.set('view engine','handlebars')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    Restaurant.find() 
    .lean() 
    .then(restaurants => res.render('index',{restaurants})) 
    .catch(error => console.error(error)) 

})

//app.get('/restaurants/:restaurant_id',(req,res)=>{
//    const restaurantPicked = restaurantList.results.find(restaurant => 
//    restaurant.id.toString() === req.params.restaurant_id)
//    res.render('show', {restaurant: restaurantPicked })
    
//})

app.get('/search',(req,res)=>{
    const keyword = req.query.keyword.toLowerCase()
    const restaurants = restaurantList.results.filter(restaurant =>
    restaurant.name.toLowerCase().includes(keyword) || restaurant.category.toLowerCase().includes(keyword)
    )
    res.render('index',{restaurants,keyword})
   
})

// 新增餐廳
app.get('/restaurants/new',(req,res) => {
    res.render('new')

})



// 瀏覽特定頁面
app.get('/restaurants/:restaurantId', (req, res) => {
    const  {restaurantId} = req.params
    Restaurant.findById(restaurantId)
      .lean()
      .then(restaurants => res.render('show',{restaurants}))
      .catch(err => console.log(err))
  })

//修改特定餐廳
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then((restaurants) => res.render('edit', { restaurants }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const category = req.body.category
  const phone = req.body.phone
  const location = req.body.location

  return Restaurant.findById(id)
    .then(restaurant=> {
      restaurant.name = name
      restaurant.category = category
      restaurant.phone = phone
      restaurant.location = location
      return restaurant.save()
    })
    .then(()=> res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})


app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}`)
    
})

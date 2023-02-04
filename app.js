import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
// import { initializePassport } from './passport.config.js'
import  passportConfigBuilder  from './passportconfig.cjs'
import passport from 'passport'
console.log(passportConfigBuilder)
const app = express()
app.listen(8080, () => console.log('Server Up'))
mongoose.set('strictQuery', true)
mongoose.connect('mongodb+srv://dcsweb:MopG23GHLEu3GwB0@dcsweb.snm3hyr.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const baseSession = session({
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://dcsweb:MopG23GHLEu3GwB0@dcsweb.snm3hyr.mongodb.net/?retryWrites=true&w=majority' }),
  secret: 'c0d3r',
  resave: true,
  saveUninitialized: true
})

app.use(express.json())
app.use(baseSession)
passportConfigBuilder(mongoose.Schema({})).GoogleoAuth({
  clientID: '781852376959-1rqb531406erb9hplkvcrg7rmhdjp0hb.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:8080/auth/google/callback'
}, true)
  .buildLocalConfig()
app.use(passport.initialize())
app.use(passport.session())

app.post('/register', passport.authenticate('register', { failureRedirect: '/failedRegister' }), (req, res) => {
  res.send({ message: 'Signed Up' })
})

app.post('/failedRegister', (req, res) => {
  res.send({ error: 'I cannot authenticate you' })
})

app.post('/login', passport.authenticate('login', { failureRedirect: '/failedLogin' }), (req, res) => {
  res.send({ message: 'Logged In' })
})

app.post('/failedLogin', (req, res) => {
  res.send({ error: 'I cannot log in' })
})

app.get('/logout', (req, res) => {
  req.logout()
})
app.get('/login', (req, res) => {
  req.session.reload((some)=>{
    console.log(req.session)
    res.send({ message: 'Successifully logged', session: req.session.passport })

  })
})
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }),)
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failure', successRedirect: '/login' }), (req, res) => {
  res.send('logueado')
})
app.get('/logout', (req, res) => req.logout(() => res.send('loged out')))

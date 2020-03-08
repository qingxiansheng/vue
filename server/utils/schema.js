const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 表movies的scheamal
var movie_schema = new Schema({
    title: String,
    genres: Array,
    year: String,
    rating: Object,
    id: String,
    casts: Array,
    directors: Array,
    images: Object
});
exports.Movie = mongoose.model('movie', movie_schema);
// 表users的schema
var users_schema = new Schema({
    username: String,
    mobile: Number,
    password: String,
    dbpwd: String,
    time: Date,
    pic:String,
    uid: Number,
    age: Number,
    word: String,
    address: String
})
exports.User = mongoose.model('user', users_schema);
// 表uids的schema
var uid_schema = new Schema({
    names: String,
    id: Number
})

exports.Uid = mongoose.model('uid', uid_schema);
// 表

// 影院cinema
var cinema_schema = new Schema({
    cinemaId: Number,
    name:String,
    address:String,
    longitude:Number,
    latitude:Number,
    gpsAddress:String,
    cityId:Number,
    cityName:String,
    districtId:Number,
    districtName:String,
    district:Object,
    phone:String,
    telephones:Array,
    logoUrl:String,
    businessTime:String,
    notice:String,
    isVisited:Number,
    lowPrice: Number,
    Distance:Number,
    eTicketFlag:Number,
    seatFlag:Number,
    ticketTypes: Number
})
exports.Cinema = mongoose.model('cinema',cinema_schema);
// 城市
var city_schema=new Schema({
    cityId: Number,
    name: String,
    pinyin:String,
    isHot:Number,
}); 
exports.City=mongoose.model('city',city_schema);

// 电影评论

var rate_schema = new Schema({
   filmId:Number,
   username:String,
   mobile:Number,
   cid:Number,
   content:String,
   rateId:String,
   rate:Number,
})

exports.Rate = mongoose.model('rate', rate_schema);
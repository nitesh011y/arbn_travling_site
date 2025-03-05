const mongoose= require("mongoose");
  const initdata = require("./data.js");
  const Listing = require("../model/listing.js");


  const mongo_url= "mongodb://127.0.0.1:27017/travel"
async function main() {
  await mongoose.connect(mongo_url)
}
main().then(res=>console.log("connected   "))


const initdb = async()=>{
  await Listing.deleteMany({})
  await Listing.insertMany(initdata.data);
  console.log('data was inserted');

}

initdb  ();

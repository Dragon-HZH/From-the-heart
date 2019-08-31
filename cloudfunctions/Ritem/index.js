// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: "huang521314-iu573"
});

exports.main = async(event, context) => {
  var _id = event._id;
  var set_name = event.set_name;

  return db.collection(set_name)
    .doc(_id)
    .remove();

}
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: "huang521314-iu573"
});

exports.main = async(event, context) => {
  var id = event.id;
  var set_name = event.set_name;
  var isActive = event.isActive;
  return db.collection(set_name)
    .doc(id)
    .update({
      data: {
        isActive: isActive
      }
    }).then(res => {
      return res
    }).catch(e => {
      console.log(e)
    })
}
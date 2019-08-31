// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: "huang521314-iu573"
});

exports.main = async (event, context) => {
  try {
    return await db.collection('myphoto').where({
      course: true
    }).get();
  } catch (e) {
    console.log(e)
  }
}
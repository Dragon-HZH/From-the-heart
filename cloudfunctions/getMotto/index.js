// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: "huang521314-iu573"
});

exports.main = async(event, context) => {
  var openid = event.openid;
  var set_name = event.set_name;
  var motto = event.motto || ''; //修改的签名
  var skip = event.skip; // 控制数据库数据执行
  try {
    if (skip == 1) { //更新
      return db.collection(set_name)
        .where({
            openid: openid
        })
        .update({
          data: {
            motto: motto
          }
        })
    } else if (skip == 2) { //查询
      return db.collection(set_name)
        .where({
            openid: openid
        })
        .get()
        .then(res => {
          return res
        }).catch(err => {
          console.log(err)
        })
    } else if (skip == 0){
      return db.collection(set_name)
        .add({
          data: {
            openid,
            motto
          }
        })
    }
  } catch (err) {
    
  }
}
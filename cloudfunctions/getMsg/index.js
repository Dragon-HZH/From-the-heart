// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: "huang521314-iu573"
});
// 查询所有开放数据
exports.main = async(event, context) => {
  var set_name = event.set_name; //查看集合名
  var set_switch = event.set_switch; // 判断执行语句的条件 0默认,1是加载更多,2用户
  var set_limit = event.set_limit || 5; //查询条数
  var set_skip = event.set_skip || 5; //跳过数据条数
  var set_openid = event.set_openid || null; //用户唯一识别信息

  try {
    return await (() => {
      if (set_switch == 0) {
        return db.collection(set_name)
          .where({
            "isActive": true
          })
          .orderBy('time', 'desc')
          .limit(set_limit)
          .get()
      } else if(set_switch==1){
        return db.collection(set_name)
          .where({
            "isActive": true
          })
          .orderBy('time', 'desc')
          .skip(set_skip)
          .limit(set_limit)
          .get()
      } else if (set_switch == 2){
        return db.collection(set_name)
          .where({
            "_openid": set_openid
          })
          .orderBy('time', 'desc')
          .limit(set_limit)
          .get()
      } else if (set_switch == 3) {
        return db.collection(set_name)
          .where({
            "_openid": set_openid
          })
          .orderBy('time', 'desc')
          .skip(set_skip)
          .limit(set_limit)
          .get()
      }
    })();
  } catch (e) {
    console.log(e)
  }
}
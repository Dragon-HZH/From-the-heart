// pages/self/self.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '格言...',
    say: '',
    set_name: "motto",
    author: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData.author)
    this.setData({
      author: app.globalData.author
    })
    this.inMotto(2)
  },
  onSayChange(event) { //动态获取输入框值
    this.setData({
      say: event.detail
    })
  },
  updateMotto() { //更新格言
    console.log(this.data.say)
    if (this.data.motto !== this.data.say && this.data.say!=="") {
      this.setData({
        motto: this.data.say
      })
      this.inMotto(1)
    }
  },
  inMotto(skip) {
    wx.cloud.callFunction({
      name: "getMotto",
      data: {
        set_name: this.data.set_name,
        openid: this.data.author.openid,
        motto: this.data.motto,
        skip: skip
      }
    }).then(res => {
      if (skip == 2) {
        // console.log(res.result.data)
        if (res.result.data.length == 0) {
          this.inMotto(0);
          // console.log('**9*9*9')
        } else {
          this.setData({
            motto: res.result.data[0].motto
          })
        }
      }
    }).catch(err => {
      console.log(err)
    })
  },
  jumpWrite() {
    wx.navigateTo({
      url: '/pages/self/article/article',
    })
  }

})
var app = getApp();
Page({
  data: {},
  
  getUser(event) {
    var obj = event.detail.userInfo;
    var author = {
      name: obj.nickName,
      avatar: obj.avatarUrl
    }
    wx.cloud.callFunction({
      name: 'getInfo'
    }).then(res => {
      author.openid = res.result.openid;
      author.appid = res.result.appid;
      app.globalData.author = author;
    })
    this.jumpNext();

  },
  jumpNext() {
    wx.switchTab({
      url: '../read/read',
    })
  }

})
var app = getApp();
var db = wx.cloud.database({
  env: "huang521314-iu573"
})
Page({
  data: {
    title: '',
    content: '',
  },
  onLoad: function (options) {

  },
  onTitleChange(event) {  //获取标题
    this.setData({
      title: event.detail
    })
  },
  onContentChange(event) { //获取文本
    this.setData({
      content: event.detail
    })
  },
  submit() {
   
    if (this.data.title == '' ){
      wx.showToast({
        title: '缺少标题',
        icon:'none'
      });
      return;
    } else if (this.data.content == ''){
      wx.showToast({
        title: '缺少内容',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '提示',
      content: '上传是否发布?',
      cancelText: "否",//默认是“取消”
      confirmText: "是",//默认是“确定”
      success: (res) => {
        if (res.confirm) {
          this.upload(true);
        }else{
          this.upload(false);
        }
      }
    })

    
  },
  upload(isActive){
    wx.showLoading({
      title: '上传中...',
    })
    var time = new Date().getTime();
    db.collection('article').add({
      data: {
        author: app.globalData.author,
        title: this.data.title,
        content: this.data.content,
        time: time,
        isActive: isActive
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading();
      wx.showToast({
        title: '已上传'
      })
      this.setData({
        title: '',
        content: ''
      })
    }).catch(err => {
      wx.hideLoading();
      console.log(err)
    })
  }
})

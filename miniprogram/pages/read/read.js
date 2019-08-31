var db = wx.cloud.database({
  env: "huang521314-iu573"
})
Page({

  data: {
    page_show: true, //显隐
    isCan: true,
    list_img: [], //轮播图
    article_list: [],
    show_list: [], //控制数据显示
    set_name:"article", //链接的那个表
    set_limit:5,   //每次查询的数据条数
  },
  jumpArticle() {
    wx.navigateTo({
      url: "/pages/index/article/article",
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCourse();
  },
  getCourse() { //轮播图获取
    wx.showLoading({
      title: '加载中...',
    })

    wx.cloud.callFunction({ //调用云函数获取图片路径
      name: "getCourse"
    }).then(res => {
      this.setData({
        list_img: res.result.data[0].fileIds
      });
      this.getMsg(); // 获取文章数据
    }).catch(err => {
      console.log(err)
    })

  },
  dian(event) { //点击切换
    var i = event.target.dataset.index;
    this.data.show_list[i] = !this.data.show_list[i];
    this.setData({
      show_list: this.data.show_list
    })
  },
  init(len) {
    for (var i = 0; i < len; i++) {
      this.data.show_list.push(false);
    }
  },

  getMsg(set_switch = 0,  swl = true) { //获取数据
    if (this.data.isCan == false) return; //判断是否可以加载数据
    this.setData({
      isCan: false
    })
    wx.cloud.callFunction({ //调用云函数获取数据
        name: 'getMsg',
        data: {
          set_switch,
          set_name:this.data.set_name,
          set_limit:this.data.set_limit,
          set_skip: this.data.article_list.length
        }
      })
      .then(res => {
        var list = res.result.data;
        var len = list.length;
        this.setData({
          article_list: swl?list:this.data.article_list.concat(list),
          page_show: false,
          isCan: true
        });
        // console.log(list)
        wx.hideLoading();
        if (len == 0) {
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none',
            duration: 1500
          })
        } else {
          this.init(len);
        }
      }).catch(err => {
        console.log(err)
      })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showLoading({
      title: '刷新...',
    })
    this.setData({
      show_list:[]
    })
    this.getMsg();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function() {
    // 获得当前有多少条数据,要跳过
    if (this.data.article_list.length< 1) return;
    this.getMsg(1,false);
  },

})
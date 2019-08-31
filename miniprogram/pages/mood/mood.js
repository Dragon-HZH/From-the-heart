// pages/mood/mood.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    set_name: "article", //链接的那个表
    set_limit: 5, //每次查询的数据条数
    article_list: [],
    show_list:[],   //文章状态
    page_show:true,
    show_view:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAll();
  },

  del_item(event){
    wx.showModal({
      title: '提示',
      content: '确定要删除这条数据吗?',
      success: (res)=> {
        if (res.confirm) {
          this.do_del(event);
        }
      }
    })
  },
  do_del(event){  //做删除操作
    var i = event.target.dataset.index;  //数组下标
    var _id = this.data.article_list[i]._id;  //文章id
    this.data.article_list.splice(i, 1); //删除数组中的数据
    this.setData({
      article_list: this.data.article_list
    })

    wx.cloud.callFunction({
      name: "Ritem",
      data: {
        _id,
        set_name: this.data.set_name
      }
    }).then(res => {
      // console.log(res)
    }).catch(err => {
      // console.log(err)
    })
  },
  transform(event){
    var i = event.target.dataset.index;
    var value = this.data.article_list[i].isActive
    this.data.article_list[i].isActive = !value;
    this.setData({
      article_list:this.data.article_list
    })
    console.log(app.globalData.author.openid)
    wx.cloud.callFunction({
      name:'transform',
      data:{
        set_name:this.data.set_name,
        id: this.data.article_list[i]._id,
        isActive: !value
      }
    }).then(res=>{
      // console.log(res)
    }).catch(err=>{
      // console.log(err)
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

  //获取所有--分次获取
  getAll: function ( swl = true,set_switch = 2) { 
    wx.showLoading({
      title: '加载中...',
    });
    wx.cloud.callFunction({
      name: "getMsg",
      data: {
        set_switch,
        set_name: this.data.set_name,
        set_openid: app.globalData.author.openid,
        set_limit: this.data.set_limit,
        set_skip: this.data.article_list.length,
      }
    })
    .then(res => {
      var list = res.result.data;
      var len = list.length;
      this.setData({
        article_list: swl ? list : this.data.article_list.concat(list),
        page_show: false,
        isCan: true
      });
      if (set_switch == 2){
        if(len>0){
          this.setData({
            show_view:true
          })
        }
      }
      wx.hideLoading();
      if (len == 0) {
        wx.showToast({
          title: '没有更多数据了',
          icon: 'none',
          duration: 1500
        })
        return;
      } else {
        this.init(len);
      }
      // console.log(list)
    }).catch(err => {
      wx.hideLoading();
      // console.log(err)
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
      show_list: []
    })
    this.getAll();
    wx.stopPullDownRefresh();
  },
  jumpWrite() {
    wx.navigateTo({
      url: '/pages/self/article/article',
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getAll(false,3);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
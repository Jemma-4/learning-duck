import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userid: 0,
    username: "",
    userheadimg: "",
    workNum:0,
    careNum:0,
    fansNum:0,
    groupNum:0,
    likeNum:0,
    isinLearningRoom: false,
    LearningRoom: "",
    todayFocustime: 0,
  },
  mutations: {
    setUserid(state, userid) {
      return state.userid = userid;
    },
    setUsername(state, username) {
      return state.username = username;
    },
    setUserheadimg(state, userheadimg) {
      return state.userheadimg = userheadimg;
    },
    setIsinLearningRoom(state, isinLearningRoom) {
      return state.isinLearningRoom = isinLearningRoom;
    },
    setLearningRoom(state, LearningRoom) {
      return state.LearningRoom = LearningRoom;
    },
    setTodayFocustime(state, todayFocustime) {
      return state.todayFocustime = todayFocustime;
    },
    setWorkNum(state, workNum) {
      return state.workNum = workNum;
    },
    setCareNum(state, careNum) {
      return state.careNum = careNum;
    },
    setFansNum(state, fansNum) {
      return state.fansNum = fansNum;
    },
    setGroupNum(state, groupNum){
      return state.groupNum = groupNum;
    },
    setLikeNum(state, likeNum){
      return state.likeNum = likeNum;
    }

  },
  actions: {
  },
  modules: {
  }
})

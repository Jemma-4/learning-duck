import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Efficiency from '../views/Efficiency.vue'
import Register from '../views/Register.vue'
import LearningCommunity from '../views/LearningCommunity.vue'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'Default',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login

  },
  {
    path: '/manage',
    name: 'Manage',
    component: () => import("../views/Administrator.vue")

  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/',
        redirect: '/home/efficiency'
      },
      {
        path: 'efficiency',
        component: Efficiency,
        children: [
          {
            path: '/',
            redirect: "/home/efficiency/list"
          },
          {
            path: 'list',
            component: () => import("../views/PlanList.vue")
          }
        ]
      },
      {
        path: 'discovery',
        component: LearningCommunity,
        children: [
          {
            path: '/',
            redirect: '/home/discovery/detail'
          },
          {
            path: 'detail',
            component: () => import("../views/Discovery.vue")
          },
          {
            path: 'search/:keyword',
            component: () => import("../views/SearchResult.vue")
          },
        ]
          },
          {
            path: 'post',
            component: () => import("../views/Post.vue")
          },
          {
            path: 'group',
            component: () => import("../views/GroupBar.vue")
          },
          {
            path: 'mine',
            component: () => import("../views/Mine.vue")
          },
        ]
      },
      {
        path: '/clock/:clockId',
        component: () => import("../views/ClockDetail.vue")
      },
      {
        path: '/invitation/:userId/:workId',
        component: () => import("../views/Invitation.vue")
      },
      {
        path: '/group/:userId/:groupId',
        component: () => import("../views/GroupDetail.vue")
      },
      {
        path: '/tag/:userId/:tagId',
        component: () => import("../views/TagDetail.vue")
      },
      {
        path: '/user/:myId/:userId',
        component: () => import("../views/UserInformation.vue")
      },
      {
        path: '/learningroom/:roomId',
        component: () => import("../views/InnerLearningRoom.vue")
      },
      {
        path: '/groupmember/:groupId',
        component: () => import("../views/MemberList.vue")
      },
      {
        path: '/selfstudy',
        component: () => import("../views/LearningRoom.vue")
      },
      {
        path: '/setting',
        component: () => import("../views/Setting.vue")
      },
      {
        path: '/myworks',
        component: () => import("../views/MyWorks.vue")
      },
      {
        path: '/follow',
        component: () => import("../views/Follow.vue")
      },
      {
        path: '/fans',
        component: () => import("../views/Fans.vue")
      },
      {
        path: '/likeworks',
        component: () => import("../views/MyLikeWorks.vue")
      },
      {
        path: '/wallet',
        component: () => import("../views/MyWallet.vue")
      },
      {
        path: '/message',
        component: () => import("../views/Message.vue")
      },
      {
        path: '/mygroup',
        component: () => import("../views/community.vue")
      },
      {
        path: '/learningdetail/:userId',
        component: () => import("../views/LearningDetail.vue")
      },
      {
        path: '/creategroup',
        component: () => import("../views/CreateGroup.vue")
      }
    ]

const router = new VueRouter({
      routes,
      // mode: "history"
    })

export default router

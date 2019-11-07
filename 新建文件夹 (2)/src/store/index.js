
import Vue from 'vue'
import Vuex from 'vuex'
import output from './modules/output'
import login from './modules/login'
import outIn from './modules/outIn'
import completion from './modules/completion'
import target from './modules/target'
import config from './modules/config'
import weight from './modules/weight'
import write from './modules/write'
import perCapita from './modules/perCapita'
import setting from './modules/setting'
import college from './modules/college'
import user from './modules/user'
import role from './modules/role'
import indAnalysis from './modules/indAnalysis'
import evaluation from './modules/evaluation'
import dashboard from './modules/dashboard'
import trendAnalysis from './modules/trendAnalysis'
import manageIndDetail from './modules/manageIndDetail'
import dept from './modules/dept'
import task from './modules/task'
import asgmtTask from './modules/asgmtTask'
import commitTask from './modules/commitTask'
import checkTask from './modules/checkTask'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    login,
    output,
    completion,
    outIn,
    target,
    config,
    weight,
    write,
    perCapita,
    setting,
    college,
    user,
    role,
    indAnalysis,
    evaluation,
    dashboard,
    trendAnalysis,
    manageIndDetail,
    dept,
    task,
    asgmtTask,
    commitTask,
    checkTask
  }
})

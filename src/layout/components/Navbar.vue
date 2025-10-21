<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />

    <breadcrumb v-if="!topNav" id="breadcrumb-container" class="breadcrumb-container" />
    <top-nav v-if="topNav" id="topmenu-container" class="topmenu-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->
        <!-- 账户余额 -->
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="hover">
          <span>账户余额：</span>
          <span style="font-size: 24px; color: orange; font-weight: bold;">${{ financialSummary &&
            financialSummary.accountBalance ? financialSummary.accountBalance : '0.00' }}
          </span>
          <el-button type="primary" size="medium" class="recharge-btn" @click="showRechargeDialog">
            充值
          </el-button>
        </el-dropdown>

        <el-dialog title="Scan QRCode to Contact me" :visible.sync="rechargeDialogVisible" width="500px" center
          custom-class="recharge-dialog">
          <div class="recharge-content">
            <img width="300px" height="300px" :src="mePic" alt="Contact me to Charge" class="recharge-qrcode">
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="rechargeDialogVisible = false">关闭</el-button>
          </span>
        </el-dialog>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="hover">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <span class="user-nickname"> {{ nickName }} </span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import mePic from '@/assets/promo/me.jpg'
import { getUserFinancialSummary } from '@/api/income/income'

export default {
  emits: ['setLayout'],
  data() {
    return {
      financialSummary: null,
      rechargeDialogVisible: false,
      mePic: mePic
    }
  },
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'nickName'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  methods: {
    fetchFinancialSummary() {
      getUserFinancialSummary().then(res => {
        if (res.code === 200) {
          this.financialSummary = res.data
        }
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    setLayout(event) {
      this.$emit('setLayout')
    },
    logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index'
        })
      }).catch(() => { })
    },
    showRechargeDialog() {
      this.rechargeDialogVisible = true
    }
  },
  created() {
    this.fetchFinancialSummary()
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 0px;
      padding-right: 0px;

      .avatar-wrapper {
        margin-top: 10px;
        right: 8px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .user-nickname {
          position: relative;
          bottom: 10px;
          left: 2px;
          font-size: 14px;
          font-weight: bold;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.recharge-btn {
  border-radius: 25px !important;
  background: linear-gradient(135deg, #FF8C00, #FFA500) !important;
  border: none !important;
  padding: 8px 20px !important;
  font-size: 20px !important;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(255, 140, 0, 0.3);
  transition: all 0.3s ease;
  margin-left: 10px;
  margin-right: 15px;
  margin-bottom: 5px;
  /* Move 50px to the left by adding right margin */

  &:hover {
    background: linear-gradient(135deg, #FF7000, #FF8C00) !important;
    box-shadow: 0 4px 12px rgba(255, 140, 0, 0.4);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>

<style lang="scss">
// Global styles for the dialog (not scoped)
.recharge-dialog {
  border-radius: 8px;
  overflow: hidden;

  .el-dialog__header {
    background: linear-gradient(135deg, #1e88e5, #42a5f5);
    color: white;
    padding: 10px;
    border-radius: 8px 8px 0 0;

    .el-dialog__title {
      color: white;
      font-weight: 300;
    }

    .el-dialog__headerbtn {
      .el-icon-close {
        color: white;
      }
    }
  }

  .el-dialog__body {
    background: linear-gradient(135deg, #bbdefb, #e3f2fd);
    padding: 20px;
  }

  .el-dialog__footer {
    background: linear-gradient(135deg, #bbdefb, #e3f2fd);
    padding: 10px;
    border-radius: 0 0 8px 8px;
  }
}

.recharge-content {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .recharge-qrcode {
    max-width: 100%;
    height: auto;
    border: 8px solid white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.dialog-footer {
  text-align: center;

  .el-button {
    background: #1e88e5;
    border-color: #1e88e5;
    color: white;

    &:hover {
      background: #1976d2;
      border-color: #1976d2;
    }
  }
}
</style>
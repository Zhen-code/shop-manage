<template>
  <div>
    <!-- Backgrounds -->

    <div id="login-bg" class="container-fluid">

      <div class="bg-img"></div>
      <div class="bg-color"></div>
    </div>

    <!-- End Backgrounds -->

    <div class="container" id="login">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="login">

            <h3>登录</h3>

            <!-- Loging form -->
            <form>
              <div class="form-group">
                <input type="user" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="username" placeholder="用户名">

              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="exampleInputPassword1" v-model="password" placeholder="密码">
              </div>

              <div class="form-check">

                <label class="switch">
                  <input type="checkbox" v-model="isRember">
                  <span class="slider round"></span>
                </label>
                <label class="form-check-label" for="exampleCheck1">记住密码</label>

                <label class="forgot-password"><a href="#">忘记密码?</a></label>

              </div>

              <br>
              <button type="submit" class="btn btn-lg btn-block btn-success" @click.prevent="login">登录</button>
            </form>
            <!-- End Loging form -->

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {sessionData} from '../utils'

export default {
  data () {
    return {
      username: 'admin',
      password: '123456',
      isRember: false
    }
  },
  methods: {
    login () {
      this.$http.post('login', {
        username: 'admin',
        password: this.password
      }).then(res => {
        this.$message({
          type: 'success',
          message: '登录成功'
        })
        sessionData('set', 'token', res.token)
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err
        })
        console.log(err)
      })
      console.log(this.isRember)
    }
  }
}
</script>
<style scoped>
  #login-bg.container-fluid {
    padding: 0;
    height: 100%;
    position: absolute;
  }

  .bg-img , .bg-color {
    min-width: 50%;
    vertical-align: top;
    padding: 0;
    margin-left: 0;
    background-color: #CAF0D3;
    display: inline-block;
    overflow: hidden;
  }

  .bg-color {
    margin-left: -5px;
  }

  .bg-img {
    background-image: url("../assets/bg-image.jpeg");
    background-size: cover;
    height: 100%;
  }

  #login{
    padding-top: 10%;
    text-align: center;
    text-transform: uppercase;
  }

  .login {
    width: 100%;
    height: 500px;
    background-color: #fff;
    padding: 15px;
    padding-top: 30px;
  }

  .login h1 {
    margin-top: 30px;
    font-weight: bold;
    font-size: 60px;
    letter-spacing: 3px;
  }

  .login form {
    max-width: 420px;
    margin: 30px auto;
  }

  .login .btn {
    border-radius: 50px;
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 2px;
    font-size: 20px;
    padding: 14px;
    background-color: #00B72E;
  }

  .form-group input {
    font-size: 20px;
    font-weight: lighter;
    border: none;
    background-color: #F0F0F0;
    color: #465347!important;
    padding: 26px 30px;
    border-radius: 50px;
    transition : 0.2s;
  }

  /* Form check styles*/

  .form-check {
    padding: 0;
    text-align: left;
  }

  .form-check label {
    vertical-align: top;
    padding-top: 5px;
    padding-left: 5px;
    font-size: 15px;
    color: #606060;
    font-size: 14px;
  }

  .forgot-password {
    text-align: right;
    float: right;
    font-weight: bold;
  }

  .forgot-password a {
    color: #00B72E;
    opacity: 0.6;
  }

  .forgot-password a:hover {
    opacity: 1;
  }

  /* Switch styles */

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
  }

  /* Hide default HTML checkbox */
  .switch input {display:none;}

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #F0F0F0;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 30px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #00B72E;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #00B72E;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(30px);
    -ms-transform: translateX(30px);
    transform: translateX(30px);
  }

  /* Media queries */

  @media(max-width: 500px) {
    .bg-img , .bg-color {
      min-width: 100%;
      margin: 0;
    }

    .forgot-password {
      text-align: right;
      float: left;
      padding: 20px 0;
    }

    #login {
      padding-top: 50px;
    }

  }

</style>

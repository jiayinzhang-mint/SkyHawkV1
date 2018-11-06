<template>
    <v-app id="inspire" class="background">
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4 style="max-width:500px">
                        <v-card class="elevation-12">
                            <v-container>
                                <v-card-text>
                                    <p class="text-md-center headline mb-4">登录 SkyHawk</p>
                                    <v-form>
                                        <v-text-field v-model="username" prepend-icon="person" name="login" label="用户名" type="text"></v-text-field>
                                        <v-text-field v-model="password" id="password" prepend-icon="lock" name="password" label="密码" type="password"></v-text-field>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn dark class="primary" @click="login" block round>登录</v-btn>
                                </v-card-actions>
                            </v-container>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
        <v-footer class="pa-4 trans">
            <div @click="jump" class="jump">
                <img width="20px" style="margin-left:-5px" src="/static/assets/INSDIM.svg">
            </div>
            <v-spacer></v-spacer>
            <div>Copyright &copy; {{ new Date().getFullYear() }} INSDIM Inc. 保留所有权利</div>
        </v-footer>
    </v-app>
</template>

<script>
import { mapMutations } from "vuex";
import vuexAlong from "vuex-along";
export default {
    data: () => ({
        username: "",
        password: ""
    }),
    methods: {
        ...mapMutations(["updateUserInfo"]),
        jump() {
            window.open("https://inslens.com", "_blank");
        },
        detectDevice() {
            const isMobile = {
                Android: function() {
                    return navigator.userAgent.match(/Android/i) ? true : false;
                },
                BlackBerry: function() {
                    return navigator.userAgent.match(/BlackBerry/i)
                        ? true
                        : false;
                },
                iOS: function() {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
                        ? true
                        : false;
                },
                Windows: function() {
                    return navigator.userAgent.match(/IEMobile/i)
                        ? true
                        : false;
                },
                any: function() {
                    return (
                        isMobile.Android() ||
                        isMobile.BlackBerry() ||
                        isMobile.iOS() ||
                        isMobile.Windows()
                    );
                }
            };
            if (isMobile.any()) {
                const device = "mobile";
                return device;
            } else {
                const device = "desktop";
                return device;
            }
        },
        login() {
            if (this.username && this.password) {
                this.$ajax
                    .post("/user/login", {
                        username: this.username,
                        password: this.password
                    })
                    .then(data => {
                        data = data.data;
                        console.log(data);
                        if (data.msg == "wrongpasswd") {
                            this.$message.error("用户名或密码错误");
                        } else if (data.msg == "nouser") {
                            this.$message.error("用户名或密码错误");
                        } else if (data.msg == "close") {
                            this.$message.error("账号已被锁定，请联系管理员");
                        } else {
                            const user = {};
                            user.username = data.username;
                            user.name = data.name;
                            user.role = data.role;
                            user.device = this.detectDevice();
                            user.token = data.token;
                            this.updateUserInfo(user);
                            this.$router.push({ path: "/index" });
                        }
                    });
            }
        }
    },
    mounted() {
        vuexAlong.clean();
    }
};
</script>

<style scoped>
.background {
    background-image: url("/static/assets/Back.jpg") !important;
    background-size: 100% 100% !important;
}
.trans {
    background-color: transparent;
    color: white;
}
.jump :hover {
    cursor: pointer;
}
</style>

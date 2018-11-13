<template>
    <h1>{{token}},{{role}},{{url}}</h1>
</template>

<style>
</style>
<script>
export default {
    data() {
        return {
            token: this.$route.query.token,
            role: this.$route.query.role,
            url: this.$route.query.url
        };
    },

    mounted() {
        sessionStorage.setItem("token", this.token);
        sessionStorage.setItem("role", this.role);
        this.$router.push(this.url);
    }
};
</script>
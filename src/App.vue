<template>
  <div id="app" dark>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => ({}),
  methods: {},
  mounted() {
    // if (!sessionStorage.getItem("skyhawk")) {
    //   this.$router.push({ path: "/" });
    // }
  }
};
</script>


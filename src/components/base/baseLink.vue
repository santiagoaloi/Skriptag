<template>
  <h5 v-bind="$attrs" :class="{ 'py-4': !noGutters }" class="ml-1 basic-link" v-on="$listeners" @click="to && $router.push(to)">
    <v-icon v-if="icon" left small dark>{{ icon }}</v-icon>
    <slot />
  </h5>
</template>

<script>
  export default {
    name: 'BaseLink',
    props: {
      icon: {
        type: String,
        default: null,
      },
      to: {
        type: String,
        default: null,
      },
      noGutters: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
<style scoped>
  .basic-link {
    color: rgb(155, 155, 155);
    transition: 1s;
    cursor: pointer;
  }

  .basic-link:hover {
    color: rgb(227, 227, 227);
    transition: 1s;
  }
</style>

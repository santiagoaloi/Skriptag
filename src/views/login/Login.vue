<template>
  <div>
    <base-split-2 id="login" right>
      <div>
        <h1>Login</h1>
        <p>Time to get stuff done!</p>
        <v-btn :ripple="false" x-small color="white" class="ml-n2 mb-n2" plain>Recover my password</v-btn>
        <form @submit.prevent="login()">
          <v-row no-gutters>
            <v-col cols="10">
              <div class="py-2 pr-2">
                <vs-input v-model="loginForm.email" block placeholder="Username">
                  <template #icon>
                    <v-icon dark>mdi-account</v-icon>
                  </template>
                </vs-input>
              </div>
            </v-col>
            <v-col cols="10">
              <div class="py-2 pr-2">
                <vs-input v-model="loginForm.password" block type="password" placeholder="Password">
                  <template #icon>
                    <v-icon dark>mdi-lock</v-icon>
                  </template>
                </vs-input>
              </div>
            </v-col>
          </v-row>

          <v-card-actions class="px-0">
            <v-btn large :loading="loading" type="submit" :ripple="false" color="teal white--text" width="100" class="mr-2">
              Login</v-btn
            >
            <v-btn large @click="$router.push('signup')">Signup</v-btn>
          </v-card-actions>
        </form>
      </div>
    </base-split-2>
  </div>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';

  export default {
    name: 'LoginSlide',

    computed: {
      ...get('authentication', ['isLoggedIn']),
      loading: sync('loaders/authLoader'),
      loginForm: sync('authentication/loginForm'),
    },

    methods: {
      ...call('authentication/*'),
      ...call('app', ['sleep']),

      async delayRender(ms) {
        await this.sleep(ms);
        this.showSlide = true;
      },
    },
  };
</script>
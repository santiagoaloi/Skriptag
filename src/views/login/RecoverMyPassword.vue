<template>
  <div class="pa-3">
    <div class="d-flex flex-wrap flex-column pl-1">
      <template v-if="recoveryMode">
        <h1>Reset password</h1>
        <p>Account recovery email.</p>
      </template>
    </div>
    <ValidationObserver ref="loginForm" slim>
      <form class="d-flex flex-column" @submit.prevent="validateLoginForm()">
        <BaseLink v-if="!recoveryMode" icon="$mdiLock" @click="recoveryMode = true">Recover my password</BaseLink>
        <v-row>
          <v-col cols="12" lg="10">
            <Base-field-title> Email</Base-field-title>
            <div class="pr-2">
              <Validation-provider
                v-slot="{ errors, failed }"
                v-bind="{ ...vvOptions }"
                name="email"
                :rules="{ email: true, required: true }"
              >
                <vs-input
                  v-model="loginForm.email"
                  :danger="failed"
                  maxlength="100"
                  block
                  placeholder="Email"
                  @focus="resetValidation()"
                >
                  <template #icon>
                    <v-icon dark>$mdiAccount</v-icon>
                  </template>
                  <template #message-danger>
                    <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>$mdiAlertCircleOutline</v-icon>
                    {{ errors[0] }}
                  </template>
                </vs-input>
              </Validation-provider>
            </div>
          </v-col>
          <v-col v-if="!recoveryMode" cols="12" lg="10">
            <Base-field-title> Password</Base-field-title>
            <div class="pr-2">
              <Validation-provider
                v-slot="{ errors, failed }"
                v-bind="{ ...vvOptions }"
                name="password"
                :rules="{ required: true }"
              >
                <vs-input
                  v-model="loginForm.password"
                  maxlength="100"
                  :danger="failed"
                  block
                  type="password"
                  placeholder="Your account password"
                  @focus="resetValidation()"
                >
                  <template #icon>
                    <v-icon dark>$mdiLock</v-icon>
                  </template>
                  <template #message-danger>
                    <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark>$mdiAlertCircleOutline</v-icon>
                    {{ errors[0] }}
                  </template>
                </vs-input>
              </Validation-provider>
            </div>
          </v-col>
          <v-col>
            <div class="ml-n1 mt-2">
              <template v-if="!recoveryMode">
                <Base-button type="submit" :loading="loading"> Login</Base-button>
              </template>

              <template v-if="recoveryMode">
                <Base-button @click.prevent="recoveryMode = false"> Back</Base-button>
                <Base-button type="submit" :loading="loading"> Reset password</Base-button>
              </template>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
  import { call, sync, get } from 'vuex-pathify';

  export default {
    name: 'LoginPage',

    data() {
      return {
        vvOptions: {
          mode: 'passive',
          slim: true,
        },
        recoveryMode: false,
        loginForm: {
          email: '',
          password: '',
        },
      };
    },

    computed: {
      loading: sync('loaders/authLoader'),
      ...get('authentication', ['isLoggedIn']),
    },

    methods: {
      ...call('authentication', ['login', 'accountRecoveryRequest']),
      ...call('snackbar/*'),

      resetValidation() {
        this.$refs.loginForm.reset();
      },

      async validateLoginForm() {
        try {
          const validated = await this.$refs.loginForm.validate();
          if (validated) {
            if (this.recoveryMode) {
              this.accountRecoveryRequest(this.loginForm.email);
              this.recoveryMode = false;
              return;
            }

            if (!this.recoveryMode) {
              this.login(this.loginForm);
              return;
            }

            return;
          }
          this.snackbarError('Please correct the fields highlighted in red');
        } catch (error) {
          this.snackbarError('something went wrong ');
        }
      },
    },
  };
</script>

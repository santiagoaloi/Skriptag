<template>
  <ValidationObserver ref="loginForm" slim>
    <form class="d-flex flex-column" @submit.prevent="validateLoginForm()">
      <BaseLink v-if="!recoveryMode" icon="$mdiLock"><span @click="recoveryMode = true"> Recover my password</span></BaseLink>
      <v-row>
        <v-col cols="12">
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
                placeholder="Your account email"
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
        <v-col v-if="!recoveryMode" cols="12">
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
        <v-col v-if="!recoveryMode" cols="12">
          <div class="center">
            <vs-checkbox v-model="isSessionPersisted" color="#000" class="ml-1">
              Persist my session afer closing the browser or tab.
            </vs-checkbox>
          </div>
        </v-col>
        <v-col cols="12">
          <div class="mt-2">
            <template v-if="!recoveryMode">
              <Base-button :disabled="loading" class="mr-sm-3" @click="$emit('goBack')"> Other sign-in options</Base-button>
              <Base-button type="submit" :loading="loading"> Login</Base-button>
            </template>

            <template v-if="recoveryMode">
              <Base-button :disabled="loading" class="mr-sm-3" @click.prevent="recoveryMode = false"> Back</Base-button>
              <Base-button type="submit" :loading="loading"> Reset password</Base-button>
            </template>
          </div>
        </v-col>
      </v-row>
    </form>
  </ValidationObserver>
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
      ...sync('authentication', ['isSessionPersisted']),
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

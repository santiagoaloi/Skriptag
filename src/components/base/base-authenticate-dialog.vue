<template>
  <BaseDialog v-model="internalValue" no-container no-toolbar dense close-only no-actions width="500" @close="close()">
    <v-card class="bg-dialog py-4">
      <h2 class="mx-3">{{ title }}</h2>
      <h5 class="mx-3 pt-2 white--text">{{ text }}</h5>
      <!-- <v-alert class="mb-n3" icon="$mdiAlert" color="transparent" type="info"> {{ text }}</v-alert> -->
    </v-card>
    <!-- <v-alert tile class="mt-0" color="grey darken-4" icon="$mdiShieldLockOutline" dense type="info">
      Enter your account password to allow this.
    </v-alert> -->

    <ValidationObserver ref="passwordField" slim>
      <form class="d-flex flex-column pt-6" @submit.prevent="validatePassword()">
        <v-card-text class="mt-n6">
          <Base-field-title> Password</Base-field-title>
          <div class="py-2 pr-2">
            <Validation-provider
              v-slot="{ failed, errors }"
              v-bind="{ ...vvOptions }"
              name="current password"
              :rules="{ required: true }"
            >
              <vs-input
                v-model="password"
                :danger="failed"
                type="password"
                block
                placeholder="Your account password"
                :disabled="loading"
                @focus="resetValidation()"
              >
                <template #icon>
                  <v-icon dark>$mdiLock </v-icon>
                </template>
                <template #message-danger>
                  <v-icon v-if="failed" color="pink" style="margin-top: -1px" x-small dark> $mdiAlertCircleOutline </v-icon>
                  {{ errors[0] }}
                </template>
              </vs-input>
            </Validation-provider>
          </div>
        </v-card-text>

        <v-card-actions class="px-6">
          <v-spacer></v-spacer>

          <BaseButton :disabled="loading" text @click.prevent="close()"> Close</BaseButton>
          <BaseButton class="ml-3" :loading="loading" type="submit"> Continue</BaseButton>
        </v-card-actions>
      </form>
    </ValidationObserver>
  </BaseDialog>
</template>
<script>
  import { call } from 'vuex-pathify';

  export default {
    name: 'BaseAuthenticateDialog',

    props: {
      value: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
      text: {
        type: String,
        default: '',
      },
      loading: {
        type: Boolean,
        default: false,
      },
      payload: {
        type: [Boolean, String, Object, Array],
        default: null,
      },
    },
    data() {
      return {
        vvOptions: {
          mode: 'passive',
          slim: true,
        },
        password: '',
        internalValue: this.value,
      };
    },

    watch: {
      internalValue(val, oldVal) {
        if (val === oldVal) return; // Don't do anything.
        this.$emit('input', val); // emit input change to v-model
      },

      value(val, oldVal) {
        if (val === oldVal) return;
        this.internalValue = val;
      },
    },

    methods: {
      ...call('snackbar/*'),
      ...call('authentication', ['reAuthenticate']),

      resetValidation() {
        this.$refs.passwordField.reset();
      },

      async validatePassword() {
        try {
          const validated = await this.$refs.passwordField.validate();
          if (validated) {
            // Returns the authenticated user.
            const authenticated = await this.reAuthenticate(this.password);

            if (authenticated) {
              this.$emit('authenticated', authenticated);
              this.$emit('authenticatedWithPayload', this.payload);
              this.password = '';
              return;
            }
          }
        } catch ({ ...error }) {
          if (error.code.includes('auth/wrong-password')) {
            this.snackbarError('Incorrect password , please try again.');
          }

          if (error.code.includes('auth/too-many-requests')) {
            this.snackbarError('Too many attempts, try again later.');
          }
        }
      },

      close() {
        this.$emit('close');
      },
    },
  };
</script>

<style scoped>
  .bg-dialog {
    background-color: #952e3d;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23000' fill-opacity='.1' points='120 0 120 60 90 30 60 0 0 0 0 0 60 60 0 120 60 120 90 90 120 60 120 0'/%3E%3C/svg%3E");
  }
</style>

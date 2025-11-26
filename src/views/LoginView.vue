<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import { useAuthStore } from '@/stores/auth'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'

const form = reactive({
  login: '',
  pass: '',
  remember: true,
})

const router = useRouter()
const authStore = useAuthStore()
const errorMessage = ref('')
const isLoading = ref(false)

const submit = async () => {
  errorMessage.value = ''
  
  if (!form.login || !form.pass) {
    errorMessage.value = 'Please enter both username and password'
    return
  }
  
  isLoading.value = true
  
  try {
    const result = await authStore.login({
      username: form.login,
      password: form.pass
    })
    
    if (result.success) {
      // Check if there's a stored redirect path
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/'
      localStorage.removeItem('redirectAfterLogin')
      router.push(redirectPath)
    } else {
      errorMessage.value = result.message || 'Login failed'
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during login'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="white">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Login" help="Please enter your login">
          <FormControl
            v-model="form.login"
            :icon="mdiAccount"
            name="login"
            autocomplete="username"
            :disabled="isLoading"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
            :disabled="isLoading"
          />
        </FormField>

        <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="Remember"
          :input-value="true"
          :disabled="isLoading"
        />

        <!-- Error message display -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <template #footer>
          <BaseButtons>
            <BaseButton 
              type="submit" 
              color="info" 
              :label="isLoading ? 'Logging in...' : 'Login'"
              :disabled="isLoading"
            />
            <!-- <BaseButton 
              to="/dashboard" 
              color="info" 
              outline 
              label="Back"
              :disabled="isLoading"
            /> -->
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>

<style scoped>
.error-message {
  color: #dc3545;
  background-color: #babbf7;
  border: 1px solid #839cec;
  border-radius: 4px;
  padding: 0.75rem;
  margin: 1rem 0;
  text-align: center;
}
</style>
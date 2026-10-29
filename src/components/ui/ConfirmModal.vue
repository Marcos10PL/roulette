<script setup lang="ts">
import { BUTTON_VARIANT } from '../../const'
import Button from './Button.vue'
import Modal from './Modal.vue'

const { confirmLabel = 'Potwierdź', danger = false } = defineProps<{
  title: string
  confirmLabel?: string
  danger?: boolean
}>()

const open = defineModel<boolean>({ required: true })

const emit = defineEmits<{ confirm: [] }>()

const confirm = () => {
  open.value = false
  emit('confirm')
}
</script>

<template>
  <Modal v-model="open" :title="title">
    <slot />

    <template #footer>
      <Button @click="open = false">Anuluj</Button>
      <Button
        :variant="danger ? BUTTON_VARIANT.DANGER : BUTTON_VARIANT.PRIMARY"
        @click="confirm"
      >
        {{ confirmLabel }}
      </Button>
    </template>
  </Modal>
</template>

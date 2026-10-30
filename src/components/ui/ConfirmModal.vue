<script setup lang="ts">
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
      <Button :variant="danger ? 'danger' : 'primary'" @click="confirm">
        {{ confirmLabel }}
      </Button>
    </template>
  </Modal>
</template>

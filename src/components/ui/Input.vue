<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

const { autofocus = false } = defineProps<{ autofocus?: boolean }>()

const model = defineModel<string>({ required: true })

const field = useTemplateRef<HTMLInputElement>('field')

onMounted(() => {
  if (autofocus) field.value?.focus()
})
</script>

<template>
  <input
    ref="field"
    v-model="model"
    type="text"
    class="min-w-0 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 outline-none focus:border-white"
  />
</template>

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
    class="h-10 min-w-0 rounded-full border border-violet-hi/35 bg-violet/10 px-5 text-base text-ink shadow-field outline-none placeholder:text-ink-3 focus:border-violet-glow focus:shadow-field-focus"
  />
</template>

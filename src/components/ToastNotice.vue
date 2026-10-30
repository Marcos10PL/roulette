<script setup lang="ts">
import { Star } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { fadeIn, fadeOut } from '../animations/effects'
import { useToastStore } from '../stores/toast'
import ResultBadge from './ResultBadge.vue'
import Toast from './ui/Toast.vue'

const { toast } = storeToRefs(useToastStore())

const onEnter = fadeIn({ duration: 0.3, y: -20, ease: 'back.out(1.5)' })
const onLeave = fadeOut({ duration: 0.25, y: -20 })
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-24 z-40 flex justify-center px-4"
    role="status"
    aria-live="polite"
  >
    <Transition :css="false" mode="out-in" @enter="onEnter" @leave="onLeave">
      <Toast
        v-if="toast"
        :key="toast.id"
        :tone="toast.tone"
        :title="toast.title"
        :text="toast.text"
        :amount="toast.amount"
      >
        <template #lead>
          <ResultBadge
            v-if="toast.pocket"
            :label="toast.pocket.label"
            :color="toast.pocket.color"
            size="lg"
          />
          <span
            v-else
            class="grid size-10 shrink-0 place-items-center rounded-full bg-violet/20 text-violet-hi ring-1 ring-violet-hi/40"
          >
            <Star :size="20" />
          </span>
        </template>
      </Toast>
    </Transition>
  </div>
</template>

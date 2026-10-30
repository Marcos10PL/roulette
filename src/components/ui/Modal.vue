<script setup lang="ts">
import gsap from 'gsap'
import { seconds } from '../../animations/motion'
import { fadeOut } from '../../animations/effects'
import { X } from '@lucide/vue'
import { nextTick, onBeforeUnmount, useTemplateRef, watch } from 'vue'
import type { ModalSize } from '../../types'
import Button from './Button.vue'
import { MODAL_SIZE_CLASSES } from '../../const/classes'

const openModals: (() => void)[] = []

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') openModals.at(-1)?.()
})

const { size = 'sm' } = defineProps<{ title: string; size?: ModalSize }>()

const open = defineModel<boolean>({ required: true })

const card = useTemplateRef<HTMLElement>('card')
let previouslyFocused: HTMLElement | null = null

const close = () => {
  open.value = false
}

const forget = () => {
  const index = openModals.indexOf(close)
  if (index !== -1) openModals.splice(index, 1)
}

watch(open, async (isOpen) => {
  if (isOpen) {
    previouslyFocused = document.activeElement as HTMLElement | null
    openModals.push(close)

    await nextTick()
    card.value?.focus()
  } else {
    forget()
    previouslyFocused?.focus()
  }
})

onBeforeUnmount(forget)

const onEnter = (el: Element, done: () => void) => {
  gsap.fromTo(
    el,
    { opacity: 0 },
    { opacity: 1, duration: seconds(0.2), onComplete: done },
  )
  gsap.fromTo(
    card.value,
    { scale: 0.9, y: 20 },
    { scale: 1, y: 0, duration: seconds(0.3), ease: 'back.out(1.4)' },
  )
}

const fadeOutOverlay = fadeOut({ duration: 0.2 })

const onLeave = (el: Element, done: () => void) => {
  gsap.set(el, { pointerEvents: 'none' })
  fadeOutOverlay(el, done)
}
</script>

<template>
  <Teleport to="body">
    <Transition :css="false" @enter="onEnter" @leave="onLeave">
      <div
        v-if="open"
        class="fixed inset-0 z-50 grid place-items-center p-2 sm:p-4"
      >
        <div class="absolute inset-0 bg-scrim/72" @click="close" />

        <div
          ref="card"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
          class="relative max-h-[90vh] w-full overflow-y-auto rounded-3xl border border-violet-hi/30 bg-linear-to-b from-panel-top to-panel to-40% p-3 pt-5 text-ink shadow-modal outline-none sm:p-6"
          :class="MODAL_SIZE_CLASSES[size]"
        >
          <Button
            variant="quiet"
            size="icon-sm"
            class="absolute top-3 right-3 sm:top-4 sm:right-4"
            aria-label="Zamknij"
            @click="close"
          >
            <X :size="14" />
          </Button>

          <h2
            class="mb-4 text-center font-display text-2xl leading-8 font-extrabold tracking-widest uppercase sm:text-3xl"
          >
            {{ title }}
          </h2>

          <slot />

          <div v-if="$slots.footer" class="mt-6 flex justify-center gap-2">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

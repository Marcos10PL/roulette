<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { vStagger } from '../directives/animate'
import { useSettingsStore } from '../stores/settings'
import type { ModeId } from '../types'
import { MODES } from '../const'
import ModeIcon from './ModeIcon.vue'
import Modal from './ui/Modal.vue'
import OptionCard from './ui/OptionCard.vue'

const open = defineModel<boolean>({ required: true })

const { modeId } = storeToRefs(useSettingsStore())

const select = (id: ModeId) => {
  modeId.value = id
  open.value = false
}
</script>

<template>
  <Modal v-model="open" title="Tryb gry">
    <div v-stagger class="flex flex-col gap-2">
      <OptionCard
        v-for="mode in MODES"
        :key="mode.id"
        :title="mode.name"
        :description="mode.description"
        :active="mode.id === modeId"
        @click="select(mode.id)"
      >
        <template #icon>
          <ModeIcon :mode-id="mode.id" :size="20" />
        </template>
      </OptionCard>
    </div>
  </Modal>
</template>

<template>
  <component
    :is="iconComponent"
    :class="[
      'app-icon',
      `app-icon--${size}`,
      { 'app-icon--solid': solid }
    ]"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  // Outline icons (default)
  StarIcon,
  CheckIcon,
  ClockIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  GlobeAltIcon,
  LinkIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CodeBracketIcon,
  CommandLineIcon,
  CpuChipIcon,
  FolderIcon,
  Squares2X2Icon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  PaintBrushIcon,
  // Solid versions
  StarIcon as StarIconSolid,
  CheckIcon as CheckIconSolid,
  ClockIcon as ClockIconSolid,
  CalendarIcon as CalendarIconSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  LinkIcon as LinkIconSolid,
  ChevronRightIcon as ChevronRightIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  PhoneIcon as PhoneIconSolid,
  MapPinIcon as MapPinIconSolid,
  CodeBracketIcon as CodeBracketIconSolid,
  CommandLineIcon as CommandLineIconSolid,
  CpuChipIcon as CpuChipIconSolid,
  FolderIcon as FolderIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
  DevicePhoneMobileIcon as DevicePhoneMobileIconSolid,
  ComputerDesktopIcon as ComputerDesktopIconSolid,
  PaintBrushIcon as PaintBrushIconSolid,
} from '@heroicons/vue/24/outline'

interface Props {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  solid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  solid: false
})

const iconMap: Record<string, { outline: Component; solid: Component }> = {
  star: { outline: StarIcon, solid: StarIconSolid },
  check: { outline: CheckIcon, solid: CheckIconSolid },
  clock: { outline: ClockIcon, solid: ClockIconSolid },
  calendar: { outline: CalendarIcon, solid: CalendarIconSolid },
  wrench: { outline: WrenchScrewdriverIcon, solid: WrenchScrewdriverIconSolid },
  globe: { outline: GlobeAltIcon, solid: GlobeAltIconSolid },
  link: { outline: LinkIcon, solid: LinkIconSolid },
  chevron: { outline: ChevronRightIcon, solid: ChevronRightIconSolid },
  envelope: { outline: EnvelopeIcon, solid: EnvelopeIconSolid },
  phone: { outline: PhoneIcon, solid: PhoneIconSolid },
  location: { outline: MapPinIcon, solid: MapPinIconSolid },
  code: { outline: CodeBracketIcon, solid: CodeBracketIconSolid },
  terminal: { outline: CommandLineIcon, solid: CommandLineIconSolid },
  cpu: { outline: CpuChipIcon, solid: CpuChipIconSolid },
  folder: { outline: FolderIcon, solid: FolderIconSolid },
  grid: { outline: Squares2X2Icon, solid: Squares2X2IconSolid },
  mobile: { outline: DevicePhoneMobileIcon, solid: DevicePhoneMobileIconSolid },
  desktop: { outline: ComputerDesktopIcon, solid: ComputerDesktopIconSolid },
  paint: { outline: PaintBrushIcon, solid: PaintBrushIconSolid },
}

const iconComponent = computed(() => {
  const icon = iconMap[props.name]
  if (!icon) {
    console.warn(`Icon "${props.name}" not found`)
    return CheckIcon
  }
  return props.solid ? icon.solid : icon.outline
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.app-icon {
  display: inline-block;
  flex-shrink: 0;
  
  &--xs {
    width: 1rem;
    height: 1rem;
  }
  
  &--sm {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  &--md {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  &--lg {
    width: 2rem;
    height: 2rem;
  }
  
  &--xl {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>
<template>
  <div v-if="show" class="image-preview-overlay" @click="close">
    <div class="image-preview-content" @click.stop>
      <button class="close-btn" @click="close">×</button>
      <img :src="displayImageUrl" alt="Preview" class="preview-image" />
      <div v-if="imageList && imageList.length > 1" class="image-controls">
        <button @click="prevImage" class="control-btn" :disabled="currentIndex === 0">‹</button>
        <span class="image-counter">{{ currentIndex + 1 }} / {{ imageList.length }}</span>
        <button @click="nextImage" class="control-btn" :disabled="currentIndex === imageList.length - 1">›</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  show: boolean
  imageUrl?: string
  imageList?: string[]
  initialIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  imageUrl: '',
  imageList: () => [],
  initialIndex: 0
})

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const currentIndex = ref(props.initialIndex)

watch(() => props.show, (newVal) => {
  if (newVal) {
    currentIndex.value = props.initialIndex
  }
})

watch(() => props.imageList, () => {
  if (props.imageList && props.imageList.length > 0) {
    currentIndex.value = 0
  }
})

const close = () => {
  emit('update:show', false)
}

const prevImage = () => {
  if (currentIndex.value > 0 && props.imageList) {
    currentIndex.value--
  }
}

const nextImage = () => {
  if (props.imageList && currentIndex.value < props.imageList.length - 1) {
    currentIndex.value++
  }
}

const displayImageUrl = computed(() => {
  if (props.imageList && props.imageList.length > 0) {
    return props.imageList[currentIndex.value]
  }
  return props.imageUrl
})
</script>

<style scoped>
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
}

.image-preview-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: default;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10000;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.preview-image {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.image-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.control-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.image-counter {
  color: white;
  font-size: 16px;
  font-weight: 500;
}
</style>


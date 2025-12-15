<template>
  <div class="image-upload">
    <div class="upload-area" @click="triggerFileInput" :class="{ 'drag-over': isDragOver }" 
         @dragover.prevent="isDragOver = true"
         @dragleave.prevent="isDragOver = false"
         @drop.prevent="handleDrop">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        @change="handleFileSelect"
        style="display: none"
      />
      <div class="upload-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <p>Click or drag images here to upload</p>
        <small>Support multiple images, formats: JPG, PNG, GIF</small>
      </div>
    </div>
    <div v-if="images.length > 0" class="image-preview-list">
      <div v-for="(image, index) in images" :key="index" class="image-preview-item">
        <img :src="image" alt="Preview" />
        <button @click="removeImage(index)" class="remove-btn">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const images = ref<string[]>(props.modelValue || [])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    processFiles(Array.from(files))
  }
  // Clear input to allow selecting the same file again
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files) {
    processFiles(Array.from(files))
  }
}

const processFiles = (files: File[]) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  
  imageFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        images.value.push(result)
        emit('update:modelValue', images.value)
      }
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index: number) => {
  images.value.splice(index, 1)
  emit('update:modelValue', images.value)
}

// Watch for external value changes
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    images.value = [...newVal]
  }
}, { immediate: true })
</script>

<style scoped>
.image-upload {
  width: 100%;
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fafafa;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.upload-placeholder svg {
  color: #909399;
  margin-bottom: 12px;
}

.upload-placeholder p {
  margin: 8px 0;
  color: #606266;
  font-size: 14px;
}

.upload-placeholder small {
  color: #909399;
  font-size: 12px;
}

.image-preview-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.image-preview-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
  transition: background-color 0.3s;
}

.remove-btn:hover {
  background-color: rgba(245, 108, 108, 0.9);
}
</style>

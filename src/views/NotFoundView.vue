<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Page Not Found</p>
    <router-link to="/dashboard" class="btn btn-primary">Back to Home</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.not-found h1 {
  font-size: 72px;
  color: #409eff;
  margin-bottom: 20px;
}

.not-found p {
  font-size: 18px;
  color: #909399;
  margin-bottom: 30px;
}
</style>

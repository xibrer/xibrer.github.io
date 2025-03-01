import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 添加 Clustrmaps 访问统计脚本
document.addEventListener('DOMContentLoaded', function() {
  const script = document.createElement('script');
  script.id = "clustrmaps";
  script.src = "//cdn.clustrmaps.com/map_v2.js?cl=ffffff&w=a&t=n&d=tRhAZE9i6ly44fGKTSrwhg1_3fr3blu8XpuPzADTul0";
  script.type = "text/javascript";
  
  // 等待 Vue 应用挂载完成后再添加脚本
  setTimeout(() => {
    const container = document.getElementById('clustrmaps-container');
    if (container) {
      container.appendChild(script);
    }
  }, 1000);
});

createApp(App).mount('#app')
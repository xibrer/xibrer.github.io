import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 添加 Clustrmaps 访问统计脚本
function loadClustrmaps() {
  const container = document.getElementById('clustrmaps-container');
  if (container && !container.hasChildNodes()) {
    const script = document.createElement('script');
    script.id = "clustrmaps";
    script.src = "//clustrmaps.com/map_v2.js?d=tRhAZE9i6ly44fGKTSrwhg1_3fr3blu8XpuPzADTul0&cl=ffffff&w=a";
    script.type = "text/javascript";
    script.async = true;
    
    // 添加加载状态
    container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Loading visitor map...</p>';
    
    script.onload = function() {
      console.log('Clustrmaps loaded successfully');
    };
    
    script.onerror = function() {
      container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Unable to load visitor map</p>';
    };
    
    container.appendChild(script);
  }
}

// 使用多种方式确保脚本能够加载
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(loadClustrmaps, 500);
});

// 如果DOMContentLoaded已经触发，立即尝试加载
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadClustrmaps, 500);
  });
} else {
  setTimeout(loadClustrmaps, 500);
}

createApp(App).mount('#app')
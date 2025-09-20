import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 添加 Clustrmaps 访问统计脚本
function loadClustrmaps() {
  const container = document.getElementById('clustrmaps-container');
  if (container && !container.querySelector('#clustrmaps')) {
    // 清空容器内容
    container.innerHTML = '';
    
    const script = document.createElement('script');
    script.id = "clustrmaps";
    script.src = "//clustrmaps.com/map_v2.js?d=tRhAZE9i6ly44fGKTSrwhg1_3fr3blu8XpuPzADTul0&cl=ffffff&w=a";
    script.type = "text/javascript";
    script.async = true;
    
    script.onload = function() {
      console.log('Clustrmaps loaded successfully');
      // 确保地图容器样式正确
      const mapElement = container.querySelector('img') || container.querySelector('div');
      if (mapElement) {
        mapElement.style.maxWidth = '100%';
        mapElement.style.height = 'auto';
      }
    };
    
    script.onerror = function() {
      container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px; font-style: italic;">Visitor map temporarily unavailable</p>';
    };
    
    container.appendChild(script);
  }
}

// 使用多种方式确保脚本能够加载
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadClustrmaps, 1000);
  });
} else {
  setTimeout(loadClustrmaps, 1000);
}

createApp(App).mount('#app')
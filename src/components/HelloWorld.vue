<script setup>
defineProps({
  msg: String,
})
</script>

<template>
  <div class="personal-homepage">
    <!-- 个人信息部分 -->
    <section class="profile-section">
      <div class="profile-container">
        <img class="profile-image" src="../assets/me.jpg" alt="Xingwei Wang" />
        <div class="profile-info">
          <h1>{{ msg }}</h1>
          <p class="subtitle">Math Department, Beijing University of Technology</p>
          <p><strong>Location:</strong> Beijing, China</p>
          <p><strong>Email:</strong> xw.wang@emails.bjut.edu.cn</p>
          <div class="social-links">
            <a href="https://github.com/xibrer" target="_blank" class="social-link">GitHub</a>
            <a href="https://scholar.google.com/citations?user=NF-6qWUAAAAJ&hl=zh-CN" target="_blank" class="social-link">Google Scholar</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我部分 -->
    <section class="about-section">
      <h2>About Me</h2>
      <p>
        I am a graduate student at Beijing University of Technology. Currently, I am mainly working on developing AI methods for IoT. 
      </p>
    </section>

    <!-- 经历部分 -->
    <section class="experience-section">
      <h2>Experience</h2>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-date">2023/09 - Present</div>
          <div class="timeline-content">
            <h3>Graduate Student</h3>
            <p>Beijing University of Technology</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-date">2023/06 - 2023/09</div>
          <div class="timeline-content">
            <h3>Research Intern</h3>
            <p>Soochow University, led by <a href="https://web.suda.edu.cn/wanglei/">Prof. Lei Wang</a></p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-date">2021/09 - 2023/06</div>
          <div class="timeline-content">
            <h3>Joint Training</h3>
            <p>Shenzhen Institute of Advanced Technology, led by <a href="http://hpcc.siat.ac.cn/homepage/zhangy.html">Prof. Yong Zhang</a></p>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目部分 -->
    <section class="projects-section">
      <h2>Projects</h2>
      <div class="project-card">
        <h3>TorchSense</h3>
        <p>
          Torchsense is a library for sensor data processing with PyTorch.
          It provides I/O, signal and data processing functions,
          datasets, model implementations and application components.
        </p>
      </div>
    </section>

    <!-- 发表论文部分 -->
    <section class="publications-section">
      <h2>Recent Publications</h2>
      <div class="publication-card">
        <img src="../assets/large.png" alt="LargeCall System" class="publication-image" />
        <div class="publication-content">
          <h3>LargeCall: Dual-Modality Speech Enhancement for Noise-Robust Phone Calls Using Smartphone's Built-in Accelerometer</h3>
          <p class="authors">Lei Wang, <strong>Xingwei Wang</strong>, Yu Zhang, Xiaolei Ma, Yong Zhang, Zhijun Li, Tao Gu</p>
          <p class="venue">INFOCOM, 2026</p>
          <div class="publication-links">
            <a href="./LargeCall.pdf" target="_blank">Paper</a>
            <span class="publication-highlight">Dual-modality speech enhancement with audio and accelerometer</span>
          </div>
        </div>
      </div>

      <div class="publication-card">
        <img src="../assets/acccall.png" alt="AccCall System" class="publication-image" />
        <div class="publication-content">
          <h3>AccCall: Enhancing Real-Time Phone Call Quality with Smartphone's Built-in Accelerometer</h3>
          <p class="authors">Lei Wang,<strong>Xingwei Wang</strong>, Yu Zhang, Xiaolei Ma, Yong Zhang, Zhijun Li, Tao Gu</p>
          <p class="venue">Ubicomp, 2025</p>
          <div class="publication-links">
            <a href="./AccCall.pdf" target="_blank">Paper</a>
            <span class="publication-highlight">Using smartphone's built-in accelerometer to enhance audio</span>
          </div>
        </div>
      </div>
      
      <div class="publication-card">
        <img src="../assets/bp.png" alt="Blood Pressure Measurement" class="publication-image" />
        <div class="publication-content">
          <h3>Accurate Blood Pressure Measurement Using Smartphone's Built-in Accelerometer</h3>
          <p class="authors">Lei Wang, <strong>Xingwei Wang</strong>, Yu Zhang, Xiaolei Ma, Yong Zhang, Zhijun Li, Tao Gu</p>
          <p class="venue">Ubicomp, 2024</p>
          <div class="publication-links">
            <a href="./bp.pdf" target="_blank">Paper</a>
            <span class="publication-highlight">Measuring Blood Pressure with single SCG</span>
          </div>
        </div>
      </div>

      <div class="publication-card">
        <img src="../assets/ecg.png" alt="ECG Measurement" class="publication-image" />
        <div class="publication-content">
          <h3>Knowing Your Heart Condition Anytime: User-Independent ECG Measurement Using Commercial Mobile Phones</h3>
          <p class="authors">Lei Wang, <strong>Xingwei Wang</strong>, Dalin Zhang, Xiaolei Ma, Yong Zhang, Haipeng Dai, Chenren Xu, Zhijun Li, Tao Gu</p>
          <p class="venue">Ubicomp, 2023</p>
          <div class="publication-links">
            <a href="./ecg.pdf" target="_blank">Paper</a>
            <span class="publication-highlight">Measuring ECG with smartphone's built-in IMU</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 荣誉和奖项部分 -->
    <section class="awards-section">
      <h2>Honors and Awards</h2>
      <ul class="awards-list">
        <li>2023/12: Graduate</li>
        <li>2023/06: The highest-ranking graduation project in the entire school</li>
      </ul>
    </section>

    <!-- 访问统计 -->
    <section class="visitor-stats">
      <h2>Visitor Statistics</h2>
      <div id="clustrmaps-container"></div>
    </section>
  </div>
</template>

<style scoped>
.personal-homepage {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: 'Noto Sans', 'Noto Sans SC', sans-serif;
  color: #333;
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
}

section {
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08);
}

.profile-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.profile-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.profile-section h1,
.profile-section p,
.profile-section .subtitle {
  color: white;
  position: relative;
  z-index: 1;
}

.profile-section .subtitle {
  color: rgba(255, 255, 255, 0.9);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-section h1 {
  background: none;
  -webkit-text-fill-color: white;
  color: white;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1.2rem;
  color: #2c3e50;
  border-bottom: 3px solid;
  border-image: linear-gradient(90deg, #667eea 0%, #764ba2 100%) 1;
  padding-bottom: 0.5rem;
  font-weight: 600;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

h3 {
  font-size: 1.4rem;
  margin-bottom: 0.3rem;
  color: #2c3e50;
  font-weight: 600;
}

a {
  color: #667eea;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

a:hover {
  color: #764ba2;
  text-decoration: underline;
}

.profile-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

.profile-image {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.profile-info {
  flex: 1;
}

.subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 0.7rem;
  font-weight: 500;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 0.7rem;
}

.social-link {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-decoration: none;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 1rem;
  transition: transform 0.3s ease;
}

.timeline-item:hover {
  transform: translateX(5px);
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -2.75rem;
  top: 0.5rem;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  z-index: 1;
}

.timeline-date {
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.3rem;
  font-size: 0.95rem;
}

.project-card {
  display: flex;
  gap: 1.2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  margin-bottom: 1.2rem;
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.publication-card {
  display: flex;
  gap: 1.2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  margin-bottom: 1.2rem;
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

.publication-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.publication-image {
  width: 140px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  max-width: 100%;
}

.publication-card:hover .publication-image {
  transform: scale(1.05);
}

.publication-content {
  flex: 1;
}

.authors {
  margin: 0.3rem 0;
  color: #555;
  line-height: 1.6;
}

.venue {
  font-style: italic;
  color: #667eea;
  margin-bottom: 0.3rem;
  font-weight: 500;
}

.publication-links {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 0.5rem 0;
  flex-wrap: wrap;
}

.publication-links a {
  padding: 0.3rem 0.8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.publication-links a:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  text-decoration: none;
}

.publication-highlight {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-left: 4px solid #667eea;
  font-weight: 500;
  font-size: 0.85rem;
  border-radius: 6px;
  color: #555;
}

.awards-list {
  padding-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  list-style: none;
}

.awards-list li {
  margin-bottom: 0.8rem;
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.6;
}

.awards-list li::before {
  content: '🏆';
  position: absolute;
  left: 0;
  font-size: 1.2rem;
}

.view-all {
  font-size: 1rem;
  margin-left: 0.5rem;
}

#clustrmaps-container {
  width: 100%;
  min-height: 220px;
  margin-top: 0.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  overflow: hidden;
  border-radius: 8px;
}

#clustrmaps-container img {
  max-width: 100%;
  height: auto;
  border: none !important;
  box-shadow: none !important;
}

#clustrmaps-container > div {
  width: 100%;
  display: flex;
  justify-content: center;
}

p {
  margin: 0.5rem 0;
  line-height: 1.7;
}

.publication-content p, .project-card p {
  line-height: 1.6;
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
    text-align: center;
  }
  
  .publication-card {
    flex-direction: column;
  }
  
  .publication-image {
    width: 100%;
    height: 140px;
  }
  
  .personal-homepage {
    padding: 0.75rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  section {
    padding: 1rem;
    margin-bottom: 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  section:hover {
    transform: none;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  #clustrmaps-container {
    min-height: 180px;
    margin-top: 0.5rem;
  }
  
  #clustrmaps-container img {
    max-width: 100%;
    height: auto;
  }
  
  .social-links {
    flex-direction: row;
    gap: 0.8rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .timeline {
    padding-left: 1.5rem;
  }
  
  .timeline-item::before {
    left: -2rem;
  }
  
  .profile-image {
    width: 140px;
    height: 140px;
  }
  
  .project-card,
  .publication-card {
    padding: 1rem;
    gap: 1rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  .publication-image {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 140px;
  }
  
  .profile-container {
    width: 100%;
    box-sizing: border-box;
  }
  
  .timeline-item {
    padding-left: 0.5rem;
  }
  
  .publication-content {
    min-width: 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
  
  h3 {
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
}
</style>
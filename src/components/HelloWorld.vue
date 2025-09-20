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
        I have developed a smartphone-based blood pressure and electrocardiogram (ECG) solution.
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
        <img src="../assets/ecg.png" alt="ECG Measurement" class="publication-image" />
        <div class="publication-content">
          <h3>Knowing Your Heart Condition Anytime: User-Independent ECG Measurement Using Commercial Mobile Phones</h3>
          <p class="authors">Lei Wang, <strong>Xingwei Wang</strong>, Dalin Zhang, Xiaolei Ma, Yong Zhang, Haipeng Dai, Chenren Xu, Zhijun Li, Tao Gu</p>
          <p class="venue">Ubicomp, 2023</p>
          <div class="publication-links">
            <a href="../assets/ecg.pdf" target="_blank">Paper</a>
            <a href="https://github.com/xibrer" target="_blank">Code</a>
          </div>
          <div class="publication-highlight">Measuring ECG with smartphone's built-in IMU</div>
        </div>
      </div>
      
      <div class="publication-card">
        <img src="../assets/bp.png" alt="Blood Pressure Measurement" class="publication-image" />
        <div class="publication-content">
          <h3>Accurate Blood Pressure Measurement Using Smartphone's Built-in Accelerometer</h3>
          <p class="authors">Lei Wang, <strong>Xingwei Wang</strong>, Yu Zhang, Xiaolei Ma, Yong Zhang, Zhijun Li, Tao Gu</p>
          <p class="venue">Ubicomp, 2024</p>
          <div class="publication-links">
            <a href="../assets/bp.pdf" target="_blank">Paper</a>
          </div>
          <div class="publication-highlight">Measuring Blood Pressure with single SCG</div>
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
}

section {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  border-bottom: 2px solid #eaecef;
  padding-bottom: 0.5rem;
}

h3 {
  font-size: 1.4rem;
  margin-bottom: 0.3rem;
  color: #2c3e50;
}

a {
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  color: #2980b9;
  text-decoration: underline;
}

.profile-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-image {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-info {
  flex: 1;
}

.subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 0.7rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 0.7rem;
  padding: 0.4rem 0.8rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.social-link:hover {
  background-color: #e9ecef;
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
  width: 2px;
  background-color: #e9ecef;
}

.timeline-item {
  position: relative;
  margin-bottom: 1.2rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -2.5rem;
  top: 0.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: #3498db;
}

.timeline-date {
  font-weight: 500;
  color: #7f8c8d;
  margin-bottom: 0.3rem;
}

.project-card {
  display: flex;
  gap: 1.2rem;
  padding: 1.2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1.2rem;
}

.publication-card {
  display: flex;
  gap: 1.2rem;
  padding: 1.2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1.2rem;
}

.publication-image {
  width: 140px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
}

.publication-content {
  flex: 1;
}

.authors {
  margin: 0.3rem 0;
  color: #555;
}

.venue {
  font-style: italic;
  color: #7f8c8d;
  margin-bottom: 0.3rem;
}

.publication-links {
  display: flex;
  gap: 0.8rem;
  margin: 0.3rem 0;
}

.publication-links a {
  padding: 0.2rem 0.6rem;
  background-color: #e9ecef;
  border-radius: 4px;
  font-size: 0.9rem;
}

.publication-highlight {
  display: inline-block;
  margin-top: 0.3rem;
  padding: 0.2rem 0.6rem;
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
  font-weight: 500;
}

.awards-list {
  padding-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.awards-list li {
  margin-bottom: 0.5rem;
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
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

p {
  margin: 0.5rem 0;
}

.publication-content p, .project-card p {
  line-height: 1.4;
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
    padding: 1rem;
  }
  
  section {
    padding: 1rem;
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
  
  .social-links {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  
  .timeline {
    padding-left: 1.5rem;
  }
  
  .timeline-item::before {
    left: -2rem;
  }
}
</style>
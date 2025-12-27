<template>
  <div id="app">
    <header>
      <nav>
        <div class="nav-container">
          <h1>Vue 前端监控 Demo</h1>
          <div class="nav-links">
            <router-link to="/">首页</router-link>
            <router-link to="/demo">演示</router-link>
            <router-link to="/about">关于</router-link>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>OpenTelemetry 浏览器端监控演示 | LGTMP Stack</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  font-size: 1.5rem;
  color: #667eea;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s;
}

.nav-links a:hover {
  background: #667eea;
  color: white;
}

.nav-links a.router-link-active {
  background: #667eea;
  color: white;
}

main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 2rem;
}

footer {
  background: rgba(0, 0, 0, 0.1);
  color: white;
  text-align: center;
  padding: 1.5rem 0;
  margin-top: auto;
}
</style>

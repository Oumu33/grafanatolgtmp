import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Demo.css';

export default function Demo() {
  useEffect(() => {
    console.log('[React] Demo 页面已挂载，OpenTelemetry 已自动记录页面加载性能');
  }, []);

  return (
    <div className="demo">
      <div className="card">
        <h2>路由跳转性能监控演示</h2>
        <p>OpenTelemetry 自动监控页面路由切换的性能指标</p>

        <div className="navigation-demo">
          <p>尝试在不同页面之间切换，查看路由跳转的监控数据：</p>
          <div className="nav-buttons">
            <Link to="/" className="demo-btn">返回首页</Link>
            <Link to="/about" className="demo-btn">前往关于页</Link>
          </div>
        </div>

        <div className="metrics-info">
          <h3>监控指标说明</h3>
          <table>
            <thead>
              <tr>
                <th>指标</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>document-load</code></td>
                <td>页面加载性能（FCP、LCP、TTI）</td>
              </tr>
              <tr>
                <td><code>route-change</code></td>
                <td>SPA 路由跳转耗时</td>
              </tr>
              <tr>
                <td><code>fetch</code></td>
                <td>API 请求耗时和状态码</td>
              </tr>
              <tr>
                <td><code>user-interaction</code></td>
                <td>用户点击、表单提交等交互事件</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

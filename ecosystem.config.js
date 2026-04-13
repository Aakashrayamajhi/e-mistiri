module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: './server/api-gateway/src/index.js',
      cwd: './',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        PORT: 2002,
        NODE_ENV: 'development',
        LOG_LEVEL: 'debug'
      },
      env_production: {
        PORT: 2002,
        NODE_ENV: 'production',
        LOG_LEVEL: 'warn'
      },
      error_file: './logs/api-gateway-error.log',
      out_file: './logs/api-gateway-out.log',
      log_file: './logs/api-gateway-combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: false,
      watch: ['./server/api-gateway/src'],
      watch_delay: 1000,
      ignore_watch: ['./logs', './node_modules'],
      max_memory_restart: '500M',
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 3000,
      wait_ready: false
    },
    {
      name: 'auth-service',
      script: './server/services/auth-services/src/index.js',
      cwd: './',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        PORT: 4002,
        NODE_ENV: 'development'
      },
      env_production: {
        PORT: 4002,
        NODE_ENV: 'production',
        LOG_LEVEL: 'warn'
      },
      error_file: './logs/auth-service-error.log',
      out_file: './logs/auth-service-out.log',
      log_file: './logs/auth-service-combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: false,
      watch: ['./server/services/auth-services/src'],
      watch_delay: 1000,
      ignore_watch: ['./logs', './node_modules'],
      max_memory_restart: '500M',
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 3000
    },
    {
      name: 'user-service',
      script: './server/services/user-services/src/index.js',
      cwd: './',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        PORT: 3002,
        NODE_ENV: 'development'
      },
      env_production: {
        PORT: 3002,
        NODE_ENV: 'production',
        LOG_LEVEL: 'warn'
      },
      error_file: './logs/user-service-error.log',
      out_file: './logs/user-service-out.log',
      log_file: './logs/user-service-combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: false,
      watch: ['./server/services/user-services/src'],
      watch_delay: 1000,
      ignore_watch: ['./logs', './node_modules'],
      max_memory_restart: '500M',
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 3000
    }
  ],

  deploy: {
    production: {
      user: 'node',
      host: 'your-production-server.com',
      ref: 'origin/main',
      repo: 'your-repo-url.git',
      path: '/var/www/e-mistiri',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
}

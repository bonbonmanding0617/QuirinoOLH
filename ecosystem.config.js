module.exports = {
  apps: [
    {
      name: 'qolh-server',
      script: './server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false, // Set to true if you want file watching
      ignore_watch: ['node_modules', 'uploads', 'logs'],
      
      // Auto restart on crash
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      
      // Error & output logs
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss',
      
      // Environment variables
      env: {
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development'
      }
    }
  ]
};

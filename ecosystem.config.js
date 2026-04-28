module.exports = {
  apps: [
    {
      name: 'laredoutesarl',
      script: '.next/standalone/server.js',
      cwd: '/var/www/laredoutesarl',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: '0.0.0.0',
        DATABASE_URL: 'file:/var/www/laredoutesarl/db/custom.db',
        ADMIN_PASSWORD: 'Antoine@228',
      },
      // MUST use fork mode - SQLite does NOT support cluster mode
      exec_mode: 'fork',
      instances: 1,
      max_memory_restart: '512M',
      // Auto-restart on crash
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      // Logging
      error_file: '/var/www/laredoutesarl/logs/error.log',
      out_file: '/var/www/laredoutesarl/logs/out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
}

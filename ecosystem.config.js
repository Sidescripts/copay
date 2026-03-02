
module.exports = {
    apps: [{
      name: 'vitron-app',
      script: './server/app.js',  // Your entry file
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.git'],
      max_memory_restart: '1G',
      autorestart: true,
      out_file: './logs/out.log',
      error_file: './logs/err.log',
      merge_logs: true, 
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000   
      }
    }]
};

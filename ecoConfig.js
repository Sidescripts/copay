
module.exports = {
    apps: [{
      name: 'vitron-app',
      script: './server/app.js',  // Your entry file
      instances: 1,
      exec_mode: 'cluster',
      watch: true,
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G',
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    }]
};


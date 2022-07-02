module.exports = {
  apps: [{
    name: 'auth_test',
    script: './dist/app.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    exec_mode: 'cluster',
    instances: 2,
    autorestart: true,
    log_file: 'logs/test_auth.log',
    error_file: 'logs/test_error.log',
    merge_logs: true,
    time: true,
    kill_timeout: 2000,
    listen_timeout: 2000,
    max_memory_restart: '1G',
    wait_ready: true,
    watch: ["dist", "config"],
    watch_delay: 3000,
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};

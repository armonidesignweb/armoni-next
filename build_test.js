const { execSync } = require('child_process');
try {
  execSync('npx next build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed');
}

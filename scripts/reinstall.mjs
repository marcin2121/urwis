import { execSync } from 'child_process';

console.log('Removing old lockfile...');
try {
  execSync('rm -f pnpm-lock.yaml', { stdio: 'inherit', cwd: '/vercel/share/v0-project' });
} catch (e) {
  console.log('No lockfile to remove');
}

console.log('Running pnpm install...');
execSync('pnpm install --no-frozen-lockfile', { stdio: 'inherit', cwd: '/vercel/share/v0-project' });

console.log('Done! Lockfile regenerated.');

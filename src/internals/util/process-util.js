import childProcess from 'child_process';

export function execSync(cmd) {
  childProcess.execSync(cmd, { env: process.env, stdio: 'inherit' });
}

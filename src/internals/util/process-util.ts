import childProcess from 'child_process';

export function execSync(cmd: string): Buffer {
  return childProcess.execSync(cmd, { env: process.env, stdio: 'inherit' });
}

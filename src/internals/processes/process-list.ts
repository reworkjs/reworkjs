import type { ChildProcess } from 'child_process';
import childProcess from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const processes = {
  buildClient: {
    path: join(__dirname, 'build-client.js'),
    name: 'ClientBuilder',
  },
  startClient: {
    path: join(__dirname, '..', '..', 'framework', 'server', 'launch-http-server.js'),
    name: 'Client',
  },
  startClientWatch: {
    path: join(__dirname, 'start-client-watch.js'),
    name: 'ClientDev',
  },
  buildServer: {
    path: join(__dirname, 'build-server.js'),
    name: 'ServerBuilder',
  },
};

export function listLaunchableProcesses(): string[] {
  return Object.keys(processes);
}

type TProcessOption = {
  env: string,
  argv: string[],
};

export function launchProcess(id: keyof typeof processes, options: TProcessOption): ChildProcess {
  return childProcess.fork(processes[id].path, options.argv, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    env: Object.assign(Object.create(process.env), {
      PROCESS_NAME: processes[id].name,
      NODE_ENV: options.env,
    }),
  });
}

export async function runProcess(id: keyof typeof processes, options: TProcessOption): Promise<void> {
  const child = launchProcess(id, options);

  await new Promise<void>(resolve => {
    if (child.exitCode) {
      resolve();
    }

    child.once('exit', () => {
      resolve();
    });
  });

  if (child.exitCode !== 0) {
    throw new Error(`process ${id} exited with exit code ${child.exitCode}.`);
  }
}

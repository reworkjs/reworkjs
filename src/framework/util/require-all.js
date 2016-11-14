import { getDefault } from '../../shared/util/ModuleUtil';

export default function requireAll(...contexts): Array {
  const modules = [];

  for (const context of contexts) {
    for (const key of context.keys()) {
      const provider = getDefault(context(key));

      modules.push(provider);
    }
  }

  return modules;
}

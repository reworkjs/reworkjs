import type { ChildProcess } from 'child_process';
import type { Widgets } from 'blessed';
import Blessed from 'blessed';
import { append } from './CliSplitViewBalancedTree.js';

type NamedScreen = { outer: Widgets.BlessedElement, inner: Widgets.BlessedElement };

export default class CliSplitView {

  private readonly screen: Widgets.Screen;
  private readonly rootNode: Widgets.BoxElement;

  subScreens: { [key: string]: NamedScreen } = {};

  private refreshTrottle: NodeJS.Timeout | undefined;

  constructor(name: string) {
    this.screen = Blessed.screen({
      smartCSR: true,
      title: name,
      dockBorders: true,
    });

    this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

    this.rootNode = Blessed.box({
      height: '100%',
      width: '100%',
    });

    this.screen.append(this.rootNode);

    this.refresh();
  }

  addScreen(name: string, process: ChildProcess) {
    if (this.subScreens[name]) {
      this._redirect(process, this.subScreens[name]);

      return;
    }

    const subScreen = buildNamedBox(name);

    append(this.rootNode, subScreen.outer);
    this.refresh();

    this._redirect(process, subScreen);
    this.subScreens[name] = subScreen;
  }

  refresh() {
    if (this.refreshTrottle) {
      clearTimeout(this.refreshTrottle);
    }

    this.refreshTrottle = setTimeout(() => this.screen.render(), 200);
  }

  private _redirect(child: ChildProcess, subScreen: NamedScreen) {

    child.stdout?.on('data', data => {
      // remove final \r\n added by writeln.
      const msg = data.toString().replace(/(\r\n|\n|\r)$/, '');

      subScreen.inner.pushLine(msg);
      this.refresh();
    });

    child.stderr?.on('data', data => {
      // remove final \r\n added by writeln.
      const msg = data.toString().replace(/(\r\n|\n|\r)$/, '');

      subScreen.inner.pushLine(`{red-bg}${msg}\n{/}`);
      this.refresh();
    });

    child.on('close', code => {
      if (code == null) {
        subScreen.inner.pushLine('\n{blue-bg}\nProcess terminated\n{/}\n');
      } else {
        subScreen.inner.pushLine(`\n{${code === 0 ? 'green' : 'red'}-bg}\nProcess completed ${code === 0 ? 'Successfully' : `with error code ${code}`}\n{/}\n`);
      }

      this.refresh();
    });
  }
}

function buildNamedBox(name: string) {

  const outerBox = Blessed.box();

  const titleBox = Blessed.text({
    content: name,
    width: '100%',
    top: 0,
    left: 1,
    style: {
      fg: 'white',
    },
  });

  const innerBox = Blessed.box({
    tags: true,
    border: {
      type: 'line',
    },
    scrollable: true,
    mouse: true,
    keys: true,
    scrollbar: {
      ch: ' ',
      inverse: true,
    },
    top: 1,
    width: '100%',
    style: {
      border: {
        fg: '#f0f0f0',
      },
    },
  });

  outerBox.append(titleBox);
  outerBox.append(innerBox);

  return { outer: outerBox, inner: innerBox };
}

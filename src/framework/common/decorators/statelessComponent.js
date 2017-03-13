import { attemptChangeName } from '../../util/util';
import { classDecorator } from './decorator';

const statelessComponent = classDecorator(args => {
  const Target = args.target;

  const render = Target.prototype.render;
  if (!render) {
    throw new TypeError(`@statelessComponent: class ${Target.name} does not have a .render method`);
  }

  if (process.env.NODE_ENV === 'development') { // eslint-disable-line
    const forbiddenMethods = [
      'componentWillMount',
      'componentDidMount',
      'componentWillUnmount',

      'componentWillReceiveProps',

      'shouldComponentUpdate',
      'componentWillUpdate',
      'componentDidUpdate',
    ];

    Object.defineProperty(Target.prototype, 'state', {
      get() {
        throw new TypeError('.state is unavailable on stateless components.');
      },
    });

    for (const forbiddenMethod of forbiddenMethods) {
      if (Target.prototype[forbiddenMethod]) {
        throw new TypeError(
          `\n\nlifecycle methods (like ${forbiddenMethod}) are unavailable on stateless components.
If you do not have a lifecycle method on your component but are using decorators that wrap your component in HOCs (such as @container), make sure @statelessComponent is placed after these decorators.\n`
        );
      }
    }
  }

  const _this = new Target();

  function StatelessComponentBridge(props, context, updater) {
    _this.props = props;
    _this.context = context;
    _this.updater = updater;

    return render.call(_this);
  }

  attemptChangeName(StatelessComponentBridge, Target.name);

  return StatelessComponentBridge;
});

export default statelessComponent;

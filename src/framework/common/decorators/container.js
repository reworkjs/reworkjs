import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

export type ContainerDecoratorConfig = {
  state: ?{ [key: string]: Function },
  dispatchers: ?{ [key: string]: Function },
  actions: ?{ [key: string]: Function },
  intl: boolean,
};

function checkInvalidKeys(conf) {
  const authorizedKeys = ['state', 'dispatchers', 'actions', 'intl'];

  const invalidKeys = Object.keys(conf).filter(key => !authorizedKeys.includes(key));

  if (invalidKeys.length > 0) {
    throw new TypeError(`@container(): configuration contains invalid entries "${invalidKeys.join('", "')}". Only keys allowed are "${authorizedKeys.join('", "')}"`)
  }
}

function objNoop() {
  return {};
}

/**
 * Configure a container.
 *
 * @param {!Object} config.state An mapping of prop names => redux state selector.
 * @param {!Object} config.dispatchers An mapping of prop names => function that will receive dispatch and arguments.
 * @param {!Object} config.actions An mapping of prop names => redux action.
 * @param {!boolean} config.intl Whether to inject react-intl under the prop name "intl".
 *
 * @example
 * \@container({
 *   state: {
 *     loggedIn: function() { // this must be a function that returns a selector.
 *       return function selectLoggedInState(state) {
 *         return state.get('loggedIn');
 *       }
 *     },
 *   },
 *   intl: true, // add intl to props.
 * })
 * class SomeContainer {}
 *
 * @example
 * \@container({
 *   state: {
 *     loggedIn: SecurityProvider.loggedIn,
 *   },
 *   actions: {
 *     onLogin: function(username, password) {
 *       return { type: 'LOGIN', payload: { username, password } }; // return an action!
 *     },
 *   },
 * })
 * class SomeContainer {}
 *
 * @example
 * \@container({
 *   dispatchers: {
 *     onLogin: function(dispatch, username, password) {
 *       return dispatch({ type: 'LOGIN', payload: { username, password } }); // dispatch an action!
 *     },
 *   },
 * })
 * class SomeContainer {}
 */
export default function container(config: ContainerDecoratorConfig = {}) {

  checkInvalidKeys(config);

  let mapStateToProps;
  if (!config.state) {
    mapStateToProps = objNoop;
  } else {
    const state = config.state;
    const keys = Object.keys(state);
    const values = keys.map(key => {
      const val = state[key];
      if (typeof val !== 'function') {
        throw new TypeError(`@container({ state[${JSON.stringify(key)}] }) is not a function.`);
      }

      return val();
    });

    mapStateToProps = createSelector(
      ...values,
      (...args) => {
        const merge = {};

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          merge[key] = args[i];
        }

        return merge;
      },
    );
  }

  function mapDispatchToProps(dispatch) {
    const result = {};

    if (config.dispatchers) {
      for (const key of Object.keys(config.dispatchers)) {
        const dispatcher = config.dispatchers[key];

        if (typeof dispatcher !== 'function') {
          throw new TypeError(`@container({ dispatchers[${JSON.stringify(key)}] }) is not a function.`);
        }

        result[key] = function callDispatcher(...args) {
          dispatcher(dispatch, ...args);
        };
      }
    }

    if (config.actions) {
      for (const key of Object.keys(config.actions)) {
        const action = config.actions[key];

        if (typeof action !== 'function') {
          throw new TypeError(`@container({ actions[${JSON.stringify(key)}] }) is not a function.`);
        }

        result[key] = function callDispatcher(...args) {
          dispatch(action(...args));
        };
      }
    }

    return result;
  }

  const connector = connect(mapStateToProps, mapDispatchToProps);

  return function setupContainer(containerClass) {
    if (config.intl === true) {
      containerClass = injectIntl(containerClass);
    }

    return connector(containerClass);
  };
}

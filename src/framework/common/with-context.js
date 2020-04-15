// @flow

import * as React from 'react';
import { getComponentName } from '../util/ReactUtil';

type WithContextOption = {
  [string]: React.Context<*>,
};

export default function withContext<NewProps: WithContextOption>(contextMap: NewProps) {

  return function decorate<Props>(
    WrappedComponent: React.ComponentType<Props>,
  ): React.ComponentType<$Diff<Props, NewProps>> {

    function WithContext(props: *) {

      const contextProps = {};

      // $FlowFixMe - https://github.com/facebook/flow/issues/2221
      for (const [key, context]: [string, React.Context<*>] of Object.entries(contextMap)) {

        // eslint-disable-next-line react-hooks/rules-of-hooks
        contextProps[key] = React.useContext(context);
      }

      return <WrappedComponent {...props} {...contextProps} />;
    }

    if (process.env.NODE_ENV !== 'production') {
      WithContext.displayName = `withContext(${getComponentName(WrappedComponent)})`;
    }

    return WithContext;
  };
}

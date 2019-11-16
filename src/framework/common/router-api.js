// @flow

import { type Node } from 'react';
import useReactRouter from 'use-react-router';

type HttpStatusProps = {
  code: number,
  children: Node,
};

export function HttpStatus(props: HttpStatusProps) {
  useHttpStatus(props.code);

  return props.children == null ? null : props.children;
}

export function useHttpStatus(status: number): void {
  const reactRouterContext = useReactRouter();

  const context = reactRouterContext.staticContext;
  if (context) {
    context.status = status;
  }
}

export { useReactRouter };

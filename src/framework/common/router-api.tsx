import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';

type HttpStatusProps = {
  code: number,
  children?: ReactNode,
};

export function HttpStatus(props: HttpStatusProps) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.statusCode = props.code;
        }

        return props.children == null ? null : props.children;
      }}
    />
  );
}

import type { ReactNode } from 'react';
import BaseHelmet from './BaseHelmet.js';
import LanguageComponent from './LanguageComponent.js';

type Props = {
  children: ReactNode,
};

function ReworkRootComponent(props: Props) {

  return (
    <>
      <BaseHelmet />
      <LanguageComponent>
        {props.children}
      </LanguageComponent>
    </>
  );
}

export default ReworkRootComponent;

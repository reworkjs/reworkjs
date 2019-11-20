// @flow

import * as React from 'react';
import LanguageComponent from './LanguageComponent';
import BaseHelmet from './BaseHelmet';

type Props = {
  children: any,
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

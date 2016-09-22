import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { IntlProvider } from 'react-intl';
import { selectLocale } from './selectors';
import reducer from './reducer';

/*
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */
function LanguageProvider(props) {
  return (
    <IntlProvider locale={props.locale} messages={props.messages[props.locale]}>
      {React.Children.only(props.children)}
    </IntlProvider>
  );
}

LanguageProvider.propTypes = {
  locale: React.PropTypes.string,
  messages: React.PropTypes.object,
  children: React.PropTypes.element.isRequired,
};

const mapStateToProps = createSelector(
  selectLocale(),
  locale => ({ locale }),
);

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageProvider);
export { reducer };

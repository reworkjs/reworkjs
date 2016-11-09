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
class LanguageProvider extends React.Component {
  static propTypes = {
    locale: React.PropTypes.string,
    messages: React.PropTypes.object,
    children: React.PropTypes.element.isRequired,
  };

  constructor() {
    super();

    // Hot reloadable translation json files
    if (module.hot) {
      // modules.hot.accept does not accept dynamic dependencies,
      // have to be constants at compile-time
      module.hot.accept('../../../common/i18n', () => this.forceUpdate());
    }
  }

  render() {
    return (
      <IntlProvider locale={this.props.locale} messages={this.props.messages[this.props.locale]}>
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}

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

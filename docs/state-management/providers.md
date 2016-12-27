# Providers

Providers are an abstraction specific to this framework with the goal to reduce the boilerplate needed to 
manage the global store.

If using this abstraction doesn't work for you, you can however still access the store without it.
See [vanilla-redux](./vanilla-redux.md).

`@providers` are best used with `@containers`, although they are fully compatible with other property mapping systems.

## Concepts

As they are merely an abstraction over redux, providers do not introduce any new concept. Everything you know about
reducers, sagas, selectors, actions, and stores still apply.

Just in case though, here is a quick reminder:

- Store: The store contains the state of the application. It is the same as a redux store.
- Reducers: Functions able to read and write to a fragment of the store at will. They are called whenever 
  actions are dispatched.
- Sagas: Generator Functions called whenever actions are dispatched. They exist to handle store-related asynchronous operations. 
  (see the redux-saga documentation for more details).
- Selectors: Functions that will retrieve a part of the store.
- Actions: Commands dispatched to reducers to tell them what to do.

Providers are designed to only handle a fragment of the store at a time in order to promote separation of concerns.
 
## Usage

Creating a new Provider is straightforward, simply create a new file and export a class decorated with `@provider`.

```javascript
import { provider } from 'reworkjs/decorators';

@provider
export default class PreferenceProvider {
  
}
```

Boom, we just created a new provider dedicated to handling the state of the user preferences / app settings.

Now let's fill it with useful data.

### State

Now adding state to a provider isn't very complicated. Simply add a static property to it and voilà:
As soon as the provider loads, the property will be added to the fragment of the store this provider handles.

```javascript
import { provider } from 'reworkjs/decorators';

@provider
export default class PreferenceProvider {
  
  static maySendNotifications = false;
}
```

**IMPORTANT**: The property still resides inside the store of the application. Therefore, it is impossible to read nor
write it unless you already have access to the store.

In order to achieve this, the `@provider` decorator transforms the class to make getting properties return a selector, and
setting them fail.

```javascript
// Getting a property.
const selector = PreferenceProvider.maySendNotifications;
// selector: [function select_maySendNotifications(store)]

// Setting a property.
PreferenceProvider.maySendNotifications = true;
// Error: Cannot access @provider state outside of @reducer annotated methods. If you are trying to r/w the state from a @saga, you will need to use "yield put(this.<reducerMethodName>())"
```

An important note about providers is that everything inside then must be `static`. We don't need instances, 
we're merely using classes for the syntactic sugar and for decorators.

*Getting/Setting non-declared state has an undefined behavior on older browsers and will fail on evergreen browsers.*

### Updating the state (reducers)



## Working Example

This is an example of a fully working provider that handles the fragment 
of the store related to the logged user.

```javascript
import { provider, reducer, saga } from 'reworkjs/decorators';
import { put, call } from 'redux-saga/effects';
import api from '~api';

@provider
export default class UserProvider {

  // state declaration and initial state
  static user = null;
  static authError = null;
  static authenticating = false;

  // reducer declaration
  @reducer
  static _setLoggedUser(user) {
    this.user = user;
    this.authError = null;
  }
  
  // reducer declaration
  @reducer
  static _setError(err) {
    this.authError = err;
  }

  // saga declaration
  @saga
  static *logIn(username, password) {
    // call reducers
    yield put(this.authenticating(true));
    
    try {
      yield call(api.logIn(username, password));
      yield put(this._setLoggedUser(user));
    } catch (e) {
      yield put(this._setError(e));
    } finally {
      yield put(this.authenticating(false));
    }
  }
}
```

## Using selectors and actions

- mapToProps
- @container.

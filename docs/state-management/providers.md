# Providers

Providers are an abstraction specific to this framework with the goal of reducing the boilerplate needed to 
manage the global store.

They are built around *static classes*, in which properties are parts of the store and methods are either reducers or sagas.  
They are built this way because matching the redux concepts to already existing OOP concepts make them easier to reason about.  

However, using Providers is in no way a requirement.
If this abstraction doesn't suit you, you can still manage the store without it.  
See [vanilla-redux](./vanilla-redux.md) for more information.

These classes require heavy transformations to be fully usable by redux. The details of which are explored further in this article.  
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

Adding state to a provider isn't very complicated. Simply add a static property to it and voilà:
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

In order to achieve this, the `@provider` decorator transforms the class to make getting a property return a selector, and
setting them fail.

```javascript
// Getting a property returns a selector. You will need to call the selector with the store instance to access it.
const selector = PreferenceProvider.maySendNotifications;
// selector: [function select_maySendNotifications(store)]

// Setting a property.
PreferenceProvider.maySendNotifications = true;
// Error: Cannot access @provider state outside of @reducer annotated methods. If you are trying to r/w the state from a @saga, you will need to use "yield put(this.<reducerMethodName>())"
```

An important note about providers is that everything inside then must be `static`.  
Any static property that is not decorated with neither `@reducer` nor `@saga` will be considered part of the state.

*Getting/Setting non-declared state has an undefined behavior on older browsers and will fail on evergreen browsers.*

### Getters

State getters are supported by Providers and will work like regular state with the difference that you cannot set them.   
Their value are computed based on other state properties.

```javascript
import { provider } from 'reworkjs/decorators';

@provider
export default class UserProvider {

  static user = null;
  static get loggedIn() {
    return this.user != null;
  }
}

UserProvider.user;     // selector
UserProvider.loggedIn; // selector
UserProvider.loggedIn(store.getState()); // false
```

### Setters

Setters are currently unsupported by Providers due to technical limitations. Trying to define one will result in an error. 

### Updating the state (reducers)

Reducers are the only way to alter the store. When writing a provider, adding a reducer requires little more than writing 
a static method and decorating it with `@reducer`.

```javascript
import { provider, reducer } from 'reworkjs/decorators';

@provider
export default class PreferenceProvider {
  
  static maySendNotifications = false;
  
  @reducer
  static setMaySendNotifications(val) {
    this.maySendNotifications = val;
  }
}
```

Reducers have a read/write access to the state of their Provider. Getting a property will return its actual value and 
setting it will update it.

A noteworthy feature is that you do not need to think about ensuring the immutability of the state. It is all handled 
by the provider.

These reducers will then be transformed into action builders and the actual reducer will be handed off to redux.

```javascript
// Calling the method will return an action that you will need to dispatch.
// These actions can be listened to by any reducer.
PreferenceProvider.setMaySendNotifications(true);
// returns: { type: '@@PreferenceProvider/setMaySendNotifications', payload: [true] };
```

Reducers are *fully synchronous* methods. If you need to execute any asynchronous operation, use Sagas 
(read further for the article about sagas).

### Listening to foreign actions

`@reducer` accepts a single argument which makes the the reducer listen to a specific action type rather than its own.

For instance, you could do the following to be notified of a route change from react-redux-router

```javascript
import { provider, reducer } from 'reworkjs/decorators';
import { MATCH as ROUTE_MATCH } from 'redux-router/constants';

@provider
export default class AnotherProvider {

  @reducer(ROUTE_MATCH)
  static _onRouteMatch({ url }) {
    // do something with the url
  }
}
```

You can also pass other reducers (as long as they are provider ones) to copy their action type:

```javascript
import { provider, reducer } from 'reworkjs/decorators';

@provider
export default class AnotherProvider {
  
  @reducer(PreferenceProvider.setMaySendNotifications)
  static _onNotificationChange(val) {
    // do something with val
  }
}
```

Note that calling `AnotherProvider._onNotificationChange()` or `AnotherProvider._onRouteMatch()` will throw an error 
because these reducers do not define a new action.

### Action Format

Providers automatically handle the action format in the standard format `{ type, payload }`
where type is the type of action and payload is an array containing the arguments passed to the action builder.

```javascript
PreferenceProvider.setMaySendNotifications(true);
// returns: { type: '@@PreferenceProvider/setMaySendNotifications', payload: [true] };
```

Once the reducer receives an action, it expects it to have a primitive `type` property and will compare it to its own
to determine whether is should execute. The action will be discarded if it doesn't.

As for the unpacking the payload, there is a little more leeway:

1. If the action contains a property other than `type` and `payload`, it is passed as-is to the reducer function.
2. Else, If the `payload` is not an Array, the `payload` is passed as-is to the reducer function.
3. Else, the `payload` is unpacked and the resulting items are used as function parameters.

### Sagas

Sagas are methods specialized in handling asynchronous operations inside the store. Provider Sagas are nothing more than
a wrapper around [redux-saga](https://github.com/redux-saga/redux-saga).

Like reducers, sagas will be transformed into action builders and can listen to other action types by passing them as the decorator argument.  
Unlike reducers, sagas do *not* have any access to the provider state. You will need to dispatch a new action for that.

```javascript
import { provider, reducer, saga } from 'reworkjs/decorators';
import { put, call } from 'redux-saga/effects';
import api from '~api';

@provider
export default class PreferenceProvider {

  static maySendNotifications = false;

  @reducer
  static setMaySendNotifications(val) {
    this.maySendNotifications = val;
  }

  @saga
  static *loadPreferences() {
    // Load the user preferences from the server.
    // see the redux-saga documentation for `call`.
    const { maySendNotifications } = yield call(api.loadPreferences);

    // `put` dispatches a new action, which `this.setMaySendNotifications()` builds.
    // The action will be received by the above reducer which will update the store.
    // See the redux-saga documentation for more details
    yield put(this.setMaySendNotifications(maySendNotifications));
  }
```

As tracking if a saga is running is a recurrent need (to check if the api are still running, to lock submit buttons 
while the form is being processed), Providers come with a built-in system to determine it.

To enable it, pass `trackStatus: true` as an argument to the saga decorator.

```javascript
  @saga({ trackStatus: true })
  static *savePreferences(data) {
    yield call(() => api.savePreferences(data));
  }
}
```

The saga exposes a selector that will let you retrieve whether the saga is currently running or not.

```javascript
@container({
  state: {
    formSaving: PreferenceProvider.savePreferences.running, // <- the selector.
  },
  actions: {
    saveForm: PreferenceProvider.savePreferences,
  }
})
class PreferenceMenu extends React.Component {
  static propTypes = {
    formSaving: React.PropTypes.bool,
    saveForm: React.PropTypes.func,
  };
  
  // ...
}
```

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

## Corner Cases

Be careful when naming your static properties, avoid any name already in use by a static property of `Function` or any
property of `Object.prototype` as those are inherited and will be ignored when building the provider.

Such names include (could differ depending on the browser and the current JavaScript version): 

Inherited from Object:
- \_\_defineGetter__
- \_\_defineSetter__
- hasOwnProperty
- \_\_lookupGetter__
- \_\_lookupSetter__
- propertyIsEnumerable
- constructor
- toString
- toLocaleString
- valueOf
- isPrototypeOf
- \_\_proto__

Inherited from Function:
- length
- name
- arguments
- caller
- prototype

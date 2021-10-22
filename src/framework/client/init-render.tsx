import { loadableReady } from '@loadable/component';
import serverStyleCleanup from 'node-style-loader/clientCleanup';
import ReactDOM from 'react-dom';
import { updateServiceWorker } from '../common/service-worker-updater';
import RootComponent from './root-component.js';

const appContainer = document.getElementById('app');
if (appContainer.hasChildNodes()) {
  // ensure all needed chunks are loaded before hydrating to prevent flicker
  loadableReady(() => {
    ReactDOM.hydrate(
      <RootComponent />,
      appContainer,
    );
  });
} else {
  ReactDOM.render(
    <RootComponent />,
    appContainer,
  );
}

// remove server-generated CSS
serverStyleCleanup();

updateServiceWorker();

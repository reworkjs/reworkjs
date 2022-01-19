issues encountered with rework:
- bring everything intl related from mmc
- should prompt "what is the default locale of your app" during init
- rjs cli could not find rjs bin

- change how pages are loaded
  page pattern : (name).route.js
  use name for url

- re-export Helmet from '@reworkjs/core/helmet'

- make entry-react default to pages/_app ?

- write default values to reworkrc

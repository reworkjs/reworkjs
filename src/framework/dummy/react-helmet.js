import { Helmet } from 'react-helmet-async';

if (process.env.NODE_ENV !== 'production') {
  console.warn('[DEPRECATION] react-helmet is broken and hasn\'t been updated in a long time. Use react-helmet-async');
}

export default Helmet;

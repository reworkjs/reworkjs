// docz isn't super stable yet, adding these dev deps causes crashes
import styles from 'gatsby-theme-docz/src/theme/styles';

export default {
  ...styles,
  inlineCode: {
    fontFamily: 'monospace',
    padding: '0.2em 0.4em',
    margin: 0,
    background: 'rgba(27,31,35,0.05)',
    borderRadius: '3px',
  },
};

/*
font-family: "SFMono-Regular",Consolas,"Liberation Mono",Menlo,Courier,monospace;
 */

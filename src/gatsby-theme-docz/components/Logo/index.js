

/** @jsx jsx */

// docz isn't super stable yet, adding these dev deps causes crashes
// eslint-disable-next-line import/no-extraneous-dependencies
import { jsx, Flex } from 'theme-ui';
import { Link, useConfig } from 'docz';
import logo from './logo.png';

const css = {
  logo: {
    letterSpacing: '-0.02em',
    fontWeight: 600,
    fontSize: 4,
    height: '64px',
    width: '64px',
  },
  link: {
    fontWeight: 600,
    color: 'header.text',
    textDecoration: 'none',
    maxHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    ':hover': {
      color: 'primary',
    },
  },
  img: {
    maxHeight: '100%',
    marginRight: '8px',
  },
};

export function Logo() {
  const config = useConfig();

  return (
    <Flex aligmItems="center" sx={css.logo} data-testid="logo">
      <Link to="/" sx={css.link}>
        <img src={logo} alt="" sx={css.img} />
        {config.title}
      </Link>
    </Flex>
  );
}

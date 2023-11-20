import { JSSClasses } from '../../../../types';

export type StylesType = JSSClasses<typeof styles>;
export type IdentitiesStylesType = JSSClasses<typeof identitiesStyle>;

export const styles = {
  help: {
    marginBottom: 17,
    fontSize: 13,
    fontWeight: 600,
  },
  input: {
    flexGrow: 1,
    paddingBottom: 5,
    color: 'white',
    backgroundColor: 'transparent',
    border: 0,
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    '&::placeholder': {
      textAlign: 'center',
      color: 'white',
      opacity: 0.6,
    },
  },
  largeInput: {
    width: 220,
  },
  subContainer: {
    marginTop: 20,
  },
  withPointer: {
    cursor: 'pointer',
  },
};

export const identitiesStyle = {
  ...styles,
  accountContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  account: {
    width: 220,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    marginBottom: 2,
    padding: [12, 8],
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transition: 'background-color 100ms ease-out',
    cursor: 'pointer',

    '&:first-of-type': {
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },

    '&:last-of-type': {
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
    },

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },

  accountDetail: {
    display: 'flex',
    flex: 1,
    width: 0,
    marginRight: 2,
  },

  accountEmail: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  accountImage: {
    flexShrink: 0,
    width: 16,
    height: 16,
    marginRight: 10,
    border: '2px solid white',
    borderRadius: '100%',
  },
};

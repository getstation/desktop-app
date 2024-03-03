import { roundedBackground } from '@getstation/theme';
import { colors } from '@src/theme';
import { applicationNameMaxWidth } from '@src/shared/constants/constants';

import { AppStoreApplicationProps } from './AppStoreApplication';

const styles = {
  application: {
    flex: '0 0 291px',
    display: 'flex',
    justifyContent: 'space-between',
    color: 'rgb(38, 33, 33)',
    alignItems: 'center',
    width: ({ alternate }: AppStoreApplicationProps) => alternate ? null : 291,
    marginBottom: 27,
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: '999px',
    transition: 'none',
    '&:hover': {
      backgroundColor: ({ alternate }: AppStoreApplicationProps) => alternate ? '#EEE' : 'none',
    },
  },
  applicationContent: {
    display: 'flex',
    alignItems: 'center',
  },
  applicationDetails: {
    maxWidth: 190,
  },
  applicationNameContainer: {
    display: 'inline-block',
    '&.applicationNamePopup': {
      position: 'relative',
      '&:after': {
        content: ({ application }: AppStoreApplicationProps) => `'${application.name}'`,
        display: 'block',
        position: 'absolute',
        top: '-20px',
        left: 6,
        backgroundColor: colors.blueGray10,
        fontSize: 10,
        letterSpacing: '0.5px',
        color: colors.blueGray100,
        padding: [3, 4],
        borderRadius: 3,
        boxShadow: `0 2px 4px 1px rgba(0, 0, 0, 0.08), 0 0 0 0.5px ${colors.blueGray10}`,
        visibility: 'hidden',
        transition: 'visibility .2s',
      },
      '&:hover:after': {
        visibility: 'visible',
        transition: 'visibility .2s',
      },
    },
  },
  applicationName: {
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '600',
    maxWidth: applicationNameMaxWidth,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  applicationControls: {
    display: 'flex',
  },
  applicationControlsItem: {
    marginRight: 10,
  },
  categoryName: {
    fontSize: '12px',
    color: '#949494',
  },
  action: {
    flexShrink: 0,
    ...roundedBackground('#999'),
    opacity: 0,
    display: 'none',
    cursor: 'pointer',
    transition: '200ms',
    '$application:hover &': {
      display: 'block',
      opacity: .6,
    },
    '&:hover': {
      display: 'block',
      opacity: '1 !important',
    },
  },
  '@media (min-width: 600px)': {
    application: {
      marginBottom: ({ marginBottom }: AppStoreApplicationProps) => marginBottom ? marginBottom : 14,
    },
  },
};

export interface AppStoreApplicationClasses {
  application: string,
  applicationContent: string,
  applicationDetails: string,
  applicationNameContainer: string,
  applicationName: string,
  applicationControls: string,
  applicationControlsItem: string,
  categoryName: string,
  action: string,
}

export default styles;

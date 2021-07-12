import { WithSelectedCustomAppProps } from '@src/HOC/withSelectedCustomApp';

const styles = {
  modal: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 26,
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#949494',
  },
  appWrapper: {
    display: 'flex',
    marginBottom: 34,
    alignItems: 'center',
  },
  appIcon: {
    width: '100%',
    height: '100%',
  },
  appIconWrapper: {
    backgroundColor: ({ app }: WithSelectedCustomAppProps) => app.themeColor,
    borderRadius: 100,
    overflow: 'hidden',
    width: 32,
    height: 32,
    marginRight: 10,
  },
  appNameText: {
    fontSize: 14,
    fontWeight: 600,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#292929',
  },
};

export interface AppStoreModalClasses {
  stepperContainer: string,
  modal: string,
  modalText: string,
  transitionWrapper: string,
  appWrapper: string,
  appIconWrapper: string,
  appIcon: string,
  appNameText: string,
}

export default styles;

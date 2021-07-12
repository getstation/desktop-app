const styles = {
  animationIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 100,
  },
  '@media (min-width: 600px)': {
    animationIcon: {
      left: 'calc(50% + 100px)',
    },
  },
};

export interface AppStorePreloaderClasses {
  animationIcon: string,
}

export default styles;

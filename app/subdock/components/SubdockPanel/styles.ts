export interface SubdockListStyle {
  container: string,
  content: string,
  scrollOverlayTop: string,
  scrollOverlayBottom: string,
  title: string,
  sectionHeader: string,
}

export const subdockListStyle = {
  container: {
    position: 'relative',
    flex: '1 1 auto',
    padding: '0 0 0 ($gutter * 2)',
    width: '100%',
    marginBottom: '10px',
  },
  content: {
    maxHeight: 200,
    overflowY: 'scroll',
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: 50,
      pointerEvents: 'none',
      zIndex: 1,
      opacity: 0,
      transition: 'opacity 300ms ease-out',
    },
    '&::before': {
      background: 'linear-gradient(#254969, rgba(0,0,0,0))',
    },
    '&::after': {
      bottom: 0,
      background: 'linear-gradient(rgba(0,0,0,0), #254969)',
    },
  },
  title: {
    textTransform: 'uppercase',
    padding: [10],
    fontSize: 10,
    opacity: .3,
    fontStyle: 'bold',
    color: 'white',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollOverlayTop: {
    '&::before': {
      opacity: '1 !important',
    },
  },
  scrollOverlayBottom: {
    '&::after': {
      opacity: '1 !important',
    },
  },
};

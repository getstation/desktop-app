const styles = {
  stepContainer: {
    maxWidth: 300,
    width: '100%',
    marginBottom: 42,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#363636',
    marginBottom: 10,
  },
  deleteButton: {
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: -5,
    cursor: 'pointer',
    color: '#797979',
    transition: 'color .2s',
    '&:hover': {
      color: '#E75858',
      transition: 'color .2s',
    },
    '&:hover > svg': {
      fill: '#E75858',
      transition: 'fill .2s',
    },
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: 600,
  },
};

export interface DeleteClasses {
  stepContainer: string,
  subTitle: string,
  deleteButton: string,
  deleteButtonText: string,
}

export default styles;

import { ThemeTypes as Theme } from '@getstation/theme';

export const commonStyles = (theme: Theme) => ({
  errorWrapper: {
    color: 'red',
    fontStyle: 'italic',
    marginBottom: '10px',
    display: 'inline-block',
    fontSize: '.95em',
  },
  contentWrapper: {
    padding: 70,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    ...theme.titles.h1,
    color: theme.colors.gray.dark,
  },
  subtitle: {
    ...theme.titles.h3,
    color: theme.colors.gray.middle,
    marginBottom: 70,
  },
  button: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: [0, 'auto', 0, 0],
  },
});

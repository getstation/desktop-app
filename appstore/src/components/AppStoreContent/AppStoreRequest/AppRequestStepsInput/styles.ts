import { ThemeTypes } from '@getstation/theme';
import { AppRequestStepsInputProps } from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsInput/AppRequestStepsInput';

const styles = (theme: ThemeTypes) => ({
  inputWrapper: {
    position: 'relative',
  },
  input: {
    display: 'block',
    appearance: 'none',
    border: (({ error }: AppRequestStepsInputProps) =>
      error ? `2px solid ${theme.colors.error}` : '1px solid rgba(41, 41, 41, 0.1)') as any,
    padding: [0, 15] as any,
    boxSizing: 'border-box',
    borderRadius: 30,
    minWidth: 200,
    width: '100%',
    height: 34,
    lineHeight: '34px',
    ...theme.fontMixin(11, 500),
    transition: 'all 250ms ease-out',
    color: (({ error }: AppRequestStepsInputProps) =>
      error ? theme.colors.error : '#292929') as any,
    backgroundColor: '#FFFFFF',
    '&:disabled': {
      opacity: 0.4,
    },
    '&:focus': {
      outline: 'none',
    },
    '&::-webkit-input-placeholder': {
      color: 'rgba(1, 1, 1, 0.3)',
    },
  },
  error: {
    position: 'absolute',
    top: '-20px',
    left: 0,
    fontSize: 12,
    color: theme.colors.error,
  },
});

export interface AppRequestStepsInputClasses {
  inputWrapper: string,
  error: string,
  input: string,
}

export default styles;

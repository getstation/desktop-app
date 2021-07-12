/**
 * This File should move to theme when it will support hooks
 */

import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { debounce } from 'lodash';
import { colors } from '@src/theme';

const useStyles = createUseStyles({
  textarea: {
    resize: 'none',
    textAlign: 'justify',
    padding: [12, 14],
    borderRadius: 10,
    borderColor: 'lightgray',
    '&:focus': {
      boxShadow: [0, 0, 4, 0, colors.blueGlowing],
      border: [1, 'solid', colors.blueGlowing],
      outline: 'none',
    },
  },
  textAreaLabel: {
    display: 'block',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
  },
  textareaExplanation: {
    color: 'gray',
  },
});

type OwnProps = {
  canEdit: boolean
  text?: string | undefined,
  label?: string,
  placeholder: string,
  rows?: number,
  cols?: number,
  onChange: (e: any) => any,
  maxLength?: number,
};

/**
 * Dumb statefull component (to be able to use is 'as it') + controll it with the parrent
 */
export const Textarea = (
  { canEdit = false, text, placeholder, label, onChange, rows = 10, cols = 70, maxLength = 4096 }: OwnProps,
) => {
  const classes = useStyles();

  return (
    <section>
      <label htmlFor="text" className={classes.textAreaLabel}>{label}</label>
      <textarea
        className={classes.textarea}
        value={text}
        name="text"
        disabled={!canEdit}
        placeholder={!text ? placeholder : undefined}
        spellCheck={false}
        rows={rows}
        cols={cols}
        onChange={canEdit ? (event) => onChange(event.target.value) : undefined}
        maxLength={maxLength}
      >
        {text}
      </textarea>
    </section>
  );
};

import * as React from 'react';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, number } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import { action, decorate } from '@storybook/addon-actions';

import { Textarea } from './Textarea';

const story = storiesOf('Common| Textarea', module)
.addDecorator(withKnobs)
.addDecorator(centered);

const placeholder = 'A simple placeholder';

story
.add('Empty',
withInfo({ text: '' })(
  withNotes!('')(
  () => {
    const [text, setText] = React.useState('');
    const onchange = decorate([(value) => { setText(value); return value; }]);
    return (
      <Textarea
        text={text}
        canEdit={true}
        placeholder={placeholder}
        onChange={onchange.action('onChange')}
      />
    );
  }
)))
.add('With text sent from parent at boot',
withInfo({ text: '' })(
  withNotes!('')(
  () => {
    const [text, setText] = React.useState('this is a text, see the diff with placeholder ? 😎');
    const onchange = decorate([(value) => { setText(value); return value; }]);
    return (
      <Textarea
        text={text}
        canEdit={true}
        placeholder={placeholder}
        onChange={onchange.action('onChange')}
      />
    );
  }
)))
.add('Disabled',
withInfo({ text: '' })(
  withNotes!('')(
  () => {
    const [text, setText] = React.useState('this is a text, see the diff with placeholder ? 😎');
    const onchange = decorate([(value) => { setText(value); return value; }]);
    return (
      <Textarea
        text={text}
        canEdit={false}
        placeholder={placeholder}
        onChange={onchange.action('onChange')}
      />
    );
  }
)))
.add('Edited by parent after some time',
withInfo({ text: '' })(
  withNotes!('')(
  () => {
    const [text, setText] = React.useState('default');
    const onchange = decorate([(value) => { setText(value); return value; }]);
    setTimeout(() => {
      setText('Another message set from parent');
    }, 4000);
    return (
      <Textarea
        canEdit={true}
        placeholder={placeholder}
        text={text}
        onChange={onchange.action('onChange')}
      />
    );
  }
)));

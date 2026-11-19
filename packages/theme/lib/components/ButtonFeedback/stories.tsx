import { ButtonFeedback } from './index';
import { Size, Style } from '../Button';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

storiesOf('Molecules|ButtonFeedback', module)
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add('Feedback Primary',
    withInfo({ text: 'FeedbackButton Normal Primary' })(
      withNotes('FeedbackButton - Normal Primary')(
        () => (
          <div>
            <ButtonFeedback btnSize={Size.BIG} btnStyle={Style.PRIMARY}>Big Feedback Button</ButtonFeedback>
            <ButtonFeedback btnSize={Size.NORMAL} btnStyle={Style.PRIMARY}>Normal Feedback Button</ButtonFeedback>
            <ButtonFeedback btnSize={Size.SMALL} btnStyle={Style.PRIMARY}>Small Feedback Button</ButtonFeedback>
            <ButtonFeedback btnSize={Size.XSMALL} btnStyle={Style.PRIMARY}>XSmall Feedback Button</ButtonFeedback>
            <ButtonFeedback btnSize={Size.XXSMALL} btnStyle={Style.PRIMARY}>XXSmall Feedback Button</ButtonFeedback>
          </div>
        )
      )))
  .add('Feedback Secondary',
    withInfo({ text: 'FeedbackButton Normal Secondary' })(
      withNotes('FeedbackButton - Normal Secondary')(
        () => (
          <div>
            <ButtonFeedback btnSize={Size.BIG} btnStyle={Style.SECONDARY}>Big Feedback Button</ButtonFeedback>
            <ButtonFeedback btnSize={Size.NORMAL} btnStyle={Style.SECONDARY}>Normal Feedback Button</ButtonFeedback>
            <ButtonFeedback btnSize={Size.SMALL} btnStyle={Style.SECONDARY}>Small Feedback Button</ButtonFeedback>
            <ButtonFeedback btnSize={Size.XSMALL} btnStyle={Style.SECONDARY}>XSmall Feedback Button</ButtonFeedback>
            <ButtonFeedback btnSize={Size.XXSMALL} btnStyle={Style.SECONDARY}>XXSmall Feedback Button</ButtonFeedback>
          </div>
        )
      )));

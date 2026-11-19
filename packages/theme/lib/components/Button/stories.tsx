import { Button, Size, Style } from './index';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

storiesOf('Atoms|Button', module)
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add('All buttons',
    withInfo({ text: 'All buttons' })(
      withNotes('All buttons  ')(
        () => {
          const mainContent = text('main button content', 'Main Button');
          const primaryContent = text('primary button content', 'Primary Button');
          const secondaryContent = text('secondary button content', 'Secondary Button');
          const tertiaryContent = text('tertiary button content', 'Tertiary Button');
          const linkContent = text('link button content', 'Link Button');
          const dangerContent = text('danger button content', 'Danger Button');
          const outlinedContent = text('outlined button content', 'Outlined Button');

          const style = { marginLeft: '10px' };
          const isLoading = boolean('isLoading', false);
          return (
            <div>
              <h4>XXSMALL Button</h4>
              <div>
                <Button style={style} btnSize={Size.XXSMALL} btnStyle={Style.MAIN} isLoading={isLoading}>
                  {mainContent}
                </Button>
                <Button style={style} btnSize={Size.XXSMALL} btnStyle={Style.PRIMARY} isLoading={isLoading}>
                  {primaryContent}
                </Button>
                <Button style={style} btnSize={Size.XXSMALL} btnStyle={Style.SECONDARY} isLoading={isLoading}>
                  {secondaryContent}
                </Button>
                <Button style={style} btnSize={Size.XXSMALL} btnStyle={Style.TERTIARY} isLoading={isLoading}>
                  {tertiaryContent}
                </Button>
                <Button style={style} btnSize={Size.XXSMALL} btnStyle={Style.LINK} isLoading={isLoading}>
                  {linkContent}
                </Button>
                <Button style={style} btnSize={Size.XXSMALL} btnStyle={Style.DANGER} isLoading={isLoading}>
                  {dangerContent}
                </Button>
                <Button style={style} btnSize={Size.XXSMALL} btnStyle={Style.OUTLINED} isLoading={isLoading}>
                  {outlinedContent}
                </Button>
              </div>
              <h4>XSMALL Button</h4>
              <div>
                <Button style={style} btnSize={Size.XSMALL} btnStyle={Style.MAIN} isLoading={isLoading}>
                  {mainContent}
                </Button>
                <Button style={style} btnSize={Size.XSMALL} btnStyle={Style.PRIMARY} isLoading={isLoading}>
                  {primaryContent}
                </Button>
                <Button style={style} btnSize={Size.XSMALL} btnStyle={Style.SECONDARY} isLoading={isLoading}>
                  {secondaryContent}
                </Button>
                <Button style={style} btnSize={Size.XSMALL} btnStyle={Style.TERTIARY} isLoading={isLoading}>
                  {tertiaryContent}
                </Button>
                <Button style={style} btnSize={Size.XSMALL} btnStyle={Style.LINK} isLoading={isLoading}>
                  {linkContent}
                </Button>
                <Button style={style} btnSize={Size.XSMALL} btnStyle={Style.DANGER} isLoading={isLoading}>
                  {dangerContent}
                </Button>
                <Button style={style} btnSize={Size.XSMALL} btnStyle={Style.OUTLINED} isLoading={isLoading}>
                  {outlinedContent}
                </Button>
              </div>
              <h4>SMALL Button</h4>
              <div>
                <Button style={style} btnSize={Size.SMALL} btnStyle={Style.MAIN} isLoading={isLoading}>
                  {mainContent}
                </Button>
                <Button style={style} btnSize={Size.SMALL} btnStyle={Style.PRIMARY} isLoading={isLoading}>
                  {primaryContent}
                </Button>
                <Button style={style} btnSize={Size.SMALL} btnStyle={Style.SECONDARY} isLoading={isLoading}>
                  {secondaryContent}
                </Button>
                <Button style={style} btnSize={Size.SMALL} btnStyle={Style.TERTIARY} isLoading={isLoading}>
                  {tertiaryContent}
                </Button>
                <Button style={style} btnSize={Size.SMALL} btnStyle={Style.LINK} isLoading={isLoading}>
                  {linkContent}
                </Button>
                <Button style={style} btnSize={Size.SMALL} btnStyle={Style.DANGER} isLoading={isLoading}>
                  {dangerContent}
                </Button>
                <Button style={style} btnSize={Size.SMALL} btnStyle={Style.OUTLINED} isLoading={isLoading}>
                  {outlinedContent}
                </Button>
              </div>
              <h4>NORMAL Button</h4>
              <div>
                <Button style={style} btnSize={Size.NORMAL} btnStyle={Style.MAIN} isLoading={isLoading}>
                  {mainContent}
                </Button>
                <Button style={style} btnSize={Size.NORMAL} btnStyle={Style.PRIMARY} isLoading={isLoading}>
                  {primaryContent}
                </Button>
                <Button style={style} btnSize={Size.NORMAL} btnStyle={Style.SECONDARY} isLoading={isLoading}>
                  {secondaryContent}
                </Button>
                <Button style={style} btnSize={Size.NORMAL} btnStyle={Style.TERTIARY} isLoading={isLoading}>
                  {tertiaryContent}
                </Button>
                <Button style={style} btnSize={Size.NORMAL} btnStyle={Style.LINK} isLoading={isLoading}>
                  {linkContent}
                </Button>
                <Button style={style} btnSize={Size.NORMAL} btnStyle={Style.DANGER} isLoading={isLoading}>
                  {dangerContent}
                </Button>
                <Button style={style} btnSize={Size.NORMAL} btnStyle={Style.OUTLINED} isLoading={isLoading}>
                  {outlinedContent}
                </Button>
              </div>
              <h4>BIG Button</h4>
              <div>
                <Button style={style} btnSize={Size.BIG} btnStyle={Style.MAIN} isLoading={isLoading}>
                  {mainContent}
                </Button>
                <Button style={style} btnSize={Size.BIG} btnStyle={Style.PRIMARY} isLoading={isLoading}>
                  {primaryContent}
                </Button>
                <Button style={style} btnSize={Size.BIG} btnStyle={Style.SECONDARY} isLoading={isLoading}>
                  {secondaryContent}
                </Button>
                <Button style={style} btnSize={Size.BIG} btnStyle={Style.TERTIARY} isLoading={isLoading}>
                  {tertiaryContent}
                </Button>
                <Button style={style} btnSize={Size.BIG} btnStyle={Style.LINK} isLoading={isLoading}>
                  {linkContent}
                </Button>
                <Button style={style} btnSize={Size.BIG} btnStyle={Style.DANGER} isLoading={isLoading}>
                  {dangerContent}
                </Button>
                <Button style={style} btnSize={Size.BIG} btnStyle={Style.OUTLINED} isLoading={isLoading}>
                  {outlinedContent}
                </Button>
              </div>
            </div>
          );
        }
      )));

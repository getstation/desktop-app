import { Icon, IconSymbol } from '@getstation/theme';
import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import DockNavigationButtons from '../../app/dock-navigation/components/DockNavigationButtons';
import NativeAppDockIcon, { Size } from '../../app/dock/components/NativeAppDockIcon';

const containerStyle = {
  width: 50,
  height: '100%',
  padding: '5px 0',
  backgroundColor: '#0E3255',
};

const OSBarStyle = {
  width: '100%',
  height: 20,
  backgroundColor: '#0E3255',
};

const iconContainerStyle = {
  display: 'inline-flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#EEE',
  margin: 10,
  width: 200,
  height: 200,
};

const iconWrapperStyle = {
  border: '1px solid gray',
};

storiesOf('Theme|Icons', module)
  .addDecorator(withKnobs)
  .add('NativeAppDockIcon',
    () => (
      <div style={containerStyle}>
        <NativeAppDockIcon
          tooltip={'Tooltip text'}
          iconSymbolId={IconSymbol.FOCUS}
          onClick={action('clicked')}
          disabled={boolean('disabled')}
          isSnoozed={boolean('isSnoozed', false)}
          syncWithOS={boolean('syncWithOS', false)}
        />
      </div>
    )
  )
  .add('Bigger NativeAppDockIcon',
    () => (
      <div style={containerStyle}>
        <NativeAppDockIcon
          tooltip={'Tooltip text'}
          iconSymbolId={IconSymbol.FOCUS}
          onClick={action('clicked')}
          disabled={boolean('disabled')}
          isSnoozed={boolean('isSnoozed', false)}
          syncWithOS={boolean('syncWithOS', false)}
          size={Size.BIG}
          active={true}
        />
      </div>
    )
  )
  .add('Dock Navigation Buttons',
    () => (
      <div style={containerStyle}>
        <DockNavigationButtons
          canGoBack={boolean('canGoBack', true)}
          canGoForward={boolean('canGoForward', true)}
          onGoBack={action('go back')}
          onGoForward={action('go forward')}
        />
        <NativeAppDockIcon
          tooltip={'Quick Switch'}
          iconSymbolId={IconSymbol.SEARCH}
          onClick={action('clicked')}
          disabled={boolean('disabled')}
        />
      </div>
    )
  )
  .add('Dock Navigation Buttons OSBar',
    () => (
      <div style={OSBarStyle}>
        <DockNavigationButtons
          canGoBack={boolean('canGoBack', true)}
          canGoForward={boolean('canGoForward', true)}
          onGoBack={action('go back')}
          onGoForward={action('go forward')}
        />
      </div>
    )
  )
  .add('All icons', () => (
    <div>
      {
        Object.keys(IconSymbol).map(symbol => (
          <div key={symbol} style={iconContainerStyle}>
            <div style={iconWrapperStyle}>
              <Icon key={symbol} symbolId={IconSymbol[symbol]} color={'#000'} size={48}/>
            </div>
            <pre>{ IconSymbol[symbol] }</pre>
          </div>
        ))
      }
    </div>
  ));

Object.keys(IconSymbol).map(symbol =>
  storiesOf('Theme|Icons/icon', module).add(IconSymbol[symbol], () => (
    <div key={symbol}>
      <h1>Icon: {symbol}</h1>
      <div style={iconContainerStyle}>
        <div style={iconWrapperStyle}>
          <Icon key={symbol} symbolId={IconSymbol[symbol]} color={'#000'} size={48}/>
        </div>
        <pre>{IconSymbol[symbol]}</pre>
      </div>

      <div style={containerStyle}>
        <NativeAppDockIcon
          tooltip={IconSymbol[symbol]}
          iconSymbolId={IconSymbol[symbol]}
          onClick={action('clicked')}
          disabled={boolean('disabled')}
        />
      </div>
    </div>
  ))
);

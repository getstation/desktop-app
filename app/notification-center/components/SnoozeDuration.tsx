import * as React from 'react';
import * as moment from 'moment';
// @ts-ignore no declaration file
import * as millisec from 'millisec';
import ms = require('ms');
import ReactInterval from '../../common/components/ReactInterval';

export interface Props {
  snoozeEndDate: object
}

export interface State {
  content: string
}

function sameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

export default class SnoozeDuration extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { content: '' };

    this.tick = this.tick.bind(this);
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.update(nextProps);
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillMount() {
    this.update(this.props);
  }

  update(props: Props) {
    if (!props.snoozeEndDate) {
      this.setState({
        content: '',
      });
      return;
    }
    const diff = moment(props.snoozeEndDate).diff(new Date());
    const msDiff = millisec(diff);

    const h = Math.floor(diff / ms('1hour'));
    const m = msDiff.getMinutes();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const untilTomorrow = diff > ms('4h') && sameDay(moment(props.snoozeEndDate).toDate(), tomorrow);

    let content;

    if (untilTomorrow) {
      content = 'until tomorrow';
    } else if (diff > ms('1h')) {
      content = m !== 0 ? `for ${h}h${m}min` : `for ${h}h`;
    } else if (diff > ms('1min')) {
      content = `for ${m}min`;
    } else {
      content = `for <1min`;
    }

    this.setState({ content });
  }

  tick() {
    this.update(this.props);
  }

  render() {
    return (
      <span>
        <ReactInterval enabled={true} callback={this.tick} />
        {this.state.content}
      </span>
    );
  }
}

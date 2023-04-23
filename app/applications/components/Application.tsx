import * as React from 'react';
// @ts-ignore
import injectSheet, { WithSheet } from 'react-jss';
import { createStyles, ThemeTypes, Icon, IconSymbol } from '@getstation/theme';
import { roundedBackground } from '@getstation/theme/dist/jss';
import { MinimalApplication } from '../graphql/withApplications';
import AppIcon from '../../dock/components/AppIcon';

/** The type of action: will influence icon used and checkbox. If not present, no action button will be shown. */
export enum ApplicationActionType {
  Add = 'Add',
  Settings = 'Settings',
  Remove = 'Remove',
}

interface OwnProps {
  application: MinimalApplication,
  onAdd: (application: MinimalApplication, iconRef?: any) => any,
  isExtension?: boolean,
  subTitle?: string,
  actionType?: ApplicationActionType,
  alternate?: boolean,
  getIconRef?: boolean,
}

const ApplicationActionButtonIconMap = {
  [ApplicationActionType.Add]: IconSymbol.PLUS,
  [ApplicationActionType.Settings]: IconSymbol.COG,
  [ApplicationActionType.Remove]: IconSymbol.CROSS,
};

const styles = (theme: ThemeTypes) => createStyles({
  container: {
    flex: 0,
    display: 'inline-flex',
    color: 'rgb(38, 33, 33)',
    alignItems: 'center',
    width: (({ alternate }: OwnProps) => alternate ? null : 195) as any,
    margin: '0 7px 10px 0',
    padding: (({ alternate }: OwnProps) => alternate ? '0px 5px 10px 0' : 10) as any,
    backgroundColor: 'transparent',
    borderRadius: '999px',
    transition: '200ms',
    userSelect: 'none',
    '&:hover': {
      backgroundColor: ({ alternate }: OwnProps) => alternate ? 'none' : '#EEE',
    } as any,
  },
  iconContainer: {
    margin: '0 10px 0 0',
    position: 'relative',
    width: '30px',
    height: '30px',
  },
  applicationDetails: {
    flexGrow: 1,
    width: '130px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '& small': {
      fontSize: '10px',
      fontStyle: 'italic',
    },
  },
  applicationName: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: 600,
  },
  icon: {
    display: 'inline-block',
    borderRadius: '50%',
    width: 30,
  },
  iconPin: {
    ...theme.mixins.flexbox.containerCenter,
    position: 'absolute',
    bottom: -6,
    right: -7,
    ...theme.mixins.size(22),
    backgroundColor: '#BBB',
    border: '2px solid white',
    borderRadius: '100%',
  },
  action: {
    flexShrink: 0,
    ...roundedBackground('#999'),
    opacity: 0,
    cursor: 'pointer',
    transition: '200ms',
    '$container:hover &': {
      opacity: .6,
    },
    '&:hover': {
      opacity: '1 !important',
    } as any,
  },
  svgPath: {
    fill: 'white',
  },
});

type Props = OwnProps & WithSheet<typeof styles>;

class ApplicationImpl extends React.PureComponent<Props, {}> {
  iconRef: any;

  constructor(props: Props) {
    super(props);

    this.iconRef = React.createRef();
  }

  handleAddApplication = () => {
    const { application } = this.props;

    this.props.onAdd(application, this.iconRef.current);
  }

  render() {
    const { classes, application, isExtension, actionType, subTitle } = this.props;


    console.log(`ZZZZZZZZZZZZZZZZZZZZZZZZZZZ ApplicationImpl`);


    return (
      <div className={classes!.container}>
        <div className={classes!.iconContainer}>
          <div ref={this.iconRef} className={classes!.icon}>
            <AppIcon imgUrl={application.iconURL} themeColor={application.themeColor} />
          </div>

          {isExtension &&
            <div className={classes!.iconPin}>
              <Icon symbolId={IconSymbol.EXTENSION} size={25} color={'#5d5d5d'} />
            </div>
          }
        </div>

        <p className={classes!.applicationDetails}>
          <strong className={classes!.applicationName}>{application.name}</strong>

          {subTitle && <small>{subTitle}</small>}
        </p>

        {actionType &&
          <Icon
            symbolId={ApplicationActionButtonIconMap[actionType]}
            size={24}
            className={classes!.action}
            onClick={this.handleAddApplication}
          />
        }
      </div>
    );
  }
}

export default injectSheet(styles)(ApplicationImpl);

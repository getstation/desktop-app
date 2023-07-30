import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Tooltip } from '@getstation/theme';
import { colors } from '@src/theme';

import { Application } from '../Application.type';
const dots = require('../../../static/dock-sample-three-dots.svg');
const empty = require('../../../static/dock-sample-empty.svg');

const useStyles = createUseStyles({
  applicationListDiv: ({ isDockPreview, direction, nbOfApps }: Props & {nbOfApps:number}) => {
    if (direction !== 'column' || !isDockPreview) return;
    return {
      height: 609,
      backgroundImage:  `url(${nbOfApps <= 3 ? dots : empty})`,
      backgroundOrigin: ['padding-box', '!important'],
      backgroundPosition: ['right top 0', '!important'],
      backgroundRepeat: 'no-repeat',
      transition: 'background-image  1s linear',
    };
  },
  applicationListUl: ({ isDockPreview, direction }: Props) => {
    const commonProperties = {
      listStyle: 'none',
      display: 'flex',
      flexDirection: direction,
      paddingInlineStart: 0,
    };

    if (direction !== 'column' || !isDockPreview) {
      return {
        ...commonProperties,
        flexWrap: 'wrap',
        marginRight: 30,
        marginBottom: 0,
      };
    }

    // This will make those app as they were inside a dock 😎
    return {
      ...commonProperties,
      height: 428,
      maxHeight: 428,
      width: 69,
      marginTop: 79,
      marginLeft: 1,
      marginRight: 0,
      overflowY: 'auto',
      scrollBehavior: 'smooth',
      '&::-webkit-scrollbar':{
        display: 'none',
      },
      '&::-webkit-scrollbar-thumb':{
        display: 'none',
      },
    };
  },
  app: {
    width: ({ iconSize }: Props) => `${iconSize}px`,
    height: ({ iconSize }: Props) => `${iconSize}px`,
    position: 'relative',
    // shorthand property uses margintop for column, marginright for row
    margin: ({ direction, marginBetweenApps, isDockPreview }: Props) =>
      direction === 'column' ? `${marginBetweenApps}px 0 0 ${isDockPreview ? 22 : 0}px` : `0 ${marginBetweenApps}px 10px 0`,
    '&:hover $overlay': {
      opacity: .8,
    },
    flexShrink: 0,
    marginBottom: 10,
  },
  appLogo: {
    width: ({ iconSize }: Props) => `${iconSize}px`,
    height: ({ iconSize }: Props) => `${iconSize}px`,
    borderRadius: ({ iconSize }: Props) => `${iconSize}px`,
    transition: '.5s ease',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
    opacity: 0,
    transition: '.5s ease',
    borderRadius: '48px',
    background: 'black',
  },
  textOverlay: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: colors.blueGray10,
    color: colors.blueGray100,
    borderRadius: 3,
    letterSpacing: '0.5px',
    fontSize: 10,
    whiteSpace: 'nowrap',
    top: '-10px',
    padding: [3, 4],
    boxShadow: `0 2px 4px 1px rgba(0, 0, 0, 0.08), 0 0 0 0.5px ${colors.blueGray30}`,
  },
});

type Props = {
  applications?: Application[],
  direction?: 'row' | 'column',
  iconSize?: number,
  marginBetweenApps?: number,
  isDockPreview?: boolean,
  onRemove?: (id: string, index: number) => void,
};

/**
 * This Component represent a list of application,
 * @param direction Default if verticaly (column), can be horizontaly (row)
 * Execute remove an app onCLick if onRemove passe
 * @param dockPreview Could have some extra style to be like a dock if enabled
 */
export const ApplicationsList = ({
  applications,
  direction = 'column',
  iconSize = 42,
  marginBetweenApps = 10,
  isDockPreview = false,
  onRemove,
}: Props) => {

  const classes = useStyles({ direction, iconSize, marginBetweenApps, isDockPreview, nbOfApps: applications?.length || 0 });

  const ulRef = React.useRef<HTMLUListElement>(null);

  const usePrevious = (value: Application[] | undefined) => {
    const ref = React.useRef<Application[] | undefined>();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevApplications = usePrevious(applications);

  React.useEffect(() => {
    if (prevApplications && applications && (applications.length > prevApplications.length)) {
      console.log(prevApplications, applications, ulRef);
      ulRef.current && ulRef.current.scrollTo(0, ulRef.current.scrollHeight);

    }
  }, [applications]);

  return (
    <section>
      {
        applications && (
          <div className={classes.applicationListDiv}>
            <ul className={classes.applicationListUl} ref={ulRef}>
              {
                applications.map((application, index) => (
                  <li className={classes.app} key={index}>
                    <img
                      className={classes.appLogo}
                      src={application.iconURL || undefined}
                      alt={application.name || 'logo of app to describe'}
                      style={{ background: application.themeColor }}
                    />
                    {
                      onRemove && (
                        <div className={classes.overlay}>
                          <div className={classes.textOverlay} onClick={() => onRemove(application.id, index)}>
                            <img src="/static/i-cross.svg" alt="remove this app" />
                            { application.computedApplicationURL &&
                              <Tooltip className={classes.tooltip}>{application.computedApplicationURL}</Tooltip>
                            }
                          </div>
                        </div>
                      )
                    }
                  </li>
                ))
              }
            </ul>
          </div>
        )
      }
    </section>
  );
};

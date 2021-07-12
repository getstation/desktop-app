import { Button, SearchInput, ServiceActionType, Size, theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { MinimalApplication } from '../../applications/graphql/withApplications';
import Application from '../../applications/components/Application';

export interface Classes {
  container: string,
  title: string,
  smallSubtitle: string,
  subtitle: string,
  appsContainer: string,
  appsContainerContainer: string,
  buttonsContainer: string,
  hideOverlay: string,
  noResults: string,
}

interface Props {
  classes?: Classes,
  applications: MinimalApplication[],
  selectedApplications: (MinimalApplication & { position?: DOMRect })[],
  onHandleApplicationSelect: (
    application: MinimalApplication,
    iconRef: React.RefObject<HTMLDivElement> | undefined,
  ) => any,
  onValidSubmit: () => any,
  searchInputValue: string,
  handleSearchInputValue: (value: string) => any,
  isLoading: boolean,
}

@injectSheet({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    alignItems: 'flex-start',
    padding: [0, 50, 0, 50],
  },
  title: {
    margin: [10, 0],
    ...theme.titles.h1,
    color: theme.colors.gray.dark,
  },
  appsContainer: {
    width: '100%',
    height: 300,
    marginTop: 20,
    marginBottom: 20,
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    gridTemplateRows: '20% 20% 20% 20% 20%',
  },
  smallSubtitle: {
    ...theme.titles.h3,
    color: theme.colors.gray.middle,
    margin: [20, 0, 20, 10],
    fontStyle: 'italic',
    ...theme.fontMixin(12, 500),
    visibility: ({ selectedApplications }: Props) => selectedApplications.length > 2 ? 'hidden' : 'initial',
  },
  subtitle: {
    ...theme.titles.h3,
    color: theme.colors.gray.middle,
    marginBottom: 40,
  },
  buttonsContainer: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
  },
  noResults: {
    width: 390,
    marginTop: 15,
    textAlign: 'center',
    ...theme.fontMixin(16),
    lineHeight: '25px',
    color: theme.colors.gray.dark,
  },
})
export default class OnboardingStepAppStore extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.handleApplicationSelect = this.handleApplicationSelect.bind(this);
  }

  handleApplicationSelect(application: MinimalApplication, iconRef?: React.RefObject<HTMLDivElement>) {
    this.props.onHandleApplicationSelect(application, iconRef);
  }

  render() {
    const {
      classes, applications, onValidSubmit, searchInputValue, handleSearchInputValue,
      selectedApplications, isLoading,
    } = this.props;

    return (
      <div className={classes!.container}>
        <h1 className={classes!.title}>
          Select your most used applications
        </h1>

        <SearchInput
          value={searchInputValue}
          placeholder="Search an app..."
          onChange={handleSearchInputValue}
        />

        <div className={classes!.appsContainer}>
          {applications.length === 0 &&
            <div className={classes!.noResults}>
              <p>Can’t find your app?</p>
              <p>You can request it later in the app store.</p>
            </div>
          }

          {applications.length > 0 && applications.map((app: MinimalApplication) =>
            <Application
              key={app.id}
              application={app}
              onAdd={this.handleApplicationSelect}
              actionType={selectedApplications.find((a: MinimalApplication) =>
                a.id === app.id) ? ServiceActionType.Remove : ServiceActionType.Add
              }
              getIconRef={true}
            />
          )
          }
        </div>

        <p className={classes!.subtitle}>
          {selectedApplications.length > 14 && 'You have selected 15 apps. '}Don't worry, you can pick more later!
        </p>

        <Button btnSize={Size.BIG} onClick={onValidSubmit} disabled={selectedApplications.length < 3} isLoading={isLoading}>
          Start Station
        </Button>

        <p className={classes!.smallSubtitle}>Select at least 3 apps</p>
      </div>
    );
  }
}

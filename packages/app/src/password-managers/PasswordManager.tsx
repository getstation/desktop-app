import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose, Dispatch } from 'redux';
import * as Immutable from 'immutable';
import { oc } from 'ts-optchain';

import { withGetApplicationById } from './queries@local.gql.generated';
import RemoveLinkBanner from './components/RemoveLinkBanner';
import Banner from './components/Banner';
import Unlock from './components/Unlock';
import AttachPasswordManagerItem from './components/AttachPasswordManagerItem';
import LoadCredentials from './components/LoadCredentials';
import {
  getAccounts,
  getDisplayBanner,
  getDisplayRemoveLinkBanner,
  getLoadingCredentials,
  getPasswordManager,
  getProviderJS,
  getUnlockProcess,
} from './selectors';
import {
  UnlockStep,
  AccountsStep,
  unlock,
  accounts,
  addLink,
  displayBanner,
  AccountsAction,
  displayRemoveLinkBanner,
  removeLink,
} from './duck';
import {
  Provider,
  PasswordManager,
} from './types';
import { getActiveApplicationId } from '../nav/selectors';

export interface InjectedStateProps {
  shouldAttachPasswordManagerItem: boolean,
  shouldDisplayBanner: boolean,
  shouldUnlock: boolean,

  applicationId: string,

  passwordManager: any,
  provider: Provider,
  processAccounts: AccountsAction,

  unlockProcess: any,
  unlockStep: UnlockStep,
  shouldDisplayRemoveLinkBanner: boolean,

  isLoadingCredentials: boolean,
}

interface InjectedDispatchProps {
  onAddPasswordManager: () => void,
  askUnlock: (passwordManager: PasswordManager) => void,
  onUnlock: (passwordManager: PasswordManager, payload: any, webcontentsId: number) => void,
  loadAccounts: (passwordManager: Provider) => void,
  onSelect: (passwordManager: any, applicationId: string, item: any) => void,
  onCancel: (passwordManager: PasswordManager) => void,
  onCancelUnlock: (passwordManager: PasswordManager, exitFromAutofill: boolean) => void,
  onCloseBanner: () => void,
  onCloseRemoveLinkBanner: () => void,
  onRemoveLink: (applicationId: string) => void,
}

interface InjectedGQLProps {
  loading: boolean,
  applicationName: string,
  applicationIcon: string,
  themeColor: string,
  applicationManifestURL: string,
}

export interface OverridableProps {
}

type Props = InjectedStateProps & InjectedDispatchProps & InjectedGQLProps & OverridableProps;

class PasswordManagerImpl extends React.PureComponent<Props, {}> {
  handleOnUnlock = (passwordManager: PasswordManager, payload: object) => {
    const { onUnlock, unlockProcess } = this.props;
    onUnlock(passwordManager, payload, unlockProcess.webContentLink);
  }

  render() {
    const {
      loading,
      shouldAttachPasswordManagerItem,
      shouldDisplayBanner,
      shouldUnlock,
      unlockProcess,
      applicationName,
      applicationManifestURL,
      applicationId,
      applicationIcon,
      themeColor,
      passwordManager,
      provider,
      processAccounts,
      onAddPasswordManager,
      loadAccounts,
      onSelect,
      onCancel,
      onCancelUnlock,
      onCloseBanner,
      onCloseRemoveLinkBanner,
      onRemoveLink,
      shouldDisplayRemoveLinkBanner,
      isLoadingCredentials,
    } = this.props;

    if (loading) return null;

    const exitFromAutofill = processAccounts.step !== AccountsStep.Ask;

    return (
      <div>
        {shouldDisplayRemoveLinkBanner && passwordManager &&
          <RemoveLinkBanner
            applicationName={applicationName}
            passwordManager={passwordManager}
            onRemoveLink={() => onRemoveLink(applicationId)}
            onClose={onCloseRemoveLinkBanner}
          />
        }

        {shouldDisplayBanner &&
          <Banner
            applicationName={applicationName}
            applicationId={applicationId}
            passwordManager={passwordManager}
            provider={provider}
            onAddPasswordManager={() => onAddPasswordManager()}
            onAttachPasswordManagerItem={() => loadAccounts(passwordManager)}
            onClose={onCloseBanner}
          />
        }

        {shouldUnlock &&
          <Unlock
            process={unlockProcess}
            passwordManager={passwordManager}
            onUnlock={this.handleOnUnlock}
            onCancel={() => { onCancelUnlock(passwordManager, exitFromAutofill); }}
            providerName={provider.name}
            applicationName={applicationName}
          />
        }

        {!shouldUnlock && shouldAttachPasswordManagerItem &&
          <AttachPasswordManagerItem
            applicationName={applicationName}
            applicationManifestURL={applicationManifestURL}
            applicationIcon={applicationIcon}
            themeColor={themeColor}
            passwordManager={passwordManager}
            process={processAccounts}
            onSelect={(item) => { onSelect(passwordManager, applicationId, item); }}
            onCancel={() => { onCancel(passwordManager); }}
          />
        }

        {isLoadingCredentials &&
          <LoadCredentials
            applicationName={applicationName}
            applicationIcon={applicationIcon}
            themeColor={themeColor}
            providerName={provider.name}
          />
        }
      </div>
    );
  }
}

const connector = compose(
  connect<InjectedStateProps, InjectedDispatchProps>(
    (state: Immutable.Map<string, any>) => {
      const activeApplicationId = getActiveApplicationId(state)!;
      return {
        shouldUnlock: getUnlockProcess(state).step !== UnlockStep.NotAsked,
        unlockStep: getUnlockProcess(state).step,
        shouldAttachPasswordManagerItem: [AccountsStep.Loaded, AccountsStep.Load].includes(getAccounts(state).step),
        shouldDisplayBanner: getDisplayBanner(state),
        shouldDisplayRemoveLinkBanner: getDisplayRemoveLinkBanner(state),
        isLoadingCredentials: getLoadingCredentials(state),
        unlockProcess: getUnlockProcess(state),
        applicationId: activeApplicationId,
        passwordManager: getPasswordManager(state),
        processAccounts: getAccounts(state),
        provider: getProviderJS(state),
      };
    },
    (dispatch) => bindActionCreators({
      onAddPasswordManager: () => accounts({ step: AccountsStep.WaitConfiguration }),
      askUnlock: (passwordManager: PasswordManager) => unlock({ step: UnlockStep.Ask, passwordManager }),
      onUnlock: (passwordManager: PasswordManager, payload: object, webcontentsId: number) =>
        unlock({ step: UnlockStep.Test, passwordManager, payload, webcontentsId }),
      loadAccounts: (passwordManager: PasswordManager) => accounts({ step: AccountsStep.Ask, passwordManager }),
      onSelect: (passwordManager: any, applicationId: string, item: any) =>
        addLink({ passwordManager, applicationId, passwordManagerItemId: item.id, login: item.username, avatar: item.avatar }),
      onCancel: (passwordManager: PasswordManager) => accounts({ step: AccountsStep.Unload, passwordManager }),
      onCancelUnlock: (passwordManager: PasswordManager, exitFromAutofill) => {
        const step = exitFromAutofill ? UnlockStep.ExitFromAutofill : UnlockStep.Exit;
        return unlock({ step, passwordManager });
      },
      onCloseBanner: () => displayBanner(false),
      onRemoveLink: (applicationId: string) => removeLink({ applicationId }),
      onCloseRemoveLinkBanner: () => displayRemoveLinkBanner(false),
    }, dispatch)
  ),
  withGetApplicationById<InjectedStateProps & InjectedDispatchProps, InjectedGQLProps>({
    options: (props) => ({ variables: { applicationId: props.applicationId } }),
    props: ({ data }) => ({
      loading: !data || data.loading,
      applicationName: oc(data).application.manifestData.name(''),
      applicationIcon: oc(data).application.manifestData.interpretedIconURL()!,
      themeColor: oc(data).application.manifestData.theme_color()!,
      applicationManifestURL: oc(data).application.manifestURL()!,
    }),
  }),
);

export default connector(PasswordManagerImpl);

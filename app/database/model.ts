import * as Sequelize from 'sequelize';
import { defineFavoritesSubdockOrder } from '../ordered-favorites/persistence/model';
import { defineTabsSubdockOrder } from '../ordered-tabs/persistence/model';
import definePasswordManagers from '../password-managers/persistence/model';
import defineUI from '../ui/persistence/model';
import db from './database';

export const App = db.define(
  'app',
  {
    version: {
      type: Sequelize.INTEGER,
      unique: true,
    },
    autoLaunchEnabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    hideMainMenu: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    downloadFolder: {
      type: Sequelize.STRING,
    },
    promptDownload: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    tableName: 'app',
  });

export const Onboarding = db.define(
  'onboarding',
  {
    done: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    appStoreTooltipDisabled: {
      type: Sequelize.BOOLEAN,
    },
    sleepNotification: {
      type: Sequelize.INTEGER,
    },

    // this is not used anymore
    // I did not remove it to not do unnecessary migration
    appInstallationLimitUnlocked: {
      type: Sequelize.BOOLEAN,
    },
    lastInvitationColleagueDate: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: 'onboarding',
  });

export const Tab = db.define(
  'tab',
  {
    tabId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false, // primaryKey does not imply allowNull in SQLite
    },
    applicationId: {
      type: Sequelize.STRING,
      /*references: {
      model: 'application',
      key: 'applicationId'
      }*/
    },
    favicons: {
      type: Sequelize.STRING,
    },
    isApplicationHome: {
      type: Sequelize.BOOLEAN,
    },
    title: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
    lastActivityAt: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: 'tab',
  });

export const Application = db.define(
  'application',
  {
    applicationId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false, // primaryKey does not imply allowNull in SQLite
    },
    manifestURL: {
      type: Sequelize.STRING,
    },
    installContext: {
      type: Sequelize.STRING,
    },
    activeTabId: {
      type: Sequelize.STRING,
      /*    references: {
      model: Tab,
      key: 'tabId'
      }*/
    },
    iconURL: {
      type: Sequelize.STRING,
    },
    // todo(app-323): remove `serviceId`
    serviceId: {
      type: Sequelize.STRING,
    },
    notificationsEnabled: {
      type: Sequelize.BOOLEAN,
    },
    subdomain: {
      type: Sequelize.STRING,
    },
    identityId: {
      type: Sequelize.STRING,
    },
    customURL: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: 'application',
  });

export const Nav = db.define(
  'nav',
  {
    previousTabApplicationId: {
      type: Sequelize.STRING,
    },
    tabApplicationId: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: 'nav',
  });

export const Favorite = db.define(
  'favorite',
  {
    favoriteId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false, // primaryKey does not imply allowNull in SQLite
    },
    applicationId: {
      type: Sequelize.STRING,
    },
    favicons: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: 'favorite',
  });

export const Dock = db.define(
  'dock',
  {
    applicationId: {
      type: Sequelize.STRING,
    },
    order: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: 'dock',
  });

export const User = db.define(
  'user',
  {
    userId: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    picture: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: 'user',
  });

export const UserWeeklyUsage = db.define(
  'userWeeklyUsage',
  {
    timestamp: {
      type: Sequelize.INTEGER,
    },
    order: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: 'userWeeklyUsage',
  });

export const ProfileData = db.define(
  'profileData',
  {
    profileDataId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, // primaryKey does not imply allowNull in SQLite
    },
    displayName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    imageURL: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: 'profileData',
  });

export const Identity = db.define(
  'identity',
  {
    identityId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false, // primaryKey does not imply allowNull in SQLite
    },
    userId: {
      type: Sequelize.STRING,
    },
    provider: {
      type: Sequelize.STRING,
    },
    accessToken: {
      type: Sequelize.STRING,
    },
    refreshToken: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: 'identity',
  });

export const UI = defineUI(db);

export const Subwindow = db.define(
  'subwindow',
  {
    tabId: Sequelize.STRING,
  },
  {
    tableName: 'subwindow',
  });

export const ServicesData = db.define(
  'servicesData',
  {
    manifestURL: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    key: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    value: {
      type: Sequelize.TEXT,
    },
  },
  {
    tableName: 'servicesData',
    indexes: [
      {
        unique: true,
        fields: ['manifestURL', 'key'],
      },
    ],
  });

export const ApplicationSettings = db.define(
  'applicationSettings',
  {
    manifestURL: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    doNotInstall: {
      type: Sequelize.BOOLEAN,
    },
    alwaysLoaded: {
      type: Sequelize.BOOLEAN,
    },
    instanceLogoInDock: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    tableName: 'applicationSettings',
    indexes: [
      {
        unique: true,
        fields: ['manifestURL'],
      },
    ],
  });

export const PasswordManagers = definePasswordManagers(db);

export const TabsSubdockOrder = defineTabsSubdockOrder(db);
export const FavoritesSubdockOrder = defineFavoritesSubdockOrder(db);

Identity.belongsTo(ProfileData, { as: 'profileData', foreignKey: 'profileDataId' });
Application.belongsTo(Identity, { as: 'identity', foreignKey: 'identityId' });

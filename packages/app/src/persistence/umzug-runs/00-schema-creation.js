/* eslint-disable no-unused-vars */

export default {
  up: (query, DataTypes) => {
    const promises = [];
    promises.push(
      query.createTable('app', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        version: {
          type: DataTypes.INTEGER
        },
        autoLaunchEnabled: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }));
    promises.push(
      query.createTable('onboarding', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        done: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }));
    promises.push(
      query.createTable('tab', {
        tabId: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        applicationId: {
          type: DataTypes.STRING
        },
        favicons: {
          type: DataTypes.STRING
        },
        isApplicationHome: {
          type: DataTypes.BOOLEAN
        },
        title: {
          type: DataTypes.STRING
        },
        url: {
          type: DataTypes.STRING
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }));
    promises.push(
      query.createTable('profileData', {
        profileDataId: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        displayName: {
          type: DataTypes.STRING
        },
        email: {
          type: DataTypes.STRING
        },
        imageURL: {
          type: DataTypes.STRING
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }));
    promises.push(
      query.createTable('identity', {
        identityId: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        userId: {
          type: DataTypes.STRING
        },
        provider: {
          type: DataTypes.STRING
        },
        accessToken: {
          type: DataTypes.STRING
        },
        refreshToken: {
          type: DataTypes.STRING
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        profileDataId: {
          type: DataTypes.INTEGER
        }
      }));
    promises.push(
      query.createTable('application', {
        applicationId: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        activeTabId: {
          type: DataTypes.STRING
        },
        iconURL: {
          type: DataTypes.STRING
        },
        serviceId: {
          type: DataTypes.STRING
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        configDataId: {
          type: DataTypes.INTEGER
        }
      }));
    promises.push(
      query.createTable('nav', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        previousTabApplicationId: {
          type: DataTypes.STRING
        },
        tabApplicationId: {
          type: DataTypes.STRING
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }));
    promises.push(
      query.createTable('favorite', {
        favoriteId: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        applicationId: {
          type: DataTypes.STRING
        },
        favicons: {
          type: DataTypes.STRING
        },
        title: {
          type: DataTypes.STRING
        },
        url: {
          type: DataTypes.STRING
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }));
    promises.push(
      query.createTable('dock', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        applicationId: {
          type: DataTypes.STRING
        },
        order: {
          type: DataTypes.INTEGER
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }));
    promises.push(
      query.createTable('user', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        userId: {
          type: DataTypes.STRING
        },
        Auth0UserId: {
          type: DataTypes.STRING
        },
        email: {
          type: DataTypes.STRING
        },
        name: {
          type: DataTypes.STRING
        },
        firstName: {
          type: DataTypes.STRING
        },
        lastName: {
          type: DataTypes.STRING
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }));
    promises.push(
      query.createTable('authOrganization', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        organizationId: {
          type: DataTypes.INTEGER
        },
        slug: {
          type: DataTypes.STRING
        },
        name: {
          type: DataTypes.STRING
        },
        pictureUrl: {
          type: DataTypes.STRING
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }));
    promises.push(
      query.createTable('authToken', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        accessToken: {
          type: DataTypes.STRING
        },
        idToken: {
          type: DataTypes.STRING
        },
        refreshToken: {
          type: DataTypes.STRING
        },
        tokenType: {
          type: DataTypes.STRING
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }));
    promises.push(
      query.createTable('configData', {
        configDataId: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        identityId: {
          type: DataTypes.STRING
        },
        subdomain: {
          type: DataTypes.STRING
        }
      }));
    return Promise.all(promises);
  },
  down: (query, DataTypes) => {
    return query.dropAllTables();
  },
};

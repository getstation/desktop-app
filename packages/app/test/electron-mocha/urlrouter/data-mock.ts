import * as Immutable from 'immutable';

const tabs = {
  'appstore-r1aU-fGh/LkizQOks':{
    isApplicationHome:true,
    applicationId:'appstore-r1aU-fGh',
    canGoForward:false,
    url:'http://localhost:4444/secure',
    tabId:'appstore-r1aU-fGh/LkizQOks',
    isLoading:false,
    title:'My App Store Secure Page',
    favicons:[],
    canGoBack:false,
  },
  'clickup-H16C9XsPM/Bke6A5mjvM':{
    isApplicationHome:true,
    applicationId:'clickup-H16C9XsPM',
    canGoForward:false,
    url:'https://app.clickup.com/55712/60652/d/b?c=81870&s=172472',
    tabId:'clickup-H16C9XsPM/Bke6A5mjvM',
    isLoading:false,
    title:'Current sprint (Board) | Station',
    favicons:[
      'https://app.clickup.com/assets/favicons/favicon-16x16.png',
      'https://app.clickup.com/assets/favicons/favicon-32x32.png',
    ],
    canGoBack:true,
  },
  'github-S1PwoQsDG/Bkq6B5OpM':{
    applicationId:'github-S1PwoQsDG',
    isApplicationHome:false,
    tabId:'github-S1PwoQsDG/Bkq6B5OpM',
    title:'Useful Node.js Tools, Tutorials And Resources — Smashing Magazine',
    url:'https://coding.smashingmagazine.com/2011/09/useful-node-js-tools-tutorials-and-resources/',
    favicons:[
      'https://coding.smashingmagazine.com/images/favicon/favicon.png',
    ],
  },
  'gdrive-mu-BJZ3JYXiPf/Ml3CcWibN':{
    applicationId:'gdrive-mu-BJZ3JYXiPf',
    isApplicationHome:false,
    tabId:'gdrive-mu-BJZ3JYXiPf/Ml3CcWibN',
    title:'A Lifecycle for the Web - Google Drive',
    url:'https://docs.google.com/document/d/1UuS6ff4Fd4igZgL50LDS8MeROVrOfkN13RbiP2nTT9I/edit',
    favicons:[
      'https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico',
    ],
  },
  'gdrive-mu-BJZ3JYXiPf/Sk3CcWiuG':{
    applicationId:'gdrive-mu-BJZ3JYXiPf',
    isApplicationHome:false,
    tabId:'gdrive-mu-BJZ3JYXiPf/Sk3CcWiuG',
    title:'Shared with me - Google Drive',
    url:'https://drive.google.com/drive/shared-with-me',
    favicons:[
      'https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico',
    ],
  },
  'gmail-rJ21YQsPG/S1gh1K7sPz':{
    badge:null,
    isApplicationHome:true,
    applicationId:'gmail-rJ21YQsPG',
    canGoForward:false,
    url:'https://mail.google.com/mail/u/0/#inbox',
    tabId:'gmail-rJ21YQsPG/S1gh1K7sPz',
    isLoading:false,
    title:'Inbox - hugo@getstation.com - Station Mail',
    favicons:[
      'https://www.google.com/a/getstation.com/images/favicon.ico',
    ],
    canGoBack:true,
  },
  'gdrive-mu-BJZ3JYXiPf/BJMnkK7iPz':{
    applicationId:'gdrive-mu-BJZ3JYXiPf',
    isApplicationHome:true,
    tabId:'gdrive-mu-BJZ3JYXiPf/BJMnkK7iPz',
    title:'Shared with me - Google Drive',
    url:'https://drive.google.com/drive/shared-with-me',
    favicons:[
      'https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico',
    ],
  },
  'appstore-r1aU-fGhz/SylpUWMM3z':{
    applicationId:'appstore-r1aU-fGhz',
    isApplicationHome:true,
    tabId:'appstore-r1aU-fGhz/SylpUWMM3z',
    title:'Station • Apps',
    url:'https://apps.getstation.com/',
    favicons:[
      'https://apps.getstation.com/favicon.png',
    ],
  },
  '1password-backoffice-HJeUH6LovG/rJ-8BaLjDz':{
    applicationId:'1password-backoffice-HJeUH6LovG',
    isApplicationHome:true,
    tabId:'1password-backoffice-HJeUH6LovG/rJ-8BaLjDz',
    title:'1Password',
    url:'https://my.1password.com/signin?landing-page=%2Fvaults%2Fwimmnga7euvmwca2kxixchporu%2F005%2Fnlqx5b6irlqdwhenc5zyt7lulu',
    favicons:[
      'https://a.1password.com/app/images/favicon.ico',
    ],
  },
  'gdrive-mu-BJZ3JYXiPf/SJbTIYovf':{
    applicationId:'gdrive-mu-BJZ3JYXiPf',
    isApplicationHome:false,
    tabId:'gdrive-mu-BJZ3JYXiPf/SJbTIYovf',
    title:'1Password beta testers - Google Sheets',
    url:'https://docs.google.com/spreadsheets/d/15GN9xMnuMqcquvPrYrcjYlSGy7jHu2o_aBBOXeJxNPQ/edit#gid=0',
    favicons:[
      'https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png',
    ],
  },
  'gdrive-mu-BJZ3JYXiPf/S1e3M1NXhz':{
    applicationId:'gdrive-mu-BJZ3JYXiPf',
    isApplicationHome:false,
    tabId:'gdrive-mu-BJZ3JYXiPf/S1e3M1NXhz',
    title:'Station - Product Hunt launch listing - Google Sheets',
    url:'https://docs.google.com/spreadsheets/d/1lMaXnc1z3WEy8jr3MgaNEkhO7zps8RUYuLILydLEW5c/edit#gid=397884237',
    favicons:[
      'https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png',
    ],
  },
  'github-S1PwoQsDG/Sy6Wyjg6z':{
    applicationId:'github-S1PwoQsDG',
    isApplicationHome:false,
    tabId:'github-S1PwoQsDG/Sy6Wyjg6z',
    title:'Enhancements for Messenger and WhatsApp by hugomano · Pull Request #430 · getstation/browserX',
    url:'https://github.com/getstation/browserX/pull/430',
    favicons:[
      'https://assets-cdn.github.com/favicon-failure.ico',
    ],
  },
  'gdrive-mu-BJZ3JYXiPf/BJM2JZR3G':{
    isApplicationHome:false,
    applicationId:'gdrive-mu-BJZ3JYXiPf',
    canGoForward:false,
    url:'https://drive.google.com/drive/folders/102n10vWbo6BlAncZaZyxFMXhUfDJnvaW',
    tabId:'gdrive-mu-BJZ3JYXiPf/BJM2JZR3G',
    isLoading:false,
    title:'Office Hunting - Google Drive',
    favicons:[
      'https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico',
    ],
    canGoBack:false,
  },
  'github-S1PwoQsDG/Sk2CCvE6f':{
    applicationId:'github-S1PwoQsDG',
    isApplicationHome:false,
    tabId:'github-S1PwoQsDG/Sk2CCvE6f',
    title:'browserX/DownloadManager.js at master · getstation/browserX',
    url:'https://github.com/getstation/browserX/blob/master/app/downloads/DownloadManager.js#L21',
    favicons:[
      'https://assets-cdn.github.com/favicon.ico',
    ],
  },
  'intercom-BJom-iTuf/rkxiX-ipOf':{
    applicationId:'intercom-BJom-iTuf',
    isApplicationHome:true,
    tabId:'intercom-BJom-iTuf/rkxiX-ipOf',
    title:'Intercom | The easiest way to see and talk to your users',
    url:'https://app.intercom.io/admins/sign_in?redirect_url=https%3A%2F%2Fapp.intercom.io%2Fa%2Fapps%2Fdznlehsz%2Fi' +
    'nbox%2Finbox%2F1532179%2Fconversations%2F15929480452',
    favicons:[
      'https://static.intercomassets.com/assets/favicon-06ecf67d3fb6bd7bf7de78c76f62edae6a3c4bee48aa2877d7403201f0401e78.png',
    ],
  },
  'slite-rkQRtXiPz/S1l70tmjDf':{
    isApplicationHome:true,
    applicationId:'slite-rkQRtXiPz',
    canGoForward:false,
    url:'https://station.slite.com/auth/login',
    tabId:'slite-rkQRtXiPz/S1l70tmjDf',
    isLoading:false,
    title:'Station',
    favicons:[
      'https://cdn.slite.com/favicon/simple.ico',
    ],
    canGoBack:false,
  },
  'github-S1PwoQsDG/HkKBmUJTM':{
    applicationId:'github-S1PwoQsDG',
    isApplicationHome:false,
    tabId:'github-S1PwoQsDG/HkKBmUJTM',
    title:'Security concers · Issue #1 · getstation/sdk',
    url:'https://github.com/getstation/sdk/issues/1',
    favicons:[
      'https://assets-cdn.github.com/favicon.ico',
    ],
  },
  'slack-S18Ut7jDG/ByxILYmjDM':{
    badge:null,
    isApplicationHome:true,
    applicationId:'slack-S18Ut7jDG',
    canGoForward:false,
    url:'https://stationworld.slack.com/messages/C92HQ44J2/convo/C90J73KQB-1525423246.000268/',
    tabId:'slack-S18Ut7jDG/ByxILYmjDM',
    isLoading:false,
    title:'product | Station Slack',
    favicons:[
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlY' +
      'WR5ccllPAAAA2lJREFUeNqMVk1vGkEMndmu4MLmkOWQoCqkh0APqAdUVNpKiXLux/+tFKlSDlEitcm15RI4BBBiucCFjdDUs571eL1L1EEC450d28/P9ujvH7+qbBlj' +
      'FFtaa9SgAN9ij9Xnb/LNdBrKIUn0rNKGKi1vvkpPQqi0syYiIBvlN7lt2kM7C6ErE2gr6BfcpCXO4mg4AURlCg6ZHCIrGuk1Kckp/q20P13u1NknW4E7VMkAreE8ONTL' +
      'EA0Lpep0jDvgSReZIGRQbkSNuBnT0+ggOowP0X3uB0cC1qvu6453Te8lT3/Qv7i8SLfpbDrDN4efh4MPg91ut1gsMBprqYSEY1EledA1fNo+bcN3kiS0HzVgz7pMwGrJ' +
      'hRBs5glS+EuVQbkDZKIoAmHyOEEP2m/s6WmaJsnKRZ5XoijJkIrAWtKG8sP5dNw6ds46Puhmswni+HFsmclKnZe9M0BmiXD4uFavdbod3ERC713PRZDhA2GhJlkmmBuOj' +
      '0vkt+EXbhl5BnY6bzvDT0P1f+v25nb0Z8SZ6rikMwO51gcGf8G7xkEDNtRqtfPLc1Be/7zebreYkv77PghXP65g5ypZWT3RP3ufjIWeOb6A7LPNZrNerymfIE/GE4wS' +
      'KgAZNX2aenIrhwF5jzZCOpg3Ly4jf1bIlozsWF+zpxmxQ+liN81UWBaBMrIjOhpoZwkpBGl0hW0U1vNmvXGFooycHMbHFJY7OO4jwqAB6BOkieMYM9GrW818Oge4CuzU' +
      'DCIqcW4GDsU00iKm0jrrnqFw/+t+uVxyHhZA9jRlZuAvOg5wgyXI8N3NHb55cnoCxgCxh98P6A1gBR/uIkc7LGQ4xx0WFA4lAEAAwuA76Ph85jR82ogJmje7whD37RBf' +
      'OGodYYaJ4GgSMKFZW25BHiiVzwMaOx47KLF6DfPpupAxkFioO99Eiye6GhYRFEZYcdi2Wi0sMYCYJwYCek6fOdC+GRt5zQmlC8wSdGNgiG3RxlX46O8ITfojlBHDkuLwzU' +
      '7cscr1LLqhd5y3hfK8Iogq7lLZ8jZK9zU+9co3KK4P+LnCca9nG8T9RedLXBL8tUUMIGwvojXtc99dthiqLnoWViADNHvvAGL2uROVFtcykZjwhZdFcAJc6TjbwTEM3QAq' +
      '3lP40VSThRxU3U0rgf0nwADpJQebhAz3/AAAAABJRU5ErkJggg==',
      'https://a.slack-edge.com/436da/marketing/img/meta/app-256.png',
    ],
    canGoBack:true,
  },
  'gcalendar-mu-rJmhkKQovf/r1Nhytmswf':{
    isApplicationHome:true,
    applicationId:'gcalendar-mu-rJmhkKQovf',
    canGoForward:false,
    url:'https://calendar.google.com/calendar/r/week',
    tabId:'gcalendar-mu-rJmhkKQovf/r1Nhytmswf',
    isLoading:false,
    title:'Station - Calendar - Week of April 29, 2018',
    favicons:[
      'https://calendar.google.com/googlecalendar/images/favicon_v2014_4.ico',
    ],
    canGoBack:false,
  },
  'github-S1PwoQsDG/Sy4ywcE6M':{
    applicationId:'github-S1PwoQsDG',
    isApplicationHome:false,
    tabId:'github-S1PwoQsDG/Sy4ywcE6M',
    title:'browserX/dialogitem.tsx at 15cfa7516ee239ae79eda627851708fb59b57f28 · getstation/browserX',
    url:'https://github.com/getstation/browserX/blob/15cfa7516ee239ae79eda627851708fb59b57f28/stories/dialogitem.tsx',
    favicons:[
      'https://assets-cdn.github.com/favicon.ico',
    ],
  },
  'github-S1PwoQsDG/Sklv2RwV6f':{
    applicationId:'github-S1PwoQsDG',
    isApplicationHome:false,
    tabId:'github-S1PwoQsDG/Sklv2RwV6f',
    title:'Fix recurring print & download dialog box by MathieuDebit · Pull Request #429 · getstation/browserX',
    url:'https://github.com/getstation/browserX/pull/429/files#diff-ad86f0f989d64fe13d2ac400f75a49d4R211',
    favicons:[
      'https://assets-cdn.github.com/favicon.ico',
    ],
  },
  'linkedIn-SJYMzYu6M/SyWYMfFu6f':{
    applicationId:'linkedIn-SJYMzYu6M',
    isApplicationHome:false,
    tabId:'linkedIn-SJYMzYu6M/SyWYMfFu6f',
    title:'LinkedIn: Log In or Sign Up',
    url:'https://www.linkedin.com/authwall?trk=ripf&trkInfo=AQHBfQVEVqiKkgAAAWMmABZQAti4ob6oNAIn6iYRz1CWezgacL-3K4TRc3qMmnKamzxPibt' +
    'aKiEKJ5k_ItH1fmIK_GoWvMejz_p9KzC1tLCzDoLZm47R1Xv2SDsO-2_5adHWrno=&originalReferer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.c' +
    'om%2Fin%2Fchristophe-hansen-6772b031%2F',
    favicons:[
      'https://static.licdn.com/scds/common/u/images/logos/favicons/v1/favicon.ico',
    ],
  },
  'github-S1PwoQsDG/HkewDomivM':{
    applicationId:'github-S1PwoQsDG',
    isApplicationHome:true,
    tabId:'github-S1PwoQsDG/HkewDomivM',
    title:'GitHub',
    url:'https://github.com/',
    favicons:[
      'https://assets-cdn.github.com/favicon.ico',
    ],
  },
  'linkedIn-SJYMzYu6M/BJeYzft_6f':{
    applicationId:'linkedIn-SJYMzYu6M',
    isApplicationHome:true,
    tabId:'linkedIn-SJYMzYu6M/BJeYzft_6f',
    title:'LinkedIn: Log In or Sign Up',
    url:'https://www.linkedin.com/',
    favicons:[
      'https://static.licdn.com/scds/common/u/images/logos/favicons/v1/favicon.ico',
    ],
  },
  'appear-in-rk1Qvcp6z/Syxy7wqa6z':{
    isApplicationHome: true,
    applicationId: 'appear-in-rk1Qvcp6z',
    canGoForward: false,
    url: 'https://appear.in/meetstation',
    tabId: 'appear-in-rk1Qvcp6z/Syxy7wqa6z',
    isLoading: false,
    title: 'appear.in – one click video conversations',
    favicons: ['https://d32wid4gq0d4kh.cloudfront.net/favicon_v2-196x196.png'],
    canGoBack: false,
  },
  'getstation-app-1/getstation-tab-1': {
    isApplicationHome: true,
    applicationId: 'getstation-app-1',
    url: 'https://getstation.com/',
    tabId: 'getstation-app-1/getstation-tab-1',
    isLoading: false,
    title: 'Station • One app to rule them all',
    favicons: ['https://getstation.com/icons/icon-48x48.png'],
    canGoBack: false,
  },
};

const applications: any = {
  'getstation-app-1': {
    applicationId: 'getstation-app-1',
    activeTab: 'getstation-app-1/getstation-tab-1',
    serviceId: 'getstation',
    manifestURL: 'https://api.getstation.com/application-recipe/2/bxAppManifest.json',
  },
  'appstore-r1aU-fGhz':{
    applicationId:'appstore-r1aU-fGhz',
    activeTab:'appstore-r1aU-fGhz/SylpUWMM3z',
    serviceId:'appstore',
    manifestURL: 'https://api.getstation.com/application-recipe/1/bxAppManifest.json',
  },
  'github-S1PwoQsDG':{
    applicationId:'github-S1PwoQsDG',
    activeTab:'github-S1PwoQsDG/Bkq6B5OpM',
    serviceId:'github',
    manifestURL: 'https://api.getstation.com/application-recipe/39/bxAppManifest.json',
  },
  'slite-rkQRtXiPz':{
    applicationId:'slite-rkQRtXiPz',
    activeTab:'slite-rkQRtXiPz/S1l70tmjDf',
    serviceId:'slite',
    subdomain:'station',
    notificationsEnabled:true,
    manifestURL: 'https://api.getstation.com/application-recipe/27/bxAppManifest.json',
  },
  'gmail-rJ21YQsPG':{
    applicationId:'gmail-rJ21YQsPG',
    activeTab:'gmail-rJ21YQsPG/S1gh1K7sPz',
    iconURL:'https://lh3.googleusercontent.com/-EUEKQqk5sWI/AAAAAAAAAAI/AAAAAAAAAAc/t2afH1kl5eo/photo.jpg',
    serviceId:'gmail',
    identityId:'auth0-google-oauth2-115161776069117227151',
    notificationsEnabled:true,
    manifestURL: 'https://api.getstation.com/application-recipe/14/bxAppManifest.json',
  },
  'clickup-H16C9XsPM':{
    applicationId:'clickup-H16C9XsPM',
    activeTab:'clickup-H16C9XsPM/Bke6A5mjvM',
    serviceId:'clickup',
    manifestURL: 'https://api.getstation.com/application-recipe/378/bxAppManifest.json',
  },
  'gdrive-mu-BJZ3JYXiPf':{
    applicationId:'gdrive-mu-BJZ3JYXiPf',
    activeTab:'gdrive-mu-BJZ3JYXiPf/BJM2JZR3G',
    iconURL:'https://lh3.googleusercontent.com/-EUEKQqk5sWI/AAAAAAAAAAI/AAAAAAAAAAc/t2afH1kl5eo/photo.jpg',
    serviceId:'gdrive-mu',
    identityId:'auth0-google-oauth2-115161776069117227151',
    notificationsEnabled:true,
    manifestURL: 'https://api.getstation.com/application-recipe/16/bxAppManifest.json',
  },
  'slack-S18Ut7jDG':{
    applicationId:'slack-S18Ut7jDG',
    activeTab:'slack-S18Ut7jDG/ByxILYmjDM',
    serviceId:'slack',
    subdomain:'stationworld',
    notificationsEnabled:true,
    manifestURL: 'https://api.getstation.com/application-recipe/21/bxAppManifest.json',
  },
  'linkedIn-SJYMzYu6M':{
    applicationId:'linkedIn-SJYMzYu6M',
    activeTab:'linkedIn-SJYMzYu6M/SyWYMfFu6f',
    serviceId:'linkedIn',
    manifestURL: 'https://api.getstation.com/application-recipe/25/bxAppManifest.json',
  },
  'intercom-BJom-iTuf':{
    applicationId:'intercom-BJom-iTuf',
    activeTab:'intercom-BJom-iTuf/rkxiX-ipOf',
    serviceId:'intercom',
    manifestURL: 'https://api.getstation.com/application-recipe/23/bxAppManifest.json',
  },
  '1password-backoffice-HJeUH6LovG':{
    applicationId:'1password-backoffice-HJeUH6LovG',
    activeTab:'1password-backoffice-HJeUH6LovG/rJ-8BaLjDz',
    serviceId:'1password-backoffice',
    manifestURL: 'https://api.getstation.com/application-recipe/181/bxAppManifest.json',
  },
  'gcalendar-mu-rJmhkKQovf':{
    applicationId:'gcalendar-mu-rJmhkKQovf',
    activeTab:'gcalendar-mu-rJmhkKQovf/r1Nhytmswf',
    iconURL:'https://lh3.googleusercontent.com/-EUEKQqk5sWI/AAAAAAAAAAI/AAAAAAAAAAc/t2afH1kl5eo/photo.jpg',
    serviceId:'gcalendar-mu',
    identityId:'auth0-google-oauth2-115161776069117227151',
    notificationsEnabled:true,
    manifestURL: 'https://api.getstation.com/application-recipe/18/bxAppManifest.json',
  },
  'appear-in-rk1Qvcp6z': {
    applicationId: 'appear-in-rk1Qvcp6z',
    activeTab: 'appear-in-rk1Qvcp6z/Syxy7wqa6z',
    serviceId: 'appear-in',
    manifestURL: 'https://api.getstation.com/application-recipe/150/bxAppManifest.json',
  },
};

const state = Immutable.fromJS({ applications, tabs });

export const getState = () => state;

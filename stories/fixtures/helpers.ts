export const getIconPath = (iconId: string) => {
  switch (iconId) {
    case 'slite':
      return 'https://static.crozdesk.com/web_app_library/providers/logos/000/003/278/original/slite-1511195689-logo.png?1511195689';
    case 'github':
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEPvjnU-pYfXFevkodTno878LQHXeDi9cdb1TGibdWY-ooXw9I';
    case 'airtable':
      return 'https://pageflows.imgix.net/media/logos/logo.jpg?auto=compress&ixlib=python-1.1.2&s=63ed4e95c32b816dfedc5fae0635cb5a';
    default: return '';
  }
};

export const validateEmail = (_email: string) => true;

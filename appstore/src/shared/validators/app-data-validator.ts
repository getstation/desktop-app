import { Visibility } from '@src/app-request/duck';
import { isValidColor } from '@src/shared/validators/color-validator';
import { isValidUrl } from '@src/shared/validators/url-validator';
import { AppDataValidationErrors } from '@src/shared/constants/constants';

export function appDataValidator(themeColor: string, logoURL: string, signinURL: string, visibility?: Visibility) {
  const errors = {
    errorInputColor: '',
    errorLogoURL: '',
    errorSigninURL: '',
  };

  if (visibility !== Visibility.Public) {
    if (!isValidColor(themeColor)) {
      return {
        ...errors,
        errorInputColor: AppDataValidationErrors.AppColor,
      };
    }

    if (!isValidUrl(logoURL)) {
      return {
        ...errors,
        errorLogoURL: AppDataValidationErrors.AppLogo,
      };
    }
  }

  if (!isValidUrl(signinURL)) {
    return {
      ...errors,
      errorSigninURL: AppDataValidationErrors.AppUrl,
    };
  }

  return errors;
}

import { URLSearchParams } from 'url';
import { BX_PROTOCOL } from '../../webui/const';

export const getMultiInstanceConfiguratorURL = (manifestURL: string, applicationId: string): string => {
  const params = new URLSearchParams({ manifestURL, applicationId });
  return `${BX_PROTOCOL}://multi-instance-configurator/?${params.toString()}`;
};

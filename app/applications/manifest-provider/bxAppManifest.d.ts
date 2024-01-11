/**
 * This file is copy/pasted from `getstation/api`.
 * Do not modify it manually.
 */

/**
 * JSON schema for BxApp manifest file
 */
export interface BxAppManifest {
  name?: string;
  category?: string;
  start_url?: string;
  icons?: ImageResource[];
  scope?: string;
  extended_scopes?: string[];
  import?: ExternalApplicationResource[];
  theme_color?: string;
  bx_override_user_agent?: string;
  bx_keep_always_loaded?: boolean;
  bx_not_use_native_window_open_on_host?: boolean;
  bx_no_dock?: boolean;
  bx_use_default_session?: boolean;
  bx_single_page?: boolean;
  bx_multi_instance_config?: MultiInstanceConfig;
  bx_legacy_service_id?: string;
  main?: string;
  renderer?: string;
  /**
   * In BrowserX, the URL to be used when adding a new page. (Not implemented as of today)
   */
  bx_new_page_url?: string;
  recommendedPosition?: number;
  doNotList?: boolean;
}
export interface ImageResource {
  src: string;
  sizes?: string;
  type?: string;
  purpose?: string;
  platform?: string;
}
export interface ExternalApplicationResource {
  platform: string;
  id?: string;
}
export interface MultiInstanceConfig {
  preset?: "subdomain" | "google-account";
  presets?: ("subdomain" | "google-account" | "on-premise")[];
  instance_wording?: string;
  instance_label_tpl?: string;
  start_url_tpl?: string;
  /**
   * In BrowserX, the URL to be used when adding a new page, templated with multi-instance configration variables.
   */
  new_page_url_tpl?: string;
  subdomain_title?: string;
  subdomain_ui_help?: string;
  subdomain_ui_suffix?: string;
}

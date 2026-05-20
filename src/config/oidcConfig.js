import { WebStorageStateStore } from 'oidc-client-ts';

// Use the local proxy prefix for ALL OIDC endpoints to bypass CORS
const proxyBase = window.location.origin + '/idp';

export const oidcConfig = {
  authority: 'https://id.demo.operlity.com', // The logical issuer
  metadataUrl: `${proxyBase}/.well-known/openid-configuration`, // Fetch metadata via proxy
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  post_logout_redirect_uri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI,
  response_type: 'code',
  scope: process.env.REACT_APP_SCOPE || 'openid profile email',
  automaticSilentRenew: true,
  loadUserInfo: true,
  monitorSession: true,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  
  // Explicitly override metadata to use proxy for token and userinfo endpoints
  metadata: {
    issuer: 'https://id.demo.operlity.com',
    authorization_endpoint: 'https://id.demo.operlity.com/connect/authorize', // Direct redirect (CORS not applicable)
    token_endpoint: `${proxyBase}/connect/token`, // Must use proxy
    userinfo_endpoint: `${proxyBase}/connect/userinfo`, // Must use proxy
    end_session_endpoint: 'https://id.demo.operlity.com/connect/endsession', // Direct redirect
    jwks_uri: `${proxyBase}/.well-known/openid-configuration/jwks`, // Must use proxy
  },

  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};
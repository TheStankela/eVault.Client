export const ValidationMessages = {
    Required: 'This field is required.',
    InvalidEmail: 'Enter a valid email address.',
    MinLength: (min: number) => `Minimum length is ${min} characters.`,
    MaxLength: (max: number) => `Maximum length is ${max} characters.`,
  };

export const AuthMessages = {
    LogoutSuccess: 'Logged out succesfully.',
    LoginSuccess: 'Logged in succesfully.',
    InvalidCredentials: 'Email or password is not correct.'
};

export const ResultMessages = {
  Success: 'Logged out succesfully.',
  BadRequest: 'Logged out succesfully.',
  Conflict: 'Logged in succesfully.',
  InternalServerError: 'Logged in succesfully.',
  NotFound: 'Resource not found.',
  UnexpectedError: 'An unexpected error occurred.',
  Forbidden: 'You don’t have permission to access this resource.',
  Unauthorized: 'You are not logged in.'
};

export const HubResources = {
  ConnectionStarted: 'Hub connection established.',
  ConnectionError: 'Error while connecting to the hub.',
  HubConnectionStartedState: 'HubConnectionStarted',
} 
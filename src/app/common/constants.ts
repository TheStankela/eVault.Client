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
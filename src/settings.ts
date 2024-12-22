import { environment } from "./environments/environment";

export const Settings = {
    Production: environment.production,
    Code: environment.code,
    ApiUrl: environment.apiUrl,
    PageSizeOptions: environment.pageSizeOptions
}
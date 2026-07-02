export interface SettingsData {
    base_domain: string;
}

export interface ApiResponse {
    status: string;
    message: string;
    data: SettingsData;
}

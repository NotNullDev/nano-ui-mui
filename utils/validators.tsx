export class AppNameValidator {
  static validate(appName: string): boolean {
    appName = appName.trim();
    return appName.length > 0 && appName.length <= 32;
  }
}

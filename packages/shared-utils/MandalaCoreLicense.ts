export interface LicenseInfo {
  module: string;
  rights: string[];
}

export class MandalaCoreLicense {
  constructor(public holder: string, public license: string) {}

  generateNotice(info: LicenseInfo): string {
    const rights = info.rights.join(', ');
    return `${info.module} licensed to ${this.holder} under ${this.license} (${rights})`;
  }
}

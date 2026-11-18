/**
 * Photos used as Lux3D image-to-3D inputs. All are freely licensed on Wikimedia Commons.
 * Models made from CC BY-SA photos are shared under the same license.
 */
export interface PhotoCredit {
  deviceId: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export const photoCredits: PhotoCredit[] = [
  {
    deviceId: "dell-xps-13",
    title: "Dell XPS 13 (2018)",
    author: "AnVuong1222004",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Dell_XPS_13_(2018).png",
  },
];

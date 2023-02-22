import packageJson from '../../package.json';

export const bannerText = `/**
 * Total Tutorial version ${packageJson.version}
 * (c) 2023 shiwaforce
 * @license see the readme at https://github.com/shiwaforce/total-tutorial/readme.md
*/`;

export const adminBannerText = bannerText.replace(/( version)/, ' admin$1');

import React from 'react';
import styles from './Footer.less';
import getConfig from '@symph/joy/config';
const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();
const Footer = () => (
  <div className={styles.footer}>
    <p>Nekohand Blog ©2014-2020 Tokei. Version {publicRuntimeConfig['NEKOHAND_CMS_VERSION']}</p>
  </div>
);

export default Footer;

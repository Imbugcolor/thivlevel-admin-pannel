import styles from './header.module.css'
import { Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Image from 'next/image';
import React from 'react'
import ThivLevelLogo from '../../../../images/thivlevel-logo-4.png';
import NavigatorLayout from './navigator/NavigatorLayout';
import UserDropdown from './userdropdown/UserDropdown';

export default function HeaderLayout() {
    return (
        <Layout>
            <Header className={styles['header-layout']} style={{ backgroundColor: '#fff' }}>
                <div className="demo-logo" style={{ display: 'flex' }}>
                    <Image src={ThivLevelLogo} width={80} height={0} alt='logo-brand' priority />
                </div>
                <NavigatorLayout />
                <UserDropdown />
            </Header>
        </Layout>
    )
}

'use client'
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import stylesModule from './login.module.css'
import { Button, Checkbox, Form, Grid, Input, theme, Typography } from 'antd'
import React, { useState } from 'react'
import ThivlevelLogo from '../../../images/thivlevel-logo-4.png'
import Image from 'next/image';
import { useAppDispatch } from '@/libs/hooks';
import { setNotify } from '@/libs/features/notifySlice';

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

interface LoginInput {
    email: string
    password: string
    remember: boolean
}

export default function LoginForm() {
    const { token } = useToken();
    const screens = useBreakpoint();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)
  
    const onFinish = async(values: LoginInput) => {
        setLoading(true)
        await fetch(`api/auth`, {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(async(res) => {
            if(!res.ok) {
              const errorData = await res.json();
              console.log(errorData)
              return dispatch(setNotify({ error: errorData.message ? errorData.message : 'Đăng nhập thất bại'}))
            } 
      
            window.location.href = '/';
            dispatch(setNotify({ success: 'Đăng nhập thành công'}))
          })
          .catch(err => {
            console.log(err)
            return dispatch(setNotify({ error: err.message ? err.message : 'Đăng nhập thất bại'}))
          })
          .finally(() => {
            setLoading(false)
          })
      
    };
  
    const styles = {
      container: {
        margin: "0 auto",
        padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
        maxWidth: "390px"
      },
      footer: {
        marginTop: token.marginLG,
        textAlign: "center",
        width: "100%"
      },
      header: {
        marginBottom: token.marginXL,
      },
      section: {
        alignItems: "center",
        backgroundColor: token.colorBgContainer,
        display: "flex",
        height: screens.sm ? "100vh" : "auto",
        padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
      },
      text: {
        color: token.colorTextSecondary
      },
      title: {
        fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3
      }
    };
  
    return (
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.header} className={stylesModule.header}>
            <Image src={ThivlevelLogo} alt='logo' width={80} height={0} priority/>
            <Title style={styles.title}>Sign in</Title>
            <Text style={styles.text}>
              Welcome back to Thivlevel Admin Panel! Please enter your details below to
              sign in.
            </Text>
          </div>
          <Form
            name="normal_login"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
            disabled={loading}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a style={{ float: 'right' }} href="">
                Forgot password?
              </a>
            </Form.Item>
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button block={true} type="primary" htmlType="submit">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    )
}

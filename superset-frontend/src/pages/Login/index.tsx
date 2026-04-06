/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { SupersetClient, styled, t, css } from '@superset-ui/core';
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Typography,
  Icons,
} from '@superset-ui/core/components';
import { useState, useMemo } from 'react';
import { capitalize } from 'lodash/fp';
import getBootstrapData from 'src/utils/getBootstrapData';

// Import ảnh nền tĩnh và ảnh logo
import bgImage from 'src/assets/images/backgroundlogin.jpg';
import logoImage from 'src/assets/images/logoPACHC.png';

const StyledSignInButton = styled(Button)`
  &.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous) {
    position: relative;
    border: none; 
    overflow: hidden;
    z-index: 1;

    > span {
      position: relative;
      z-index: 2;
    }

    &::before {
      content: '';
      background: linear-gradient(135deg, #6253e1, #04befe);
      position: absolute;
      inset: 0;
      opacity: 1;
      transition: all 0.3s;
      border-radius: inherit;
      z-index: 1;
    }

    &:hover::before {
      filter: brightness(1.15);
    }
  }
`;

type OAuthProvider = {
  name: string;
  icon: string;
};

type OIDProvider = {
  name: string;
  url: string;
};

type Provider = OAuthProvider | OIDProvider;

interface LoginForm {
  username: string;
  password: string;
}

enum AuthType {
  AuthOID = 0,
  AuthDB = 1,
  AuthLDAP = 2,
  AuthOauth = 4,
}

const StyledCard = styled(Card)`
  ${({ theme }) => css`
    max-width: 420px;
    width: 100%;
    margin: 0 auto;
    border-radius: 12px;
    color: ${theme.colorText};
    background: ${theme.colorBgContainer};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    
    .ant-form-item-label label {
      color: ${theme.colorPrimary};
    }
    
    /* SỬA TẠI ĐÂY: Can thiệp trực tiếp vào thẻ head của Card để override padding mặc định */
    .ant-card-head {
      padding: 30px 24px 0 24px !important;
    }

    .ant-card-head-title {
      font-size: 18px; 
      font-weight: bold;
      white-space: normal; 
      line-height: 1.4;
      
      border-bottom: 1px solid #d9d9d9; 
      padding-bottom: 12px; 
    }
  `}
`;

const StyledLabel = styled(Typography.Text)`
  ${({ theme }) => css`
    font-size: ${theme.fontSizeSM}px;
  `}
`;

/* ===== CÁC KHỐI GIAO DIỆN MỚI CHO TRANG LOGIN ===== */

const LoginContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000; 

  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; 

  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
`;

const Ribbon = styled.div`
  display: flex;
  align-items: stretch;
  width: 90%;
  max-width: 1050px; 
  max-height: 85vh; 
  position: relative;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    max-height: 95vh;
  }
`;

const LeftPanel = styled.div`
  background-color: #3b60aa; 
  padding: 50px 45px; 
  z-index: 2;
  position: relative;
  box-shadow: 15px 15px 30px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    width: 100%;
    padding: 30px 20px;
  }
`;

const RightPanel = styled.div`
  background-color: #4872c6d9; 
  padding: 40px 50px;
  z-index: 1;
  flex: 1;
  
  margin-top: 40px;
  margin-bottom: 40px;
  margin-left: 0; 
  position: relative;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: -40px;
    left: 0; 
    width: 0;
    height: 0;
    border-bottom: 40px solid #233e75; 
    border-right: 40px solid transparent; 
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -40px;
    left: 0; 
    width: 0;
    height: 0;
    border-top: 40px solid #233e75;
    border-right: 40px solid transparent; 
  }

  @media (max-width: 900px) {
    width: 100%;
    margin-top: 0;
    margin-left: 0;
    &::before, &::after {
      display: none;
    }
  }
`;

/* Giao diện cho ảnh Logo */
const StyledLogo = styled.img`
  width: 100%;
  max-width: 450px; 
  max-height: 350px; 
  object-fit: contain; 
  
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

/* Giao diện cho Slogan */
const LogoSlogan = styled.div`
  font-size: 24px;
  font-style: italic;
  color: #00d2ff; 
  font-family: "Times New Roman", Times, serif;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
  margin-top: 15px; 
  text-align: center;
`;

export default function Login() {
  const [form] = Form.useForm<LoginForm>();
  const [loading, setLoading] = useState(false);

  const bootstrapData = getBootstrapData();
  const nextUrl = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      if (!next || next === '/' || next === '/superset/welcome/') {
        return '/dashboard/list/';
      }
      return next;
    } catch (_error) {
      return '/dashboard/list/';
    }
  }, []);

  const loginEndpoint = useMemo(
    () => (nextUrl ? `/login/?next=${encodeURIComponent(nextUrl)}` : '/login/'),
    [nextUrl],
  );

  const buildProviderLoginUrl = (providerName: string) => {
    const base = `/login/${providerName}`;
    return nextUrl
      ? `${base}${base.includes('?') ? '&' : '?'}next=${encodeURIComponent(nextUrl)}`
      : base;
  };

  const authType: AuthType = bootstrapData.common.conf.AUTH_TYPE;
  const providers: Provider[] = bootstrapData.common.conf.AUTH_PROVIDERS;
  const authRegistration: boolean =
    bootstrapData.common.conf.AUTH_USER_REGISTRATION;

  const onFinish = (values: LoginForm) => {
    setLoading(true);
    SupersetClient.postForm(loginEndpoint, values, '').finally(() => {
      setLoading(false);
    });
  };

  const getAuthIconElement = (
    providerName: string,
  ): React.JSX.Element | undefined => {
    if (!providerName || typeof providerName !== 'string') {
      return undefined;
    }
    const iconComponentName = `${capitalize(providerName)}Outlined`;
    const IconComponent = (Icons as Record<string, React.ComponentType<any>>)[
      iconComponentName
    ];

    if (IconComponent && typeof IconComponent === 'function') {
      return <IconComponent />;
    }
    return undefined;
  };

  return (
    <LoginContainer>
      <Ribbon>
        {/* KHỐI BÊN TRÁI CHỨA FORM */}
        <LeftPanel>
          <StyledCard title={t('HỆ THỐNG BÁO CÁO TẬP ĐOÀN')} padded>
            {authType === AuthType.AuthOID && (
              <Flex justify="center" vertical gap="middle">
                <Form layout="vertical" requiredMark="optional" form={form}>
                  {providers.map((provider: OIDProvider) => (
                    <Form.Item<LoginForm> key={provider.name}>
                      <Button
                        href={buildProviderLoginUrl(provider.name)}
                        block
                        iconPosition="start"
                        icon={getAuthIconElement(provider.name)}
                      >
                        {t('Sign in with')} {capitalize(provider.name)}
                      </Button>
                    </Form.Item>
                  ))}
                </Form>
              </Flex>
            )}

            {authType === AuthType.AuthOauth && (
              <Flex justify="center" gap={0} vertical>
                <Form layout="vertical" requiredMark="optional" form={form}>
                  {providers.map((provider: OAuthProvider) => (
                    <Form.Item<LoginForm> key={provider.name}>
                      <Button
                        href={buildProviderLoginUrl(provider.name)}
                        block
                        iconPosition="start"
                        icon={getAuthIconElement(provider.name)}
                      >
                        {t('Sign in with')} {capitalize(provider.name)}
                      </Button>
                    </Form.Item>
                  ))}

                  {/* Thêm nút đăng nhập Microsoft trực tiếp với style gradient của nút Sign in */}
                  <Form.Item<LoginForm> key="microsoft">
                    <StyledSignInButton
                      href={buildProviderLoginUrl('microsoft')}
                      block
                      type="primary"
                      iconPosition="start"
                      icon={getAuthIconElement('microsoft')}
                      data-test="microsoft-login-button"
                    >
                      {t('Sign in with')} Microsoft
                    </StyledSignInButton>
                  </Form.Item>
                </Form>
              </Flex>
            )}

            {/*
              Phần đăng nhập bằng username/password đã được tạm comment theo yêu cầu
              (không xóa) — nếu cần kích hoạt lại, bỏ comment phần JSX bên dưới.

            {(authType === AuthType.AuthDB || authType === AuthType.AuthLDAP) && (
              <Flex justify="center" vertical gap="middle">
                <Typography.Text type="secondary">
                  {t('Enter your login and password below:')}
                </Typography.Text>
                <Form
                  layout="vertical"
                  requiredMark="optional"
                  form={form}
                  onFinish={onFinish}
                >
                  <Form.Item<LoginForm>
                    label={<StyledLabel>{t('Username:')}</StyledLabel>}
                    name="username"
                    rules={[
                      { required: true, message: t('Please enter your username') },
                    ]}
                  >
                    <Input
                      autoFocus
                      prefix={<Icons.UserOutlined iconSize="l" />}
                      data-test="username-input"
                    />
                  </Form.Item>
                  <Form.Item<LoginForm>
                    label={<StyledLabel>{t('Password:')}</StyledLabel>}
                    name="password"
                    rules={[
                      { required: true, message: t('Please enter your password') },
                    ]}
                  >
                    <Input.Password
                      prefix={<Icons.LockOutlined iconSize="l" />}
                      data-test="password-input"
                    />
                  </Form.Item>
                  <Form.Item label={null}>
                    <Flex
                      css={css`
                        width: 100%;
                      `}
                    >
                      <StyledSignInButton
                        block
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        data-test="login-button"
                      >
                        {t('Sign in')}
                      </StyledSignInButton>

                      {authRegistration && (
                        <Button
                          block
                          type="default"
                          href="/register/"
                          data-test="register-button"
                        >
                          {t('Register')}
                        </Button>
                      )}
                    </Flex>
                  </Form.Item>
                </Form>
              </Flex>
            )}

            */}

            {/* Hiển thị nút đăng nhập Microsoft thay cho form username/password (đóng form) */}
            {(authType === AuthType.AuthDB || authType === AuthType.AuthLDAP) && (
              <Flex justify="center" vertical gap="middle">
                <Typography.Text type="secondary">
                  {t('Sign in using your Microsoft account:')}
                </Typography.Text>
                <Flex
                  css={css`
                    width: 100%;
                  `}
                >
                  <StyledSignInButton
                    block
                    type="primary"
                    href={buildProviderLoginUrl('microsoft')}
                    iconPosition="start"
                    icon={getAuthIconElement('microsoft')}
                    data-test="microsoft-login-button-db"
                  >
                    {t('Sign in with')} Microsoft
                  </StyledSignInButton>
                </Flex>
              </Flex>
            )}
          </StyledCard>
        </LeftPanel>

        {/* KHỐI BÊN PHẢI CHỨA LOGO */}
        <RightPanel>
          <StyledLogo src={logoImage} alt="Pacific Corporation Logo" />
          <LogoSlogan>Tri thức nâng tầm giá trị</LogoSlogan>
        </RightPanel>
      </Ribbon>
    </LoginContainer>
  );
}
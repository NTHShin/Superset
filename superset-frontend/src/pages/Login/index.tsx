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
import rightVisualDefault from 'src/assets/images/leftimage.jpg';

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

const Footer = styled.footer`
  width: 100%;
  text-align: center;
  padding: 12px 0;
  color: ${({ theme }) => theme.colorTextSecondary};
  font-size: 12px;
  user-select: none;
`;

const FooterBox = styled('div')`
  ${({ theme }) => css`
    display: inline-block;
    background: ${theme.colorBgContainer};
    padding: 8px 14px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(2, 6, 23, 0.06);
    border: 1px solid ${theme.colorBorderSecondary};
    color: ${theme.colorTextSecondary};
    font-size: ${theme.fontSizeSM}px;
  `}
`;

const StyledCard = styled(Card)`
  ${({ theme }) => css`
    max-width: 400px;
    width: 100%;
    margin-top: ${theme.marginXL}px;
    color: ${theme.colorBgContainer};
    background: ${theme.colorBgBase};
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    box-shadow: 0 10px 25px rgba(2, 6, 23, 0.08);
    .ant-form-item-label label {
      color: ${theme.colorPrimary};
    }
      .ant-card-head-title {
        font-size: 24px;
        font-weight: bold;
      }
  `}
`;

const StyledLabel = styled(Typography.Text)`
  ${({ theme }) => css`
    font-size: ${theme.fontSizeSM}px;
  `}
`;

export default function Login() {
  const [form] = Form.useForm<LoginForm>();
  const [loading, setLoading] = useState(false);

  const bootstrapData = getBootstrapData();
  const nextUrl = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      // THAY ĐỔI: Nếu không có tham số next hoặc next là trang home, redirect về /dashboard/list/
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

  const rightVisualUrl =
    process.env.REACT_APP_LOGIN_RIGHT_IMAGE ||
    rightVisualDefault;

  const SplitLayout = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    align-items: stretch;
    overflow: hidden;
  `;

  const RightVisual = styled.div`
    ${({ theme }) => css`
      display: none;
      @media (min-width: 1024px) {
        display: block;
        position: absolute;
        left: 24px;
        bottom: 24px;
        width: 120%;
        min-width: 340px;
        height: 108%;
        background-color: ${theme.colorBgContainer};
        z-index: 2;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        border-radius: 12px;
        transform: scale(0.96);
        overflow: hidden;
        box-shadow: 0 8px 22px rgba(2,6,23,0.08);
        transition: transform 200ms ease;
        &::before {
          content: '';
          position: absolute;
          inset: 8px;
          border-radius: 10px;
          background-image: url("${rightVisualUrl}");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          pointer-events: none;
        }
        &::after {
          content: '';
          position: absolute;
          inset: 8px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.04);
          pointer-events: none;
        }
      }
    `}
  `;

  const LeftContent = styled.div`
    width: 65%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 20px 0;
    box-sizing: border-box;

    @media (min-width: 1024px) {
    ${({ theme }) => css`
      flex: 1 1 auto;
      min-width: 0;
      min-height: 100%;
      padding: 36px;
      align-items: center;
      margin-left: 0;
      position: relative;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-color: ${theme.colorBgContainer};
    }
      `}
  `;

  const MainContent = styled.div`
    display: flex;
    flex: 1 1 auto;
    width: 100%;
    gap: 0;
    align-items: stretch;
    justify-content: stretch;
  `;

  const CenterBox = styled.div`
    ${({ theme }) => css`
      width: 75%;
      max-width: 1280px;
      margin: 15px auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      border-radius: 15px;
      overflow: hidden;
      background: ${theme.colorBgContainer};
      box-shadow: 0 12px 30px rgba(2,6,23,0.08);
      min-height: 520px;
      position: relative;

      @media (min-width: 1024px) {
        flex-direction: row;
      }
    `}
  `;

  return (
    <SplitLayout>
      <MainContent>
        <CenterBox>
          <LeftContent>
            <Flex
              justify="start"
              align="center"
              data-test="login-form"
              css={css`
          width: 100%;
          max-width: 520px;
          margin-right: auto;
        `}
            >
              <StyledCard title={t('Welcome back')} padded>
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
                    </Form>
                  </Flex>
                )}

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
              </StyledCard>
            </Flex>
          </LeftContent>
          <RightVisual />

        </CenterBox>
      </MainContent>
      {/* <Footer>
        <FooterBox>© 2025 Pacific Corporation. All rights reserved.</FooterBox>
      </Footer> */}
    </SplitLayout>
  );
}
/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { useMemo } from 'react';
import { MenuItem } from '@superset-ui/core/components/Menu';
import { styled, t } from '@superset-ui/core';
import { Icons } from '@superset-ui/core/components/Icons';
import { Typography } from '@superset-ui/core/components/Typography';

export interface Languages {
  [key: string]: {
    flag: string;
    url: string;
    name: string;
  };
}

interface LanguagePickerProps {
  locale: string;
  languages: Languages;
}

const StyledLabel = styled.div`
  display: flex;
  align-items: center;

  & i {
    margin-right: ${({ theme }) => theme.sizeUnit * 2}px;
  }

  & a {
    display: block;
    width: 150px;
    word-wrap: break-word;
    text-decoration: none;
    cursor: pointer;
  }
`;

// THAY ĐỔI: Hàm xử lý chuyển đổi ngôn ngữ mà không redirect về welcome
const handleLanguageChange = (url: string) => {
  // Lấy URL hiện tại
  const currentPath = window.location.pathname;

  // Parse URL từ backend để lấy query params locale
  const urlObj = new URL(url, window.location.origin);
  const newLocale = urlObj.searchParams.get('locale');

  if (!newLocale) {
    window.location.href = url;
    return;
  }

  // Nếu đang ở trang welcome, chuyển về dashboard
  if (currentPath.includes('/welcome') || currentPath === '/' || currentPath === '/superset/welcome/') {
    window.location.href = `/dashboard/list/?locale=${newLocale}`;
  } else {
    // Giữ nguyên trang hiện tại, chỉ thay đổi locale
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('locale', newLocale);
    window.location.href = currentUrl.toString();
  }
};

export const useLanguageMenuItems = ({
  locale,
  languages,
}: LanguagePickerProps): MenuItem =>
  useMemo(() => {
    const items: MenuItem[] = Object.keys(languages).map(langKey => ({
      key: langKey,
      label: (
        <StyledLabel className="f16">
          <i className={`flag ${languages[langKey].flag}`} />
          {/* THAY ĐỔI: Sử dụng onClick thay vì href để kiểm soát redirect */}
          <Typography.Link
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              handleLanguageChange(languages[langKey].url);
            }}
          >
            {languages[langKey].name}
          </Typography.Link>
        </StyledLabel>
      ),
      style: { whiteSpace: 'normal', height: 'auto' },
    }));

    return {
      key: 'language-submenu',
      type: 'submenu' as const,
      label: (
        <span className="f16" aria-label={t('Languages')}>
          <i className={`flag ${languages[locale].flag}`} />
        </span>
      ),
      icon: <Icons.CaretDownOutlined iconSize="xs" />,
      children: items,
      className: 'submenu-with-caret',
      popupClassName: 'language-picker-popup',
    };
  }, [languages, locale]);
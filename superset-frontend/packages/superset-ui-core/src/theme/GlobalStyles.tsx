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
import { css, useTheme, Global } from '@emotion/react';

export const GlobalStyles = () => {
  const theme = useTheme();
  return (
    <Global
      key={`global-${theme.colorLink}`}
      styles={css`
        // SPA
        html,
        body,
        #app {
          height: 100%;
        }

        body {
          background-color: ${theme.colorBgBase};
          color: ${theme.colorText};
          -webkit-font-smoothing: antialiased;
          margin: 0;
          font-family: ${theme.fontFamily};
        }

        a {
          color: ${theme.colorLink};
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        strong,
        th {
          font-weight: ${theme.fontWeightStrong};
        }

        .echarts-tooltip[style*='visibility: hidden'] {
          display: none !important;
        }

        .no-wrap {
          white-space: nowrap;
        }

        .column-config-popover {
          & .ant-input-number {
            width: 100%;
          }
          && .btn-group svg {
            line-height: 0;
            top: 0;
          }
          & .btn-group > .btn {
            padding: 5px 10px 6px;
          }
        }

        // Overriding bootstrap styles
        #app {
          flex: 1 1 auto;
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        [role='button'] {
          cursor: pointer;
        }

        /* Custom global CSS overrides (from user requests) */
        .superset-nonw36 {
          background-color: #1250AE !important;
          border-bottom: 1px solid #f3f4f6 !important;
          padding: 0 16px !important;
          z-index: 10 !important;
        }

        .superset-7755j1 {
          background-color: #1250AE !important;
          color: white !important;
        }

        .ant-menu-light .ant-menu-item,
        .ant-menu-light .ant-menu-submenu-title {
          color: white !important;
        }

        .superset-1tksnlm {
          font-size: x-large !important;
        }

        .superset-1tksnlm .dynamic-title-input {
          font-weight: bold !important;
        }

        /* Logo replacement: hide original image and use a white-logo background
           - keeps layout height at 40px and inserts a left padded background image
           - also hides any nested <img> to be safe */
        .ant-image-img.superset-sucx7y {
          display: inline-block !important;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          width: 0 !important;
          height: 40px !important;
          padding-left: 100px !important;
          background: url("/static/assets/images/logoPACtrang.png") no-repeat center left !important;
          background-size: contain !important;
          overflow: hidden !important;
        }

        .ant-image-img.superset-sucx7y img {
          display: none !important;
        }
      `}
    />
  );
};

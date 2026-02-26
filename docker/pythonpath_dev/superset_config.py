# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
# This file is included in the final Docker image and SHOULD be overridden when
# deploying the image to prod. Settings configured here are intended for use in local
# development environments. Also note that superset_config_docker.py is imported
# as a final step as a means to override "defaults" configured here
#
import logging
import os
import sys
 
from celery.schedules import crontab
from flask_caching.backends.filesystemcache import FileSystemCache
# from flask_appbuilder.security.manager import AUTH_OAUTH
logger = logging.getLogger()
# AUTH_TYPE = AUTH_OAUTH
DATABASE_DIALECT = os.getenv("DATABASE_DIALECT")
DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_PORT = os.getenv("DATABASE_PORT")
DATABASE_DB = os.getenv("DATABASE_DB")
 
EXAMPLES_USER = os.getenv("EXAMPLES_USER")
EXAMPLES_PASSWORD = os.getenv("EXAMPLES_PASSWORD")
EXAMPLES_HOST = os.getenv("EXAMPLES_HOST")
EXAMPLES_PORT = os.getenv("EXAMPLES_PORT")
EXAMPLES_DB = os.getenv("EXAMPLES_DB")
ENABLE_CORS = True
TALISMAN_ENABLED = False 
WTF_CSRF_ENABLED = False
ENABLE_UI_THEME_ADMINISTRATION = True
BABEL_DEFAULT_LOCALE = 'vi'
# OAUTH_PROVIDERS = [
#     {
#         "name": "azure",               # tên này sẽ xuất hiện trong bootstrap -> UI sẽ show button
#         "icon": "fa-windows",          # optional
#         "token_key": "access_token",
#         "remote_app": {
#             # Nếu chỉ muốn hiển thị button, bạn có thể dùng dummy ID/secret:
#             "client_id": os.environ.get("AZURE_CLIENT_ID", "DUMMY_CLIENT_ID"),
#             "client_secret": os.environ.get("AZURE_CLIENT_SECRET", "DUMMY_SECRET"),
#             "api_base_url": "https://login.microsoftonline.com/common/v2.0",
#             "access_token_url": "https://login.microsoftonline.com/common/oauth2/v2.0/token",
#             "authorize_url": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
#             "client_kwargs": {"scope": "openid profile email"},
#         },
#     }
# ]
CORS_OPTIONS = {
    'supports_credentials': True,
    'allow_headers': ['*'],
    'resources': ['*'],
    'origins': ['*'] # Môi trường Dev thì để *, Prod thì điền IP máy bạn vào
}
LOGO_TARGET_PATH = '/dashboard/list/'
LANDING_PAGE = '/dashboard/list/'
DASHBOARD_RBAC = False
FAB_API_MAX_PAGE_SIZE = 200
FAB_ADD_SECURITY_VIEWS = True
LANGUAGES = {
    'en': {'flag': 'us', 'name': 'English'},
    'vi': {'flag': 'vn', 'name': 'Tiếng Việt'}, 
}
 
 
THEME_DEFAULT = {
    "token": {
        "colorBgBase": "#FEFFFF",
        # ... your theme JSON configuration
    },
    "component": {
        "Button": {
            "colorPrimaryBg": "#e67716",
        },
    },
}
 
# Optional: Dark theme configuration
THEME_DARK = {
    "algorithm": "dark",
    "token": {
        "colorBgBase": "#343232"
        # ... your dark theme overrides
    }
}
THEME_ORANGE = {
    "name": "Orange Theme",  
    "key": "theme_orange",   
    "algorithm": "orange",
 
    "token": {
        "colorBgBase": "#FFC779", 
    },
    "component": {
        "Button": {
            "colorPrimaryBg": "#e67716", 
        },
    },
}
# The SQLAlchemy connection string.
SQLALCHEMY_DATABASE_URI = (
    f"{DATABASE_DIALECT}://"
    f"{DATABASE_USER}:{DATABASE_PASSWORD}@"
    f"{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_DB}"
)
 
SQLALCHEMY_EXAMPLES_URI = (
    f"{DATABASE_DIALECT}://"
    f"{EXAMPLES_USER}:{EXAMPLES_PASSWORD}@"
    f"{EXAMPLES_HOST}:{EXAMPLES_PORT}/{EXAMPLES_DB}"
)
 
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = os.getenv("REDIS_PORT", "6379")
REDIS_CELERY_DB = os.getenv("REDIS_CELERY_DB", "0")
REDIS_RESULTS_DB = os.getenv("REDIS_RESULTS_DB", "1")
 
RESULTS_BACKEND = FileSystemCache("/app/superset_home/sqllab")
 
CACHE_CONFIG = {
    "CACHE_TYPE": "RedisCache",
    "CACHE_DEFAULT_TIMEOUT": 300,
    "CACHE_KEY_PREFIX": "superset_",
    "CACHE_REDIS_HOST": REDIS_HOST,
    "CACHE_REDIS_PORT": REDIS_PORT,
    "CACHE_REDIS_DB": REDIS_RESULTS_DB,
}
DATA_CACHE_CONFIG = CACHE_CONFIG
THUMBNAIL_CACHE_CONFIG = CACHE_CONFIG
 
 
class CeleryConfig:
    broker_url = f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_CELERY_DB}"
    imports = (
        "superset.sql_lab",
        "superset.tasks.scheduler",
        "superset.tasks.thumbnails",
        "superset.tasks.cache",
    )
    result_backend = f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_RESULTS_DB}"
    worker_prefetch_multiplier = 1
    task_acks_late = False
    beat_schedule = {
        "reports.scheduler": {
            "task": "reports.scheduler",
            "schedule": crontab(minute="*", hour="*"),
        },
        "reports.prune_log": {
            "task": "reports.prune_log",
            "schedule": crontab(minute=10, hour=0),
        },
    }
 
 
CELERY_CONFIG = CeleryConfig
 
FEATURE_FLAGS = {"ALERT_REPORTS": True, "TAGGING_SYSTEM": True}
ALERT_REPORTS_NOTIFICATION_DRY_RUN = True
WEBDRIVER_BASEURL = f"http://superset_app{os.environ.get('SUPERSET_APP_ROOT', '/')}/"  # When using docker compose baseurl should be http://superset_nginx{ENV{BASEPATH}}/  # noqa: E501
# The base URL for the email report hyperlinks.
WEBDRIVER_BASEURL_USER_FRIENDLY = (
    f"http://localhost:8888/{os.environ.get('SUPERSET_APP_ROOT', '/')}/"
)
SQLLAB_CTAS_NO_LIMIT = True
 
log_level_text = os.getenv("SUPERSET_LOG_LEVEL", "INFO")
LOG_LEVEL = getattr(logging, log_level_text.upper(), logging.INFO)
 
if os.getenv("CYPRESS_CONFIG") == "true":
    # When running the service as a cypress backend, we need to import the config
    # located @ tests/integration_tests/superset_test_config.py
    base_dir = os.path.dirname(__file__)
    module_folder = os.path.abspath(
        os.path.join(base_dir, "../../tests/integration_tests/")
    )
    sys.path.insert(0, module_folder)
    from superset_test_config import *  # noqa
 
    sys.path.pop(0)
 
#
# Optionally import superset_config_docker.py (which will have been included on
# the PYTHONPATH) in order to allow for local settings to be overridden
#
try:
    import superset_config_docker
    from superset_config_docker import *  # noqa: F403
 
    logger.info(
        f"Loaded your Docker configuration at [{superset_config_docker.__file__}]"
    )
except ImportError:
    logger.info("Using default Docker config...")
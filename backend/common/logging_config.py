# common/logging_config.py

import logging
import os
import sys

from logging.handlers import RotatingFileHandler


def setup_logger(service_name: str):
    logger = logging.getLogger(service_name)

    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)

    os.makedirs("/app/logs", exist_ok=True)

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Console
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)

    # File
    file_handler = RotatingFileHandl
        f"/app/logs/{service_name}.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
    )

    file_handler.setFormatter(formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger
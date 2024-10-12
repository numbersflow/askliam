import logging
import datetime
import pytz

class KSTFormatter(logging.Formatter):
    def formatTime(self, record, datefmt=None):
        # UTC 시간을 한국 시간대(KST)로 변환
        kst = pytz.timezone('Asia/Seoul')
        ct = datetime.datetime.fromtimestamp(record.created, kst)
        return ct.strftime(datefmt) if datefmt else ct.isoformat()

def setup_logger(name):
    # 로거 설정
    formatter = KSTFormatter('%(asctime)s - %(levelname)s - %(message)s', '%Y-%m-%d %H:%M:%S')
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)

    return logger

# 로거 사용
logger = setup_logger(__name__)

import boto3
from botocore.client import Config

from app.core.config import settings


class S3Service:

    def __init__(self):

        self.bucket_name = settings.AWS_S3_BUCKET

        self.client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
            endpoint_url=f"https://s3.{settings.AWS_REGION}.amazonaws.com",
            config=Config(signature_version="s3v4")
        )

    def upload_file(
        self,
        local_file_path: str,
        s3_key: str
    ):

        self.client.upload_file(
            local_file_path,
            self.bucket_name,
            s3_key
        )

        return s3_key

    def download_file(
        self,
        s3_key: str,
        local_file_path: str
    ):

        self.client.download_file(
            self.bucket_name,
            s3_key,
            local_file_path
        )

    def generate_presigned_url(
        self,
        s3_key: str,
        expires_in: int = 3600
    ):

        return self.client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": self.bucket_name,
                "Key": s3_key
            },
            ExpiresIn=expires_in
        )


s3_service = S3Service()
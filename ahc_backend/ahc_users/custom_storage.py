from storages.backends.s3boto3 import S3Boto3Storage


class ImageStorage(S3Boto3Storage):
    import urllib3  # TODO: This is terrible! -DK
    urllib3.disable_warnings()
    bucket_name = 'images'

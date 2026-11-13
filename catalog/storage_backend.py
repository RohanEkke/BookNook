
from urllib.parse import quote

from django.conf import settings
from storages.backends.s3 import S3Storage


class SupabaseMediaStorage(S3Storage):

    def url(self, name):
        filename = quote(name, safe="/")

        return (
            f"{settings.SUPABASE_URL}/storage/v1/object/public/"
            f"book-images/{filename}"
        )

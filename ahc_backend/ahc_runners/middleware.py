from rest_framework.views import Request, Response

from ahc_utils.helpers import unauthorized

from ahc_runners.models import Runner


def fetch_runner_from_request_middleware(get_response):
    def middleware(request: Request) -> Response:
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            auth_header_items = auth_header.split(" ")

            if len(auth_header_items) == 2:
                auth_header_prefix, auth_header_payload = auth_header_items

                if auth_header_prefix == "Runner":
                    runner = Runner.objects.filter(secret=auth_header_payload).first()
                    if runner is not None:
                        request.runner = runner

        return get_response(request)

    return middleware

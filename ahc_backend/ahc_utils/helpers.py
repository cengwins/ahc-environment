from rest_framework.exceptions import APIException


class BasicException(APIException):
    status_code = 400
    default_code = "basic_error"

    def __init__(self, code):
        super().__init__(detail={"code": code})


class UnauthorizedException(APIException):
    status_code = 403
    default_code = "unauthorized"

    def __init__(self, code):
        super().__init__(detail={"code": code})


class PostFieldNotExistsException(APIException):
    status_code = 400
    default_detail = "Missing Field"
    default_code = "missing_field"

    def __init__(self, field):
        super().__init__(detail={"code": self.default_code, "field": field})


def check_fields(data, fields):
    for f in fields:
        if f not in data:
            raise PostFieldNotExistsException(f)

    return True


def bad_request(code):
    raise BasicException(code)


def unauthorized(code):
    raise UnauthorizedException(code)

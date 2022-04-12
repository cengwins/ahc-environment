from rest_framework.permissions import BasePermission


class IsAuthenticatedOrPOST(BasePermission):
    def has_permission(self, request, view):
        return request.method in ["POST"] or (
            request.user and request.user.is_authenticated
        )

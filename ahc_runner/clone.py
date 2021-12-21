import os

import git


class CloneProgress(git.RemoteProgress):
    def update(self, op_code, cur_count, max_count=None, message=""):
        if message:
            print(message)


if __name__ == "__main__":
    upstream_url = os.environ.get("GIT_UPSTREAM_URL", "")

    if not upstream_url:
        raise ValueError("GIT_UPSTREAM_URL should not be null")
    else:
        print(f"Cloning {upstream_url}")

        git.Repo.clone_from(upstream_url, "tmp_repo", progress=CloneProgress())


from multiprocessing import cpu_count


def max_workers():
    return cpu_count() * 2 + 1


bind = "unix:{{ remote_project_url }}/my_sock.sock"
workers = max_workers()


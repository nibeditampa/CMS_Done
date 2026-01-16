# core/responses.py
# Sends HTTP responses back to the client

import json
from core.middleware import add_cors_headers


def send_json(handler, status, data):
    handler.send_response(status)
    add_cors_headers(handler)
    handler.send_header("Content-Type", "application/json")
    handler.end_headers()
    handler.wfile.write(json.dumps(data).encode("utf-8"))


def send_html(handler, status, html):
    handler.send_response(status)
    add_cors_headers(handler)
    handler.send_header("Content-Type", "text/html")
    handler.end_headers()
    handler.wfile.write(html.encode("utf-8"))


def send_404(handler):
    send_html(handler, 404, "<h1>404 - Resource Not Found</h1>")


def send_400(handler, message="Bad Request"):
    send_json(handler, 400, {"error": message})


def send_500(handler, message="Internal Server Error"):
    send_json(handler, 500, {"error": message})

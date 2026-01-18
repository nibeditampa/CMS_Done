# Starts the API server and initializes the database
import os
from http.server import ThreadingHTTPServer
from router import ClinicRouter
from database.connection import init_database

def main():
    init_database()
    
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("0.0.0.0", port), ClinicRouter)
    
    print(f"🚀 Server running at http://localhost:{port}")
    server.serve_forever()

if __name__ == "__main__":
    main()
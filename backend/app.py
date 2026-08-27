import os
from flask import Flask, jsonify
from flask_cors import CORS
from backend.config import Config

# Validate environment variables on startup
Config.validate()

app = Flask(__name__)

# Enable CORS explicitly for the React Vite dev server origin and deployed production URL
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
if frontend_url == "*":
    CORS(app, resources={r"/api/*": {"origins": "*"}})
else:
    origins = [orig.strip() for orig in frontend_url.split(",")]
    if "http://localhost:5173" not in origins:
        origins.append("http://localhost:5173")
    CORS(app, resources={r"/api/*": {"origins": origins}})

# Import blueprints
from backend.routes.query import query_bp
from backend.routes.standards import standards_bp
from backend.routes.admin import admin_bp

# Register blueprints
app.register_blueprint(query_bp, url_prefix="/api")
app.register_blueprint(standards_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api")

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "online",
        "service": "BIS-SAARTHI Backend Service",
        "problem_statement": "SIH26107"
    })

if __name__ == "__main__":
    port = Config.PORT
    debug = Config.DEBUG
    print(f"Starting BIS-SAARTHI Flask server on port {port} in {'DEBUG' if debug else 'PRODUCTION'} mode...")
    app.run(host="0.0.0.0", port=port, debug=debug)

#!/usr/bin/env python3
"""
Local Test Server for AACC D1 Extension Portal
Run this to test the website locally before deployment
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

def start_test_server():
    """Start a local HTTP server for testing"""
    
    # Change to website directory
    website_dir = Path(__file__).parent
    os.chdir(website_dir)
    
    # Configuration
    PORT = 8080
    Handler = http.server.SimpleHTTPRequestHandler
    
    # Add CORS headers for local testing
    class CORSRequestHandler(Handler):
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            super().end_headers()
    
    # Start server
    try:
        with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
            url = f"http://localhost:{PORT}"
            
            print("=" * 50)
            print("🎓 AACC D1 Extension Portal - Test Server")
            print("=" * 50)
            print(f"📍 Server running at: {url}")
            print(f"📁 Serving from: {website_dir}")
            print(f"🔐 Access: Password protected (contact AACC IT)")
            print("=" * 50)
            print("⚠️  This is for testing only!")
            print("   Deploy to HTTPS server for production use.")
            print("=" * 50)
            print("Press Ctrl+C to stop the server")
            print()
            
            # Open browser automatically
            try:
                webbrowser.open(url)
                print(f"🌐 Opened {url} in your default browser")
            except:
                print(f"📝 Manually open {url} in your browser")
            
            print()
            print("🔧 Testing Checklist:")
            print("  □ Password protection works")
            print("  □ Main interface loads correctly")
            print("  □ Download button functions") 
            print("  □ Update checking works")
            print("  □ Mobile responsive design")
            print("  □ FAQ sections expand/collapse")
            print()
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Port already in use
            print(f"❌ Port {PORT} is already in use")
            print("   Try stopping other servers or use a different port")
        else:
            print(f"❌ Error starting server: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    # Check if we're in the right directory
    if not Path("index.html").exists():
        print("❌ Error: index.html not found")
        print("   Make sure you're running this from the website directory")
        sys.exit(1)
    
    start_test_server()
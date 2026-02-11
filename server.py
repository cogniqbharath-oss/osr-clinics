import http.server
import socketserver
import json
import os
from urllib.parse import urlparse, parse_qs

PORT = 8001

class OSRHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        """Serve static files"""
        return super().do_GET()
    
    def do_POST(self):
        """Handle chatbot API requests"""
        if self.path == '/api/chat':
            try:
                # Read request body
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
                
                messages = request_data.get('messages', [])
                
                # Simple response logic for local testing
                # In production, this would call the Gemini API
                user_message = messages[-1]['content'].lower() if messages else ""
                
                # Basic keyword-based responses for demo
                if 'adhd' in user_message or 'assessment' in user_message:
                    response_text = "Our ADHD assessments are comprehensive evaluations conducted by experienced psychologists. We go beyond simple checklists to understand all aspects of behavior, challenges, and strengths. Would you like to book a free initial consultation? Visit osrclinics.com/book or call (519) 419-1484."
                elif 'book' in user_message or 'appointment' in user_message:
                    response_text = "You can book your free initial consultation online at https://www.osrclinics.com/book or call us at:\n- Windsor: (519) 419-1484\n- London: (519) 850-0464\n- Toronto: (226) 908-3452\n\nWe offer both in-person and virtual appointments across Ontario!"
                elif 'hour' in user_message or 'time' in user_message or 'open' in user_message:
                    response_text = "We're open Monday through Friday, 9:00 AM to 9:00 PM. Weekend appointments can be arranged. Would you like to schedule a free consultation?"
                elif 'location' in user_message or 'where' in user_message:
                    response_text = "We have 6 convenient locations across Ontario:\n- Windsor: 245 Tecumseh Rd W\n- London: 111 Waterloo St, Unit 610\n- Toronto: 3335 Yonge St, Unit 403\n- Chatham: 41 Grand Ave West\n- Sarnia: 429 Exmouth St, Unit 209\n- Kitchener\n\nWe also offer virtual appointments province-wide!"
                elif 'neurofeedback' in user_message or 'qeeg' in user_message:
                    response_text = "Our qEEG-guided neurofeedback is a non-invasive, science-backed approach to retrain the brain for optimal function. It's effective for ADHD, PTSD, burnout, and performance optimization - all without medication. Would you like to learn more or book a consultation?"
                elif 'wsib' in user_message or 'work injury' in user_message:
                    response_text = "We offer the WSIB Community Mental Health Program (CMHP) for work-related injuries and illnesses. This includes support for emotional toll, PTSD, and return-to-work planning. Contact us to discuss your eligibility and how we can help."
                elif 'therapy' in user_message or 'counseling' in user_message:
                    response_text = "We provide individual therapy for anxiety, depression, trauma, life transitions, and personal growth. We also offer couples and family therapy. Our compassionate therapists work with adults, teens, and families. Book your free consultation at osrclinics.com/book"
                elif 'virtual' in user_message or 'online' in user_message:
                    response_text = "Yes! We offer secure virtual appointments across all of Ontario. Our online therapy provides the same quality care from the comfort of your home. Book online at osrclinics.com/book"
                elif 'cost' in user_message or 'price' in user_message or 'fee' in user_message:
                    response_text = "We offer a FREE initial consultation to discuss your needs and treatment options. For specific pricing information, please visit our website at osrclinics.com/fees or call us at (519) 419-1484."
                else:
                    response_text = "Thank you for reaching out to OSR Clinics. We provide comprehensive mental health services including ADHD assessments, individual therapy, neurofeedback, and WSIB support across Ontario. How can I help you today? You can also book a free consultation at osrclinics.com/book or call (519) 419-1484."
                
                # Send response
                response = {
                    'response': response_text
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                print(f"Error handling chat request: {e}")
                error_response = {
                    'response': "I'm having trouble connecting. Please call us at (519) 419-1484 or book online at osrclinics.com/book"
                }
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(error_response).encode('utf-8'))
        else:
            self.send_error(404, "Not Found")
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), OSRHandler) as httpd:
        print(f"OSR Clinics website running at http://localhost:{PORT}")
        print(f"Chatbot API available at http://localhost:{PORT}/api/chat")
        print(f"\nPress Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped")

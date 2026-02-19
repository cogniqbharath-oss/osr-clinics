import urllib.request
import re

url = "https://www.osrclinics.com/"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
    css_links = re.findall(r'<link[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\']', html, re.IGNORECASE)
    print("CSS Links:")
    for link in css_links:
        print(link)

except Exception as e:
    print(f"Error: {e}")

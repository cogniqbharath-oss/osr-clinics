import urllib.request
import re
import os

url = "https://www.osrclinics.com/"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
    # Look for icon links
    icon_links = re.findall(r'<link[^>]*rel=["\'](?:shortcut )?icon["\'][^>]*href=["\']([^"\']+)["\']', html, re.IGNORECASE)
    
    print("Found Icon Links:", icon_links)
    
    if icon_links:
        favicon_url = icon_links[0]
        # Handle relative URLs if necessary (though usually they are absolute or relative to root)
        if not favicon_url.startswith('http'):
             # Simplistic join, might need full urljoin
             if favicon_url.startswith('/'):
                 favicon_url = "https://www.osrclinics.com" + favicon_url
             else:
                 favicon_url = "https://www.osrclinics.com/" + favicon_url
                 
        print(f"Downloading from: {favicon_url}")
        
        # Determine extension
        ext = os.path.splitext(favicon_url)[1]
        if not ext:
            ext = ".ico" # default
            
        save_path = f"assets/osr_favicon{ext}"
        
        # Download
        try:
             req_img = urllib.request.Request(favicon_url, headers={'User-Agent': 'Mozilla/5.0'})
             with urllib.request.urlopen(req_img) as img_resp, open(save_path, 'wb') as f:
                 f.write(img_resp.read())
             print(f"Saved to {save_path}")
        except Exception as e:
            print(f"Failed to download: {e}")

    else:
        # Try default location
        print("No link tag found, trying default /favicon.ico")
        try:
            default_url = "https://www.osrclinics.com/favicon.ico"
            save_path = "assets/osr_favicon.ico"
            req_img = urllib.request.Request(default_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req_img) as img_resp, open(save_path, 'wb') as f:
                 f.write(img_resp.read())
            print(f"Saved to {save_path}")
        except Exception as e:
            print(f"Failed to fetch default favicon: {e}")

except Exception as e:
    print(f"Error: {e}")

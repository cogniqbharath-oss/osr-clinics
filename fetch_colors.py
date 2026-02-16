import urllib.request
import re

url = "https://www.osrclinics.com/"
try:
    with urllib.request.urlopen(url) as response:
        html = response.read().decode('utf-8')
        
    # Find hex colors
    hex_colors = re.findall(r'#[0-9a-fA-F]{6}', html)
    # Find CSS links
    css_links = re.findall(r'href="([^"]+\.css)"', html)
    
    print("Found Hex Colors (Top 10):", hex_colors[:10])
    print("Found CSS Links:", css_links)
    
    # Simple analysis of most common colors might help if they use inline styles
    from collections import Counter
    print("Most common colors:", Counter(hex_colors).most_common(5))

except Exception as e:
    print(f"Error: {e}")

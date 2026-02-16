import urllib.request
import re
from collections import Counter

url = "https://www.osrclinics.com/"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
    hex_colors = re.findall(r'#[0-9a-fA-F]{6}', html)
    unique_colors = Counter(hex_colors).most_common(10)
    
    print("Top 10 Colors Found:")
    for color, count in unique_colors:
        print(f"{color}: {count}")
        
    # Also look for rgba and rgb
    rgb_colors = re.findall(r'rgb\(\d+,\s*\d+,\s*\d+\)', html)
    print("RGB Colors:", rgb_colors[:5])

except Exception as e:
    print(f"Error: {e}")

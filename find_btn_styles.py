import urllib.request
import re

url = "https://www.osrclinics.com/"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
    # Search for button style patterns
    btn_styles = re.findall(r'style="[^"]*background-color:\s*(#[0-9a-fA-F]+|rgb\([^)]+\))[^"]*"', html)
    print("Button/Element internal styles found:", btn_styles)
    
    # Search for classes and see if we can find hex codes near "button" or "btn"
    # This is rough but might give clues
    near_btn = re.findall(r'class="[^"]*button[^"]*".*?(#[0-9a-fA-F]{6})', html, re.DOTALL)
    print("Colors near button classes:", near_btn)

except Exception as e:
    print(f"Error: {e}")

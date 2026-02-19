import re
from collections import Counter

try:
    with open("osr_home.html", "r", encoding="utf-8") as f:
        html = f.read()
    
    # Find all hex colors
    colors = re.findall(r'#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}', html)
    # Find all rgb colors
    rgb_colors = re.findall(r'rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)', html)
    
    all_colors = colors + rgb_colors
    common = Counter(all_colors).most_common(20)
    
    print("Most common colors found in HTML:")
    for color, count in common:
        print(f"{color}: {count}")

except Exception as e:
    print(f"Error: {e}")

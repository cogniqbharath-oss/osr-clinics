import urllib.request

url = "https://www.osrclinics.com/"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    
    with open("osr_home.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Saved to osr_home.html")

except Exception as e:
    print(f"Error: {e}")

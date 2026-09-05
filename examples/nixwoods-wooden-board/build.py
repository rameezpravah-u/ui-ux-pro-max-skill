import base64, re, pathlib, sys
root = pathlib.Path(__file__).parent
tpl = (root/"template.html").read_text()
cache = {}
def sub(m):
    n = m.group(1)
    if n not in cache:
        cache[n] = "data:image/jpeg;base64," + base64.b64encode((root/"img"/(f"{n}.png" if (root/"img"/f"{n}.png").exists() else f"{n}.jpg")).read_bytes()).decode()
    return cache[n]
out = re.sub(r"\{\{IMG:(\w+)\}\}", sub, tpl)
(root/"nixwoods-one-of-one.html").write_text(out)
print("images used:", sorted(cache), "\nbytes:", len(out.encode()))

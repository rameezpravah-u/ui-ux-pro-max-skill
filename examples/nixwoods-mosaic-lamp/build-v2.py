import base64, re, pathlib
root = pathlib.Path(__file__).parent; imgdir = root/"img"
tpl = (root/"template-v2.html").read_text(); cache = {}
def sub(m):
    n = m.group(1)
    if n not in cache:
        f = imgdir/f"{n}.png" if (imgdir/f"{n}.png").exists() else imgdir/f"{n}_w.jpg"
        mime = "image/png" if f.suffix==".png" else "image/jpeg"
        cache[n] = f"data:{mime};base64," + base64.b64encode(f.read_bytes()).decode()
    return cache[n]
out = re.sub(r"\{\{IMG:(\w+)\}\}", sub, tpl)
(root/"nixwoods-cube-lamp-v2.html").write_text(out); print("images", sorted(cache), "bytes", len(out.encode()))

import re, pathlib, base64
head = pathlib.Path("template4_head.html").read_text(); body = pathlib.Path("template4_body.html").read_text()
CDN = "https://cdn.shopify.com/s/files/1/0650/8488/3079/files/"
IMG = {
 "flowers":"Rubik_s_Cube_Table_Lamp___Nixwoods_AD07YL8MFH_2026-04-26_7.webp?v=1787927659",
 "ocean_front":"3f95ddd8-34e7-4529-b6a4-fec95ae30809_4b9058f1-06e5-40fc-9b5b-38ced1b42bf0.jpg?v=1787776242",
 "base_nx":"cf513aa2-3dc9-4449-8a79-29c51759adb7_c02708a0-ee99-4296-a34e-b83f69116be1.jpg?v=1787776242",
 "red":"AC4I9835_1.jpg?v=1787776244",
 "gold":"AC4I9838_4b261224-e303-4706-a21a-71658def78a7.jpg?v=1787776245",
 "console":"Rubik_s_Cube_Table_Lamp___Nixwoods_FOG8496565_2026-04-26_9.webp?v=1787776244",
 "amber":"AC4I9835_7cefaa3f-9805-4706-a138-99df15b5e8d1.jpg?v=1787776246",
 "four":"6ba58080-3cf5-4bbb-a7e2-ada6b1215824_ba8713a1-3e05-4945-8f24-8184e593d61b.jpg?v=1787776245",
 "bubble":"BubbleLamp.webp?v=1787776245",
}
VAR = {"candy":"44575253430407","ocean":"44575253463175","bubble":"45649363763335"}
HANDLE = "rubiks-cube-table-lamp-sheesham-wood"
def img(m):
    n = m.group(1)
    if n == "green":  # simulated frame, not on the CDN yet
        return "data:image/jpeg;base64," + base64.b64encode(pathlib.Path("cube/green_w.jpg").read_bytes()).decode()
    return CDN + IMG[n] + "&width=1200"

# ---- CSS: take the stylesheet, scope every rule under .nxl, drop html/body/title rules
css = re.search(r"<style>(.*)</style>", head, re.S).group(1)
css = css.replace(":root{", ".nxl{").replace(":root:not([data-theme=\"dark\"])", ".nxl").replace(":root[data-theme=\"light\"]", ".nxl")
css = re.sub(r"\n\s*html\{[^}]*\}", "", css)
css = re.sub(r"\n\s*body\{[^}]*\}", "\n  .nxl{margin:0;overflow-x:clip;background:var(--ground);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased}", css)
css = re.sub(r"\*,\*::before,\*::after\{box-sizing:border-box\}", ".nxl *,.nxl *::before,.nxl *::after{box-sizing:border-box}", css)
css = css.replace("@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none !important;transition:none !important}html{scroll-behavior:auto}}", "@media (prefers-reduced-motion:reduce){.nxl *,.nxl *::before,.nxl *::after{animation:none !important;transition:none !important}}")
def scope(block):
    out = []; i = 0; n = len(block)
    while i < n:
        j = block.find("{", i)
        if j < 0: break
        sel = block[i:j].strip()
        if sel.startswith("@media") or sel.startswith("@supports"):
            depth = 1; k = j + 1
            while k < n and depth: depth += (block[k] == "{") - (block[k] == "}"); k += 1
            out.append(sel + "{" + scope(block[j+1:k-1]) + "}"); i = k; continue
        if sel.startswith("@keyframes") or sel.startswith("@font-face") or sel.startswith("@import"):
            k = block.find("}", j)
            if sel.startswith("@keyframes"):
                depth = 1; k = j + 1
                while k < n and depth: depth += (block[k] == "{") - (block[k] == "}"); k += 1
                out.append(block[i:k]); i = k; continue
            out.append(block[i:k+1]); i = k + 1; continue
        k = block.find("}", j)
        decl = block[j+1:k]
        parts = [p.strip() for p in sel.split(",")]
        scoped = ",".join(p if p.startswith(".nxl") else (".nxl " + p if not p.startswith(".nxl") else p) for p in parts)
        out.append(scoped + "{" + decl + "}"); i = k + 1
    return "\n".join(out)
# keep keyframes unprefixed but prefix everything else
css = scope(css)
css = css.replace(".nxl .nxl{", ".nxl{").replace(".nxl .nxl *", ".nxl *")
# theme resets so Trade's global styles don't leak in
css = ".nxl h1,.nxl h2,.nxl h3{text-transform:none;letter-spacing:-.015em;margin:0;padding:0}\n.nxl p,.nxl ul{margin:0;padding:0;letter-spacing:0}\n.nxl{letter-spacing:0}\n.nxl a{color:inherit}\n.nxl button,.nxl .btn{font:inherit;line-height:1.3;letter-spacing:0;text-transform:none;min-height:0;box-shadow:none}\n.nxl img{max-width:100%;height:auto}\n.nxl .mbar{z-index:60}\n" + css
fonts = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter:wght@400;500;600&display=swap');\n"

# ---- HTML: drop nav, footer, exit sheet; keep hero, buy, reviews, moods, final, sticky bar, toast
def cut(s, a, b):
    i = s.find(a); j = s.find(b, i) + len(b); return s[:i] + s[j:] if i >= 0 else s
b = body
b = cut(b, '<nav class="nav"', '</nav>\n')
b = cut(b, '<footer>', '</footer>\n')
b = cut(b, '<div class="exit" id="exit"', '</form>\n</div>\n')
# dropped items: pincode, gift, COD fee
b = cut(b, '          <div>\n            <div class="pin">', '          </div>\n')
b = cut(b, '          <label class="gift">', '</label>\n')
b = b.replace("UPI · cards · EMI · cash on delivery. Pay when it's in your hands: ₹99 COD handling, prepaid ships free.", "UPI · cards · EMI · cash on delivery. Prepaid orders ship free across India.")
b = b.replace('<span class="vslot">Slot · ad video 1782913546236934</span>\n', '')
b = b.replace('<a class="btn btn-amber" href="#buy">Choose your glass</a>', '<a class="btn btn-amber" href="#nxl-buy">Choose your glass</a>').replace('id="buy"', 'id="nxl-buy"').replace('href="#buy"', 'href="#nxl-buy"')
# real cart actions
b = b.replace('var PAIR2 = 2499, cur = FIN[0], qty = 1, cart = 0, gi = 0;', 'var VAR = {candy:"44575253430407", ocean:"44575253463175", bubble:"45649363763335"}, HANDLE = "rubiks-cube-table-lamp-sheesham-wood";\n  var PAIR2 = 2499, cur = FIN[0], qty = 1, cart = 0, gi = 0;')
b = re.sub(r'function add\(\)\{.*?\}\n', 'function add(){ var n = qty * ($("pairChk").checked ? 2 : 1); window.location.href = "/cart/add?id=" + VAR[cur.id] + "&quantity=" + n; }\n', b, flags=re.S)
b = b.replace('$("buyNow").addEventListener("click", function(){ toast("Taking you to checkout: " + inr(total())); });', '$("buyNow").addEventListener("click", function(){ window.location.href = "/products/" + HANDLE + "?variant=" + VAR[cur.id]; });')
b = b.replace('cart += n; $("cartCount").textContent = cart;', '')
# remove code that referenced removed elements
b = re.sub(r'  // dispatch \+ pincode.*?\$\("pinIn"\)\.addEventListener\([^\n]*\n', '', b, flags=re.S)
b = re.sub(r'  \$\("giftChk"\)\.addEventListener[^\n]*\n', '', b)
b = re.sub(r'  // exit capture.*?toast\("Sent\. Check WhatsApp in a minute\."\); \}\);\n', '', b, flags=re.S)
b = b.replace('document.querySelector(".nav-buy").textContent = "Buy · " + inr(cur.price);', '')
b = re.sub(r"\{\{IMG:(\w+)\}\}", img, b)
b = b.replace('<a class="btn btn-ghost" href="https://wa.me/919286001060?text=Can%20I%20see%20the%20cube%20lamp%20on%20a%20video%20call%3F" target="_blank" rel="noopener">See it live on a video call</a>', '<a class="btn btn-ghost" href="https://wa.me/919286001060?text=Can%20I%20see%20the%20cube%20lamp%20on%20a%20video%20call%3F" target="_blank" rel="noopener">See it live on a video call</a>')
# pair copy honest about mechanism
b = b.replace('<span>One for each bedside. Second lamp at ₹2,499.</span>', '<span>One for each bedside. Adds two; the pair price applies at checkout.</span>')
page = "<!-- NixWoods cube lamp page. Paste into Online Store > Pages > (page) > Show HTML. Everything is scoped under .nxl -->\n<style>\n" + fonts + css + "\n</style>\n<div class=\"nxl\">\n" + b.strip() + "\n</div>\n"
pathlib.Path("nixwoods-cube-lamp-shopify-page.html").write_text(page)
print("bytes", len(page.encode()), "| data URIs:", page.count("data:image"), "| cart links:", page.count("/cart/add"), "| leftover placeholders:", page.count("{{IMG"))

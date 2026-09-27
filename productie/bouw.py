"""Werktekening + 1:1-freesbestanden voor de socialmediaspiegel, telefoonvorm 60 x 120 cm.

python3 productie/bouw.py  ->  productie/uit/
Alle maten in mm, oorsprong linksboven op de voorkant van de plaat, y omlaag.
"""
import math
import pathlib
import subprocess

UIT = pathlib.Path(__file__).parent / "uit"
UIT.mkdir(exist_ok=True)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# ---- maatvoering (afgeleid van de spiegel op de site: 1 cqw = 6 mm) ----
W, H, R = 600, 1200, 72                     # onder- en bovenplaat Dibond
MX, MY, MW, MH, MR = 30, 180, 540, 860, 0   # spiegelglas, rechte hoeken
FREES_R = 1.5                                # venster frezen met Ø 3 mm: binnenhoek R1,5
VENSTER = (MX - .5, MY - .5, MW + 1, MH + 1, FREES_R)  # uitsparing bovenplaat, 0,5 mm speling rondom
KI, KB, KD = 60, 20, 40                     # koker: inspringen, breedte, diepte
FX, FY, FW, FH = KI, KI, W - 2 * KI, H - 2 * KI
RAIL = (100, 80, 400, 30)                    # ophangrail achterkant: x, y, lengte, hoogte (spiegeldeel)
NOK = [(100, 1100), (500, 1100)]              # afstandsnokjes 40 mm onderaan
KLIK = [(100, 1100), (500, 1100)]             # (doorsnede snijdt door een nokje)
SLEUTEL = [(150, 70), (450, 70)]            # koker-variant: sleutelgaten, h.o.h. 300
AFSTAND = 40                                 # achterkant spiegel tot muur
LEDIN = 15                                   # LED-strip op achterkant, uit de rand
KABEL = (300, H - 40)
PRINT = [  # printzones voorkant: (label, y1, y2)
    ("statusbalk", 30, 72),
    ("naam + logo", 93, 159),
    ("likes / reacties", 1061, 1103),
    ("tabbalk", 1124, 1169),
]
DIBOND3_KG_M2, DIBOND4_KG_M2, GLAS_KG_M2, KOKER_KG_M = 3.8, 4.8, 10.0, 0.62
LED_W_M = 10

omtrek_led = (2 * (W + H - 4 * LEDIN) - 8 * (R - LEDIN) + 2 * math.pi * (R - LEDIN)) / 1000
RAND, LIP = 2, 6                              # rubber U-profiel: wand en lipbreedte
omtrek_plaat = (2 * (W + H) - 8 * R + 2 * math.pi * R) / 1000
plaat_m2 = (W * H - (4 - math.pi) * R * R) / 1e6
gewicht = (
    plaat_m2 * DIBOND3_KG_M2
    + (plaat_m2 - VENSTER[2] * VENSTER[3] / 1e6) * DIBOND4_KG_M2
    + MW * MH / 1e6 * GLAS_KG_M2
    + 0.5  # rail + nokjes
    + 0.6  # led, profiel, plaatjes, lijm
)
led_w = omtrek_led * LED_W_M


def nl(x, n):
    return f"{x:.{n}f}".replace(".", ",")


# ---------------------------------------------------------------- svg-hulp
def rrect(x, y, w, h, r, cls="", s=1.0, ox=0, oy=0, extra=""):
    return (f'<rect x="{ox + x * s:.2f}" y="{oy + y * s:.2f}" width="{w * s:.2f}" height="{h * s:.2f}" '
            f'rx="{r * s:.2f}" class="{cls}" {extra}/>')


def tekst(x, y, t, cls="t", anchor="start", rot=0):
    tr = f' transform="rotate({rot} {x:.2f} {y:.2f})"' if rot else ""
    return f'<text x="{x:.2f}" y="{y:.2f}" class="{cls}" text-anchor="{anchor}"{tr}>{t}</text>'


def maat_h(x1, x2, y, t, hulp_y=None):
    """Horizontale maatlijn op papierhoogte y; hulplijnen vanaf hulp_y."""
    out = []
    if hulp_y is not None:
        for x in (x1, x2):
            out.append(f'<line x1="{x:.2f}" y1="{hulp_y:.2f}" x2="{x:.2f}" y2="{y + (1 if y > hulp_y else -1):.2f}" class="hulp"/>')
    out.append(f'<line x1="{x1:.2f}" y1="{y:.2f}" x2="{x2:.2f}" y2="{y:.2f}" class="maat" marker-start="url(#pijl)" marker-end="url(#pijl)"/>')
    out.append(tekst((x1 + x2) / 2, y - 1.2, t, "m", "middle"))
    return "".join(out)


def maat_v(y1, y2, x, t, hulp_x=None):
    out = []
    if hulp_x is not None:
        for y in (y1, y2):
            out.append(f'<line x1="{hulp_x:.2f}" y1="{y:.2f}" x2="{x + (1 if x > hulp_x else -1):.2f}" y2="{y:.2f}" class="hulp"/>')
    out.append(f'<line x1="{x:.2f}" y1="{y1:.2f}" x2="{x:.2f}" y2="{y2:.2f}" class="maat" marker-start="url(#pijl)" marker-end="url(#pijl)"/>')
    out.append(tekst(x - 1.2, (y1 + y2) / 2, t, "m", "middle", -90))
    return "".join(out)


def titel(x, y, t, schaal):
    return tekst(x, y, t, "kop") + tekst(x, y + 4.2, f"schaal {schaal}", "klein")


def titelblok(blad, onderwerp):
    x, y = 232, 255
    rijen = [
        ("Project", "Socialmediaspiegel · telefoonvorm 60 × 120 cm"),
        ("Blad", f"{blad} · {onderwerp}"),
        ("Maateenheid", "mm, tenzij anders vermeld"),
        ("Getekend", "Sign Company · 27-09-2026 · concept, niet vrijgegeven"),
    ]
    out = [f'<rect x="{x}" y="{y}" width="178" height="32" class="kader"/>']
    for i, (k, v) in enumerate(rijen):
        yy = y + 7 + i * 7.3
        out.append(tekst(x + 3, yy, k, "klein"))
        out.append(tekst(x + 30, yy, v, "t"))
        if i:
            out.append(f'<line x1="{x}" y1="{yy - 5}" x2="{x + 178}" y2="{yy - 5}" class="dun"/>')
    return "".join(out)


CSS = """
@page { size: 420mm 297mm; margin: 0; }
html, body { margin: 0; }
svg { display: block; width: 420mm; height: 297mm; page-break-after: always; }
text { font-family: Helvetica, Arial, sans-serif; fill: #111; }
.t { font-size: 3px; } .klein { font-size: 2.4px; fill: #555; } .m { font-size: 2.3px; }
.kop { font-size: 4.2px; font-weight: 700; } .blad { font-size: 6px; font-weight: 700; }
.plaat { fill: #fff; stroke: #111; stroke-width: .35; }
.glas { fill: #dfe7ee; stroke: #1b2cff; stroke-width: .3; }
.print { fill: #ff2d87; fill-opacity: .16; stroke: none; }
.koker { fill: #9aa3ad; fill-opacity: .35; stroke: #111; stroke-width: .25; }
.led { fill: none; stroke: #f5a300; stroke-width: .9; }
.onzicht { fill: none; stroke: #111; stroke-width: .2; stroke-dasharray: 1.2 .8; }
.maat { stroke: #111; stroke-width: .15; } .hulp { stroke: #888; stroke-width: .1; }
.dun { stroke: #bbb; stroke-width: .15; } .kader { fill: none; stroke: #111; stroke-width: .35; }
.gat { fill: #fff; stroke: #111; stroke-width: .25; }
.muur { fill: url(#arcering); stroke: #111; stroke-width: .25; }
.as { stroke: #1b2cff; stroke-width: .15; stroke-dasharray: 4 1 .6 1; }
"""

DEFS = """<defs>
<marker id="pijl" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="2.2" markerHeight="2.2" orient="auto-start-reverse">
<path d="M0 0 6 3 0 6z" fill="#111"/></marker>
<pattern id="arcering" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
<line x1="0" y1="0" x2="0" y2="2" stroke="#999" stroke-width=".3"/></pattern>
</defs>"""


def blad(inhoud):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 297">{DEFS}' \
           f'<rect x="8" y="8" width="404" height="281" class="kader"/>{inhoud}</svg>'


# ---------------------------------------------------------------- blad 1
def blad1():
    s = 0.1
    o = []
    o.append(tekst(14, 18, "Socialmediaspiegel · telefoonvorm 60 × 120", "blad"))

    # vooraanzicht
    ox, oy = 30, 42
    o.append(titel(ox, oy - 12, "Vooraanzicht", "1:10"))
    o.append(rrect(-RAND, -RAND, W + 2 * RAND, H + 2 * RAND, R + RAND, "", s, ox, oy, 'fill="#111"'))
    o.append(rrect(0, 0, W, H, R, "plaat", s, ox, oy))
    for _, y1, y2 in PRINT:
        o.append(rrect(30, y1, W - 60, y2 - y1, 4, "print", s, ox, oy))
    o.append(rrect(MX, MY, MW, MH, MR, "glas", s, ox, oy))
    o.append(tekst(ox + W * s / 2, oy + (MY + MH / 2) * s, "spiegel 4 mm", "klein", "middle"))
    o.append(maat_h(ox, ox + W * s, oy - 4, "600", oy))
    o.append(maat_v(oy, oy + H * s, ox - 5, "1200", ox))
    o.append(maat_h(ox + MX * s, ox + (MX + MW) * s, oy + H * s + 5, "540", oy + (MY + MH) * s))
    o.append(maat_v(oy + MY * s, oy + (MY + MH) * s, ox + W * s + 5, "860", ox + (MX + MW) * s))
    o.append(maat_v(oy, oy + MY * s, ox + W * s + 10, "180", ox + W * s))
    o.append(maat_v(oy + (MY + MH) * s, oy + H * s, ox + W * s + 10, "160", ox + W * s))
    o.append(tekst(ox, oy + H * s + 12, "R72 buitenhoeken · spiegel rechte hoeken · zwarte rubberen rand", "klein"))
    o.append(tekst(ox, oy + H * s + 15.5, "wit = bovenplaat 4 mm met folie · roze = opdruk", "klein"))

    # achteraanzicht (gespiegeld getekend: links = rechts van voorkant)
    ox2, oy2 = 118, 42
    o.append(titel(ox2, oy2 - 12, "Achteraanzicht", "1:10"))
    o.append(rrect(0, 0, W, H, R, "plaat", s, ox2, oy2))
    o.append(rrect(MX, MY, MW, MH, MR, "onzicht", s, ox2, oy2))
    o.append(rrect(LEDIN, LEDIN, W - 2 * LEDIN, H - 2 * LEDIN, R - LEDIN, "led", s, ox2, oy2))
    o.append(rrect(RAIL[0], RAIL[1], RAIL[2], RAIL[3], 2, "koker", s, ox2, oy2))
    for x, y in NOK:
        o.append(f'<circle cx="{ox2 + x * s}" cy="{oy2 + y * s}" r="1.5" class="koker"/>')
    o.append(f'<circle cx="{ox2 + KABEL[0] * s}" cy="{oy2 + KABEL[1] * s}" r=".8" fill="#111"/>')
    o.append(maat_h(ox2 + RAIL[0] * s, ox2 + (RAIL[0] + RAIL[2]) * s, oy2 - 4, "rail 400", oy2 + RAIL[1] * s))
    o.append(maat_v(oy2, oy2 + RAIL[1] * s, ox2 - 5, "80", ox2 + RAIL[0] * s))
    o.append(maat_h(ox2, ox2 + NOK[0][0] * s, oy2 + H * s + 5, "100", oy2 + NOK[0][1] * s))
    o.append(tekst(ox2, oy2 + H * s + 12, "grijs = ophangrail boven + 2 afstandsnokjes onder", "klein"))
    o.append(tekst(ox2, oy2 + H * s + 15.5, "oranje = optionele LED-strip, 15 mm uit de rand", "klein"))
    o.append(tekst(ox2, oy2 + H * s + 19, "stip onder = kabeluitgang", "klein"))

    # doorsnede detail 1:1 (horizontaal, linkerrand; voorkant boven, muur onder)
    d, dx, dy = 1.0, 222, 48
    o.append(titel(dx - 20, dy - 18, "Doorsnede linkerrand", "1:1"))
    lengte = 120
    y_voor = dy                      # voorvlak glas = voorvlak bovenplaat
    y_onder = y_voor + 4 * d + 1 * d  # 4 mm + 1 mm VHB
    y_kok = y_onder + 3 * d
    y_muur = y_kok + AFSTAND * d
    y_glas, y_dib = y_voor, y_onder
    o.append(f'<rect x="{dx + MX * d}" y="{y_voor}" width="{(lengte - MX) * d}" height="{4 * d}" class="glas"/>')
    o.append(f'<rect x="{dx}" y="{y_voor}" width="{(MX - .5) * d}" height="{4 * d}" class="plaat"/>')
    o.append(f'<line x1="{dx}" y1="{y_voor - .15}" x2="{dx + (MX - .5) * d}" y2="{y_voor - .15}" stroke="#ff2d87" stroke-width=".5"/>')
    o.append(f'<rect x="{dx}" y="{y_onder}" width="{lengte * d}" height="{3 * d}" class="plaat"/>')
    stapel = y_onder + 3 * d  # onderkant onderplaat
    o.append(f'<path d="M{dx - RAND * d} {y_voor - 1.5 * d} H{dx + LIP * d} V{y_voor} H{dx} V{stapel} H{dx + LIP * d} V{stapel + 1.5 * d} H{dx - RAND * d} Z" fill="#111"/>')
    kx = dx + (KLIK[0][0] - 15) * d  # klikbevestiging Ø 30, hart op 100 mm
    o.append(f'<rect x="{kx}" y="{y_kok}" width="{30 * d}" height="{9 * d}" rx="1" fill="#555"/>')
    o.append(f'<rect x="{kx + 3 * d}" y="{y_kok + 9 * d}" width="{24 * d}" height="{(AFSTAND - 9) * d}" rx="1" class="koker"/>')
    o.append(f'<line x1="{kx + 15 * d}" y1="{y_kok + 12 * d}" x2="{kx + 15 * d}" y2="{y_muur + 5}" stroke="#111" stroke-width=".6"/>')
    o.append(f'<rect x="{dx + LEDIN * d}" y="{y_kok}" width="{10 * d}" height="{2 * d}" fill="#f5a300" stroke="#111" stroke-width=".2"/>')
    o.append(f'<path d="M{dx + LEDIN * d} {y_kok + 2 * d} L{dx - 14} {y_muur - .3} L{dx + 40} {y_muur - .3} L{dx + (LEDIN + 10) * d} {y_kok + 2 * d}z" fill="#f5a300" fill-opacity=".16"/>')
    o.append(f'<rect x="{dx - 20}" y="{y_muur}" width="{lengte * d + 20}" height="6" class="muur"/>')
    o.append(tekst(dx - 20, y_muur + 10, "muur", "klein"))
    o.append(maat_h(dx, dx + MX * d, y_glas - 5, "30", y_glas))
    o.append(maat_h(dx, dx + KLIK[0][0] * d, y_muur + 16, "100", y_muur + 6))
    o.append(maat_v(y_voor, y_muur, dx - 26, "49 (+1,5 rand)", dx - 20))
    o.append(maat_v(y_kok, y_muur, dx + lengte * d + 4, "40", dx + (KLIK[0][0] + 15) * d))
    lab = [  # (doel x, doel y, label)
        (dx + 100, y_voor + 2, "spiegel 4 mm + veiligheidsfolie, op VHB 1 mm"),
        (dx + 12, y_voor + .2, "folie + laminaat, bovenplaat Dibond 4 mm"),
        (dx + 100, y_onder + 1.5, "onderplaat Dibond 3 mm"),
        (dx - 1, y_voor + 6, "rubber U-profiel met klemkern, 8 mm"),
        (dx + (KLIK[0][0] + 12) * d, y_kok + 20, "afstandsnokje 40 mm (rail boven: zelfde diepte)"),
        (dx + (LEDIN + 5) * d, y_kok + 1, "optie: LED COB 24 V op onderplaat"),
    ]
    for i, (tx, ty, t) in enumerate(lab):
        ly = dy - 10 + i * 7 if i < 4 else y_kok + 12 + (i - 4) * 12
        lx = dx + lengte + 8
        o.append(f'<polyline points="{tx},{ty} {lx - 3},{ly} {lx - 1},{ly}" fill="none" class="hulp"/>')
        o.append(f'<circle cx="{tx}" cy="{ty}" r=".5" fill="#111"/>')
        o.append(tekst(lx, ly + 1, t, "klein"))

    # stuklijst
    sx, sy = 212, 136
    o.append(tekst(sx, sy, "Stuklijst (per spiegel)", "kop"))
    regels = [
        ("1", "1", "Onderplaat Dibond 3 mm, 600 × 1200, R72"),
        ("2", "1", "Bovenplaat Dibond 4 mm, 600 × 1200, R72, venster 541 × 861, frees Ø 3"),
        ("3", "1", "Bedrukte cast-folie + laminaat op bovenplaat, vóór frezen (of UV-print)"),
        ("4", "1", "Spiegel 4 mm zilver + veiligheidsfolie EN 12600, 540 × 860, rechte hoeken, randen geslepen"),
        ("5", "1", "Ophangrail alu Z-profiel 400 mm: spiegeldeel verlijmd, muurdeel met waterpasje, 40 mm"),
        ("6", f"{nl(omtrek_led, 1)} m", "Optie: LED COB 24 V ± 10 W/m op achterkant onderplaat; warm, koel of RGB"),
        ("7", "1", f"Optie: voeding 24 V 48–60 W CE + schakelaar, snoer 1,5 / 3 / 5 m naar keuze; RGB: controller"),
        ("8", "1", "Optie plak-klaar (i.p.v. 5, 13): VHB-tape vooraf op achterkant met folie, geen Glow"),
        ("9", "1", "Spiegelkit (vrijgegeven door folieleverancier) + VHB-tape 1 mm"),
        ("10", "1", "VHB/MS-polymeer: bovenplaat op onderplaat, rail en nokjes op onderplaat"),
        ("11", "1", "In de doos: 2 schroeven + pluggen, boortje Ø 6, borgschroef. Geen boormal: de rail is de mal"),
        ("12", f"{nl(omtrek_plaat, 1)} m", "Zwart rubber U-profiel met stalen klemkern, voor plaatrand 8 mm"),
        ("13", "2", "Afstandsnokje 40 mm, verlijmd onderaan; één met lipje voor de borgschroef"),
    ]
    for i, (nr, aantal, oms) in enumerate(regels):
        yy = sy + 7 + i * 5.4
        o.append(tekst(sx, yy, nr, "t"))
        o.append(tekst(sx + 7, yy, aantal, "t"))
        o.append(tekst(sx + 20, yy, oms, "t"))
        o.append(f'<line x1="{sx}" y1="{yy + 1.8}" x2="{sx + 196}" y2="{yy + 1.8}" class="dun"/>')
    o.append(tekst(sx, sy + 82, f"Standaard onverlicht. Gewicht ± {nl(gewicht, 1)} kg · met licht ± {led_w:.0f} W · uitsteek van muur 49 mm (+1,5 rand)", "t"))

    o.append(titelblok("1 van 2", "aanzichten, doorsnede, stuklijst"))
    return blad("".join(o))


# ---------------------------------------------------------------- blad 2
def blad2():
    s = 0.1
    o = [tekst(14, 18, "Montagemallen en werkvolgorde", "blad")]

    # mal A: plaatsingsmal spiegel
    ax, ay = 30, 42
    o.append(titel(ax, ay - 12, "Bovenplaat · is de mal", "1:10"))
    o.append(f'<path d="{rrect_pad(0, 0, W, H, R, s, ax, ay)} {rrect_pad(*VENSTER, s, ax, ay)}" '
             f'fill="#ffe14d" fill-opacity=".5" stroke="#111" stroke-width=".3" fill-rule="evenodd"/>')
    for (x, y) in [(-12, 300), (-12, 900), (150, -12), (450, -12)]:
        o.append(f'<rect x="{ax + x * s}" y="{ay + y * s - (1 if x < 0 else 0)}" width="{1.2 if x < 0 else 2}" height="{2 if x < 0 else 1.2}" fill="#111"/>')
    o.append(maat_h(ax + MX * s, ax + (MX + MW) * s, ay + H * s + 5, "541 venster", ay + (MY + MH) * s))
    o.append(maat_v(ay + MY * s, ay + (MY + MH) * s, ax + W * s + 5, "861", ax + (MX + MW) * s))
    o.append(tekst(ax, ay + H * s + 12, "4 mm Dibond met folie, venster = spiegel + 1 mm", "klein"))
    o.append(tekst(ax, ay + H * s + 15.5, "zwart = aanslagnokken op werktafel (links + boven)", "klein"))

    # rail: geen montagemal nodig
    bx, by = 118, 42
    o.append(titel(bx, by - 12, "Achterkant · rail en nokjes", "1:10"))
    o.append(rrect(0, 0, W, H, R, "onzicht", s, bx, by))
    o.append(rrect(RAIL[0], RAIL[1], RAIL[2], RAIL[3], 2, "koker", s, bx, by))
    for x, y in NOK:
        o.append(f'<circle cx="{bx + x * s}" cy="{by + y * s}" r="1.5" class="koker"/>')
    o.append(tekst(bx, by + H * s + 6, "Rail en nokjes verlijmen met de bovenplaat-nokken als aanslag.", "klein"))
    o.append(tekst(bx, by + H * s + 9.5, "Klant: muurrail met waterpasje, 2 schroeven, spiegel erop, klaar.", "klein"))
    o.append(tekst(bx, by + H * s + 16, "Varianten: ophangrail (standaard) of plak-klaar (stuklijst 8).", "klein"))

    # werkvolgorde
    wx, wy = 290, 42
    o.append(tekst(wx, wy - 12, "Werkvolgorde", "kop"))
    stappen = [
        ["Folie printen, lamineren en op de 4 mm plaat zetten."],
        ["Frezen: onderplaat contour, bovenplaat contour + venster", "door de folie heen. Venster met Ø 3 mm, niet dikker."],
        ["Onderplaat tegen de nokken, bovenplaat erop met VHB,", "randen gelijk tegen dezelfde nokken."],
        ["Spiegel in het venster: VHB-stroken + verticale rupsen", "spiegelkit, niet vol-vlaks. Voorvlak gelijk met folie."],
        ["Omdraaien, spiegeldeel van de rail bovenaan en 2 nokjes", "onderaan verlijmen (maten achteraanzicht)."],
        ["Rubber U-profiel om de buitenrand klemmen: start en eind", "onderaan in het midden, naad met een druppel kit."],
        ["24 uur laten uitharden voor transport."],
        ["Bij licht: COB-strip rondom op achterkant, 15 mm uit de rand,", "hoeken doorverbinden, kabel onderaan in het midden."],
        ["Bij licht: test in donkere ruimte op 40 mm van een witte", "wand: gloed gelijkmatig, hoeken zonder gat in de gloed."],
        ["Verpakken met hoekbeschermers + muurrail, schroeven,", "pluggen, boortje en borgschroef. Plak-klaar: tape erop."],
    ]
    rij = 0
    for i, regels in enumerate(stappen, 1):
        o.append(tekst(wx, wy + rij * 5, f"{i}", "t"))
        for r in regels:
            o.append(tekst(wx + 6, wy + rij * 5, r, "t"))
            rij += 1
        rij += 0.4

    ny = wy + rij * 5 + 10
    o.append(tekst(wx, ny, "Nog te beslissen", "kop"))
    open_ = [
        "Railprofiel kiezen: Z-profiel met 40 mm totale diepte.",
        "Hoekverbinding strip: connector of solderen.",
        "Leverancier glas + folie: kit laten vrijgeven.",
        "Rand: rubber zwart (standaard) of lakken, op het proefstuk kiezen.",
        "Proefstuk: lichtbeeld op 40 mm, zo nodig 50 mm diep.",
    ]
    for i, t in enumerate(open_):
        o.append(tekst(wx, ny + 7 + i * 5, t, "t"))

    o.append(titelblok("2 van 2", "mallen en werkvolgorde"))
    return blad("".join(o))


def rrect_pad(x, y, w, h, r, s=1.0, ox=0, oy=0):
    x, y, w, h, r = ox + x * s, oy + y * s, w * s, h * s, r * s
    return (f"M{x + r:.2f} {y:.2f}H{x + w - r:.2f}A{r:.2f} {r:.2f} 0 0 1 {x + w:.2f} {y + r:.2f}"
            f"V{y + h - r:.2f}A{r:.2f} {r:.2f} 0 0 1 {x + w - r:.2f} {y + h:.2f}"
            f"H{x + r:.2f}A{r:.2f} {r:.2f} 0 0 1 {x:.2f} {y + h - r:.2f}"
            f"V{y + r:.2f}A{r:.2f} {r:.2f} 0 0 1 {x + r:.2f} {y:.2f}Z")


# ---------------------------------------------------------------- 1:1-bestanden
def dxf(naam, lagen):
    """DXF R12 in mm: per laag gesloten POLYLINE-contouren (bogen als bulge), cirkels als CIRCLE. Y omhoog."""
    ent = []
    b = math.tan(math.radians(90) / 4)  # bulge voor een kwartcirkel, tegen de klok in

    def contour(laag, x, y, w, h, r):
        y = H - y - h  # tekening: y omlaag; DXF: y omhoog
        if r <= 0:
            pts = [(x, y, 0), (x + w, y, 0), (x + w, y + h, 0), (x, y + h, 0)]
        else:
            pts = [(x + r, y, 0), (x + w - r, y, b), (x + w, y + r, 0), (x + w, y + h - r, b),
                   (x + w - r, y + h, 0), (x + r, y + h, b), (x, y + h - r, 0), (x, y + r, b)]
        ent.append(f"0\nPOLYLINE\n8\n{laag}\n66\n1\n10\n0\n20\n0\n30\n0\n70\n1\n")
        for px, py, pb in pts:
            ent.append(f"0\nVERTEX\n8\n{laag}\n10\n{px:.4f}\n20\n{py:.4f}\n30\n0\n" + (f"42\n{pb:.8f}\n" if pb else ""))
        ent.append(f"0\nSEQEND\n8\n{laag}\n")

    for laag, vormen in lagen.items():
        for v in vormen:
            if v[0] == "cirkel":
                _, cx, cy, r = v
                ent.append(f"0\nCIRCLE\n8\n{laag}\n10\n{cx}\n20\n{H - cy}\n30\n0\n40\n{r}\n")
            else:
                contour(laag, *v)
    kop = "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n9\n$INSUNITS\n70\n4\n9\n$MEASUREMENT\n70\n1\n0\nENDSEC\n"
    (UIT / naam).write_text(kop + "0\nSECTION\n2\nENTITIES\n" + "".join(ent) + "0\nENDSEC\n0\nEOF\n")


def svg11(naam, paden):
    body = "".join(f'<path d="{d}" fill="none" stroke="{k}" stroke-width="0.3"/>' for d, k in paden)
    (UIT / naam).write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">{body}</svg>')


def boormal_koker():
    cx, cy = 210, 150
    o = [f'<line x1="{cx}" y1="20" x2="{cx}" y2="277" class="as"/>',
         f'<line x1="20" y1="{cy}" x2="400" y2="{cy}" class="as"/>',
         f'<line x1="{cx - 300}" y1="{cy - 70}" x2="{cx + 300}" y2="{cy - 70}" class="onzicht"/>']
    for dx in (-150, 150):
        x = cx + dx
        o.append(f'<circle cx="{x}" cy="{cy}" r="2.5" class="gat"/>')
        o.append(f'<line x1="{x - 8}" y1="{cy}" x2="{x + 8}" y2="{cy}" class="maat"/><line x1="{x}" y1="{cy - 8}" x2="{x}" y2="{cy + 8}" class="maat"/>')
    o.append(maat_h(cx - 150, cx + 150, cy + 20, "300", cy))
    o.append(maat_v(cy - 70, cy, cx + 175, "70", cx + 150))
    o.append(tekst(cx, cy - 74, "bovenkant spiegel", "t", "middle"))
    o.append(tekst(24, 30, "Boormal koker-variant · De Story 60 × 120 · afdrukken op 100 %, niet passend maken", "kop"))
    o.append(tekst(24, 37, "Controleer: de maat 300 moet met een rolmaat precies 300 mm zijn.", "t"))
    o.append(tekst(24, 43, "Blauwe lijn waterpas op de muur, middenlijn op het midden van de spiegel. Boor Ø 6 mm, plug + schroef 5 mm, kop 5 mm laten uitsteken.", "t"))
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 297">{DEFS}{"".join(o)}</svg>'


def montagemal():
    cx = W / 2
    o = [f'<path d="{rrect_pad(0, 0, W, H, R)}" fill="none" stroke="#111" stroke-width="1" stroke-dasharray="8 5"/>',
         f'<line x1="{cx}" y1="0" x2="{cx}" y2="{H}" class="as" style="stroke-width:.6"/>']
    for yy in (KLIK[0][1], KLIK[2][1]):
        o.append(f'<line x1="20" y1="{yy}" x2="{W - 20}" y2="{yy}" class="as" style="stroke-width:.6"/>')
    for x, y in KLIK:
        o.append(f'<circle cx="{x}" cy="{y}" r="4" fill="none" stroke="#111" stroke-width="1"/>')
        o.append(f'<line x1="{x - 18}" y1="{y}" x2="{x + 18}" y2="{y}" stroke="#111" stroke-width="1"/><line x1="{x}" y1="{y - 18}" x2="{x}" y2="{y + 18}" stroke="#111" stroke-width="1"/>')
    o.append(maat_h(KLIK[0][0], KLIK[1][0], KLIK[0][1] + 40, "400", KLIK[0][1]))
    o.append(maat_v(KLIK[0][1], KLIK[2][1], KLIK[1][0] + 40, "1000", KLIK[1][0]))
    t = [("Montagemal socialmediaspiegel · De Story 60 × 120", "kop"),
         ("Afdrukken op ware grootte. Controleer: 400 en 1000 mm met een rolmaat.", "t"),
         ("1. Tape de mal waterpas op de muur (blauwe lijnen horizontaal).", "t"),
         ("2. Boor door de vier kruisjes, pluggen erin, wanddelen vastschroeven.", "t"),
         ("3. Mal weghalen, spiegel recht voor de wanddelen houden en aandrukken: klik.", "t")]
    for i, (regel, cls) in enumerate(t):
        o.append(f'<text x="{cx}" y="{300 + i * 26}" class="{cls}" text-anchor="middle" style="font-size:{18 if i == 0 else 13}px">{regel}</text>')
    o.append(f'<text x="{cx}" y="40" text-anchor="middle" style="font-size:16px;font-weight:700">BOVEN</text>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" style="width:{W}mm;height:{H}mm">{DEFS}{"".join(o)}</svg>'


def main():
    html = f"<!doctype html><meta charset=utf-8><style>{CSS}</style>{blad1()}{blad2()}"
    (UIT / "werktekening.html").write_text(html)
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    f"--print-to-pdf={UIT / 'werktekening-60x120.pdf'}", (UIT / "werktekening.html").as_uri()],
                   check=True, capture_output=True)

    buiten = (0, 0, W, H, R)
    dxf("frees-dibond-onder-3mm.dxf", {"FREES_BUITEN": [buiten]})
    dxf("spiegel-540x860.dxf", {"GLAS_SNIJLIJN": [(MX, MY, MW, MH, MR)]})
    svg11("spiegel-540x860.svg", [(rrect_pad(MX, MY, MW, MH, MR), "#00f")])
    dxf("frees-dibond-boven-4mm.dxf", {"FREES_BUITEN": [buiten], "FREES_BINNEN": [VENSTER]})
    svg11("frees-dibond-onder-3mm.svg", [(rrect_pad(*buiten), "#000")])
    svg11("frees-dibond-boven-4mm.svg", [(rrect_pad(*buiten), "#000"), (rrect_pad(*VENSTER), "#f00")])
    print(f"gewicht {gewicht:.1f} kg · led {led_w:.0f} W ({nl(omtrek_led, 1)} m)")


if __name__ == "__main__":
    main()

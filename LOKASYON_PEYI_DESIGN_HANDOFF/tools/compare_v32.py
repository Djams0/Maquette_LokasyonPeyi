"""Generate comparable visual evidence for an aligned pair of captures."""
import argparse
from pathlib import Path

from PIL import Image, ImageChops, ImageEnhance

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("reference", type=Path)
parser.add_argument("actual", type=Path)
parser.add_argument("output", type=Path)
parser.add_argument("--box", type=int, nargs=4, metavar=("LEFT", "TOP", "RIGHT", "BOTTOM"))
args = parser.parse_args()
with Image.open(args.reference) as source:
    reference = source.convert("RGB")
with Image.open(args.actual) as source:
    actual = source.convert("RGB")

if args.box:
    left, top, right, bottom = args.box
    if left < 0 or top < 0 or not left < right <= min(reference.width, actual.width) or not top < bottom <= min(reference.height, actual.height):
        parser.error("Le rectangle doit tenir dans les deux captures.")
    reference, actual = reference.crop(args.box), actual.crop(args.box)
if reference.size != actual.size:
    parser.error("Dimensions différentes. Fournir une région commune avec --box.")

args.output.mkdir(parents=True, exist_ok=True)
stack = Image.new("RGB", (reference.width * 2, reference.height))
stack.paste(reference, (0, 0))
stack.paste(actual, (reference.width, 0))
stack.save(args.output / "cote-a-cote.png")
Image.blend(reference, actual, 0.5).save(args.output / "superposition.png")
diff = ImageChops.difference(reference, actual)
ImageEnhance.Brightness(diff).enhance(3).save(args.output / "difference.png")
r, g, b = diff.split()
changed = ImageChops.lighter(ImageChops.lighter(r, g), b).histogram()
pixel_count = actual.width * actual.height
print(f"Pixels différents · {pixel_count - changed[0]}/{pixel_count}. Revoir les régions et les données.")

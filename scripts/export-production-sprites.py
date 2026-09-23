#!/usr/bin/env python3
"""
scripts/export-production-sprites.py
Exports individual clean production sprites (RGBA transparent background, clean edges,
no background scenery, no arrows/badges, no overlapping elements) from the high-resolution
art reference, and packs them into a master production spritesheet with an updated atlas.
"""

import os
import zlib
import struct
import math
from collections import deque

def load_png(path):
    with open(path, 'rb') as f:
        data = f.read()
    pos = 8
    idat = b''
    w, h = 0, 0
    while pos < len(data):
        l = struct.unpack('>I', data[pos:pos+4])[0]
        pos += 4
        ct = data[pos:pos+4]
        pos += 4
        cd = data[pos:pos+l]
        pos += l + 4
        if ct == b'IHDR':
            w, h = struct.unpack('>II', cd[:8])
        elif ct == b'IDAT':
            idat += cd
    decomp = zlib.decompress(idat)
    stride = w * 3
    raw = bytearray(h * stride)
    prev = bytearray(stride)
    sp, dp = 0, 0
    for r in range(h):
        ft = decomp[sp]
        sp += 1
        row = bytearray(decomp[sp:sp+stride])
        sp += stride
        if ft == 1:
            for i in range(3, stride):
                row[i] = (row[i] + row[i-3]) & 0xff
        elif ft == 2:
            for i in range(stride):
                row[i] = (row[i] + prev[i]) & 0xff
        elif ft == 3:
            for i in range(stride):
                row[i] = (row[i] + ((row[i-3] if i>=3 else 0) + prev[i]) // 2) & 0xff
        elif ft == 4:
            for i in range(stride):
                a = row[i-3] if i >= 3 else 0
                b = prev[i]
                c = prev[i-3] if i >= 3 else 0
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                row[i] = (row[i] + pr) & 0xff
        prev = row
        raw[dp:dp+stride] = row
        dp += stride
    return w, h, raw

def save_png_rgba(filename, width, height, rgba_bytes):
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_chunk = struct.pack('>I', 13) + b'IHDR' + ihdr + struct.pack('>I', zlib.crc32(b'IHDR' + ihdr) & 0xffffffff)
    raw = bytearray()
    stride = width * 4
    for y in range(height):
        raw.append(0)
        raw.extend(rgba_bytes[y * stride : (y + 1) * stride])
    compressed = zlib.compress(raw, 9)
    idat_chunk = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', zlib.crc32(b'IDAT' + compressed) & 0xffffffff)
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', zlib.crc32(b'IEND') & 0xffffffff)
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n' + ihdr_chunk + idat_chunk + iend_chunk)

def is_background_pixel(r, g, b):
    # Dark room background is darkness < 38, or blue/indigo tinted room background
    brightness = (r * 299 + g * 587 + b * 114) // 1000
    if brightness <= 25:
        return True
    # Dark blue wallpaper with wallpaper pattern
    if brightness <= 42 and b >= r and b >= g - 4:
        return True
    # Dim brown floor far background
    if brightness <= 34 and r < 45 and g < 35 and b < 45:
        return True
    return False

def is_yellow_marker(r, g, b):
    # Yellow badge / arrow pixel
    return r > 195 and g > 165 and b < 90

def extract_clean_sprite(raw, full_w, full_h, bx, by, bw, bh, erase_regions=None, bg_threshold_fn=is_background_pixel):
    """
    Extracts an isolated sprite from the raw image.
    Uses boundary flood-fill to ensure internal dark details are preserved,
    while removing all outside scenery and erasing specified badge/arrow areas.
    """
    is_outside = [[False for _ in range(bw)] for _ in range(bh)]
    queue = deque()

    # Pre-mark erase regions (e.g. badges, arrows, or character overlapping) as outside
    if erase_regions:
        for ex0, ey0, ew, eh in erase_regions:
            for ey in range(max(0, ey0), min(bh, ey0 + eh)):
                for ex in range(max(0, ex0), min(bw, ex0 + ew)):
                    is_outside[ey][ex] = True
                    queue.append((ex, ey))

    # Seed borders
    for x in range(bw):
        for y in [0, bh - 1]:
            if not is_outside[y][x]:
                idx = ((by + y) * full_w + (bx + x)) * 3
                r, g, b = raw[idx], raw[idx+1], raw[idx+2]
                if bg_threshold_fn(r, g, b) or is_yellow_marker(r, g, b):
                    is_outside[y][x] = True
                    queue.append((x, y))

    for y in range(bh):
        for x in [0, bw - 1]:
            if not is_outside[y][x]:
                idx = ((by + y) * full_w + (bx + x)) * 3
                r, g, b = raw[idx], raw[idx+1], raw[idx+2]
                if bg_threshold_fn(r, g, b) or is_yellow_marker(r, g, b):
                    is_outside[y][x] = True
                    queue.append((x, y))

    # Flood fill outside boundary
    while queue:
        cx, cy = queue.popleft()
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < bw and 0 <= ny < bh and not is_outside[ny][nx]:
                idx = ((by + ny) * full_w + (bx + nx)) * 3
                r, g, b = raw[idx], raw[idx+1], raw[idx+2]
                if bg_threshold_fn(r, g, b) or is_yellow_marker(r, g, b):
                    is_outside[ny][nx] = True
                    queue.append((nx, ny))

    # Optional edge feathering
    rgba = bytearray(bw * bh * 4)
    for y in range(bh):
        for x in range(bw):
            idx = ((by + y) * full_w + (bx + x)) * 3
            out_idx = (y * bw + x) * 4
            r, g, b = raw[idx], raw[idx+1], raw[idx+2]
            if is_outside[y][x]:
                rgba[out_idx] = 0
                rgba[out_idx+1] = 0
                rgba[out_idx+2] = 0
                rgba[out_idx+3] = 0
            else:
                # Check distance to boundary for smooth 1-pixel feathering
                has_outside_neighbor = False
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < bw and 0 <= ny < bh and is_outside[ny][nx]:
                        has_outside_neighbor = True
                        break
                alpha = 255
                if has_outside_neighbor:
                    # Soft edge anti-aliasing
                    alpha = 200
                rgba[out_idx] = r
                rgba[out_idx+1] = g
                rgba[out_idx+2] = b
                rgba[out_idx+3] = alpha

    # Trim empty transparent borders
    min_x, max_x = bw, 0
    min_y, max_y = bh, 0
    has_content = False
    for y in range(bh):
        for x in range(bw):
            if rgba[(y * bw + x) * 4 + 3] > 0:
                has_content = True
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)

    if not has_content or min_x > max_x or min_y > max_y:
        return bw, bh, rgba

    # Add 1px padding
    pad = 2
    min_x = max(0, min_x - pad)
    min_y = max(0, min_y - pad)
    max_x = min(bw - 1, max_x + pad)
    max_y = min(bh - 1, max_y + pad)

    tw = max_x - min_x + 1
    th = max_y - min_y + 1
    trimmed = bytearray(tw * th * 4)
    for y in range(th):
        src_row = ((min_y + y) * bw + min_x) * 4
        dst_row = (y * tw) * 4
        trimmed[dst_row : dst_row + tw * 4] = rgba[src_row : src_row + tw * 4]

    return tw, th, trimmed

def main():
    source_img = 'assets/art/dark-room/environment-assets.png'
    print(f'Loading reference image from {source_img}...')
    w, h, raw = load_png(source_img)
    print(f'Image loaded: {w}x{h}')

    # Definition of all 24 platforms / props + scenery + characters
    sprites_to_export = [
        # Platforms 1 to 24:
        {
            'name': 'mandala_rug',
            'alias': 'mandala_rug',
            'box': (8, 206, 218, 102),
            # Girl stood at left; badge 1 at right (167, 187)
            'erase': [(150, 0, 68, 30), (0, 0, 75, 40)]
        },
        {
            'name': 'giant_bear',
            'alias': 'giant_bear',
            'box': (240, 182, 210, 154),
            'erase': [(180, 0, 30, 30)]
        },
        {
            'name': 'open_books',
            'alias': 'open_books',
            'box': (466, 192, 178, 126),
            'erase': [(140, 0, 38, 30)]
        },
        {
            'name': 'vanity_table',
            'alias': 'vanity_table',
            'box': (662, 74, 156, 240),
            'erase': [(0, 100, 30, 40)]
        },
        {
            'name': 'cardboard_box',
            'alias': 'cardboard_box',
            'box': (836, 192, 180, 122),
            'erase': [(0, 0, 35, 30)]
        },
        {
            'name': 'messy_blocks',
            'alias': 'messy_blocks',
            'box': (1038, 192, 204, 134),
            'erase': [(0, 0, 35, 30)]
        },
        {
            'name': 'toy_drum',
            'alias': 'toy_drum',
            'box': (1276, 194, 150, 130),
            'erase': [(120, 0, 30, 30)]
        },
        {
            'name': 'satin_cushion',
            'alias': 'satin_cushion',
            'box': (38, 404, 226, 126),
            'erase': [(190, 0, 36, 40), (60, 0, 65, 35)]
        },
        {
            'name': 'stepped_dresser',
            'alias': 'stepped_dresser',
            'box': (302, 386, 208, 162),
            'erase': [(0, 0, 30, 40)]
        },
        {
            'name': 'music_box',
            'alias': 'music_box',
            'box': (526, 350, 172, 196),
            'erase': [(0, 50, 30, 35)]
        },
        {
            'name': 'block_castle',
            'alias': 'block_castle',
            'box': (726, 342, 176, 186),
            'erase': [(0, 50, 30, 35)]
        },
        {
            'name': 'train_trestle',
            'alias': 'train_trestle',
            'box': (938, 344, 258, 200),
            'erase': [(220, 50, 38, 40)]
        },
        {
            'name': 'false_door',
            'alias': 'exitDoor',
            'box': (1260, 384, 196, 248),
            'erase': [(0, 0, 40, 40)]
        },
        {
            'name': 'wall_shelf',
            'alias': 'wall_shelf',
            'box': (44, 542, 198, 118),
            'erase': [(160, 80, 38, 38)]
        },
        {
            'name': 'mushroom_lamp',
            'alias': 'mushroom_lamp',
            'box': (250, 542, 130, 164),
            'erase': [(100, 70, 30, 35)]
        },
        {
            'name': 'dollhouse_roof',
            'alias': 'dollhouse_roof',
            'box': (432, 562, 224, 132),
            'erase': [(0, 40, 30, 35)]
        },
        {
            'name': 'wardrobe_portal',
            'alias': 'wardrobe_portal',
            'box': (702, 608, 214, 150),
            'erase': [(180, 0, 34, 30)]
        },
        {
            'name': 'spinning_globe',
            'alias': 'spinning_globe',
            'box': (948, 552, 118, 142),
            'erase': [(0, 70, 30, 35)]
        },
        {
            'name': 'kite_frame',
            'alias': 'kite_frame',
            'box': (1104, 552, 130, 186),
            'erase': [(100, 110, 30, 35)]
        },
        {
            'name': 'floating_books',
            'alias': 'floating_books',
            'box': (16, 762, 182, 114),
            'erase': [(70, 0, 35, 30)]
        },
        {
            'name': 'chandelier_crystals',
            'alias': 'chandelier_crystals',
            'box': (216, 706, 174, 164),
            'erase': [(40, 40, 35, 30)]
        },
        {
            'name': 'curtain_rod',
            'alias': 'curtain_rod',
            'box': (398, 760, 192, 168),
            'erase': [(40, 0, 30, 30)]
        },
        {
            'name': 'cuckoo_clock',
            'alias': 'cuckoo_clock',
            'box': (610, 712, 108, 230),
            'erase': [(0, 50, 30, 35)]
        },
        {
            'name': 'salto_final_sign',
            'alias': 'salto_final_sign',
            'box': (742, 764, 238, 196),
            'erase': [(100, 40, 35, 30)]
        },
        {
            'name': 'grand_portal_pedestal',
            'alias': 'grand_portal_pedestal',
            'box': (1102, 698, 388, 256),
            'erase': [(240, 60, 35, 30)]
        },
        # Character frames:
        {
            'name': 'character_stand',
            'alias': 'character_stand',
            'box': (50, 140, 70, 100),
            'erase': []
        },
        {
            'name': 'character_jump',
            'alias': 'character_jump',
            'box': (218, 90, 72, 98),
            'erase': []
        },
        {
            'name': 'character_run',
            'alias': 'character_run',
            'box': (1050, 730, 84, 102),
            'erase': []
        }
    ]

    sprites_dir = 'assets/art/dark-room/sprites'
    os.makedirs(sprites_dir, exist_ok=True)

    extracted = []
    print(f'Extracting {len(sprites_to_export)} individual sprites with transparent RGBA background...')

    for item in sprites_to_export:
        bx, by, bw, bh = item['box']
        tw, th, rgba = extract_clean_sprite(raw, w, h, bx, by, bw, bh, erase_regions=item.get('erase'))
        filename = f"{sprites_dir}/{item['name']}.png"
        save_png_rgba(filename, tw, th, rgba)
        extracted.append({
            'name': item['name'],
            'alias': item['alias'],
            'width': tw,
            'height': th,
            'rgba': rgba,
            'file': filename
        })
        print(f"  [OK] Exported {item['name']}.png ({tw}x{th})")

    # Pack into a master spritesheet (with 6px padding between sprites)
    # Estimate layout: spritesheet width = 1200
    SHEET_W = 1200
    padding = 6
    cur_x = padding
    cur_y = padding
    row_height = 0
    sheet_items = []

    for item in extracted:
        iw = item['width']
        ih = item['height']
        if cur_x + iw + padding > SHEET_W:
            cur_x = padding
            cur_y += row_height + padding
            row_height = 0
        sheet_items.append({
            'name': item['name'],
            'alias': item['alias'],
            'x': cur_x,
            'y': cur_y,
            'width': iw,
            'height': ih,
            'rgba': item['rgba']
        })
        cur_x += iw + padding
        row_height = max(row_height, ih)

    SHEET_H = cur_y + row_height + padding
    print(f'Packing sprites into master production spritesheet ({SHEET_W}x{SHEET_H})...')

    sheet_rgba = bytearray(SHEET_W * SHEET_H * 4) # completely initialized to 0 (alpha = 0)
    for s in sheet_items:
        sx = s['x']
        sy = s['y']
        sw = s['width']
        sh = s['height']
        srgba = s['rgba']
        for y in range(sh):
            dst_idx = ((sy + y) * SHEET_W + sx) * 4
            src_idx = (y * sw) * 4
            sheet_rgba[dst_idx : dst_idx + sw * 4] = srgba[src_idx : src_idx + sw * 4]

    master_sheet_path = 'assets/art/dark-room/production-spritesheet.png'
    save_png_rgba(master_sheet_path, SHEET_W, SHEET_H, sheet_rgba)
    print(f'Master spritesheet saved to {master_sheet_path} ({os.path.getsize(master_sheet_path)} bytes)')

    # Also update environment-assets.png to be this clean master spritesheet, so backwards compatibility is maintained!
    save_png_rgba('assets/art/dark-room/environment-assets.png', SHEET_W, SHEET_H, sheet_rgba)
    print(f'Updated assets/art/dark-room/environment-assets.png with clean transparent production sprites!')

    # Generate JSON Atlas
    atlas_dict = {}
    for s in sheet_items:
        atlas_dict[s['alias']] = {
            'x': s['x'],
            'y': s['y'],
            'width': s['width'],
            'height': s['height'],
            'file': f"assets/art/dark-room/sprites/{s['name']}.png"
        }
        if s['name'] != s['alias']:
            atlas_dict[s['name']] = atlas_dict[s['alias']]

    # Additional standard aliases for game compatibility
    aliases_mapping = {
        'satin_cushion': 'satin_cushion',
        'cuckoo_clock': 'cuckoo_clock',
        'grand_portal_pedestal': 'grand_portal_pedestal',
        'trueExitDoor': 'grand_portal_pedestal',
        'salto_final_sign': 'salto_final_sign',
        'wardrobe_ledge': 'wardrobe_portal',
        'dollhouse_roof': 'dollhouse_roof',
        'block_castle': 'block_castle',
        'train_trestle': 'train_trestle',
        'wall_shelf': 'wall_shelf',
        'mushroom_lamp': 'mushroom_lamp',
        'stepped_dresser': 'stepped_dresser',
        'messy_blocks': 'messy_blocks',
        'toy_drum': 'toy_drum',
        'cardboard_box': 'cardboard_box',
        'vanity_table': 'vanity_table',
        'open_books': 'open_books',
        'giant_bear': 'giant_bear',
        'spinning_globe': 'spinning_globe',
        'kite_frame': 'kite_frame',
        'floating_books': 'floating_books',
        'chandelier_crystals': 'chandelier_crystals',
        'curtain_rod': 'curtain_rod',
        'exitDoor': 'false_door',
        'rugs': 'mandala_rug'
    }
    for alias_k, target_k in aliases_mapping.items():
        if target_k in atlas_dict and alias_k not in atlas_dict:
            atlas_dict[alias_k] = atlas_dict[target_k]

    import json
    atlas_json_path = 'assets/art/dark-room/darkRoomAtlas.json'
    with open(atlas_json_path, 'w') as f:
        json.dump({
            'sheet': 'assets/art/dark-room/production-spritesheet.png',
            'width': SHEET_W,
            'height': SHEET_H,
            'sprites': atlas_dict
        }, f, indent=2)
    print(f'Atlas JSON written to {atlas_json_path}')

    # Write JS atlas module:
    js_content = f"""/**
 * darkRoomAtlas.js
 * Dicionário canônico de produção com todos os sprites isolados
 * e transparentes gerados a partir do pacote de arte dark-room.
 */

export const SHEET_WIDTH = {SHEET_W};
export const SHEET_HEIGHT = {SHEET_H};
export const SPRITESHEET_PATH = 'assets/art/dark-room/production-spritesheet.png';

export const darkRoomAtlas = {json.dumps(atlas_dict, indent=2)};

export function validateAtlasRegion(region, sheetW = SHEET_WIDTH, sheetH = SHEET_HEIGHT) {{
  if (!region || typeof region !== 'object') return false;
  const {{ x, y, width, height }} = region;
  if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') return false;
  if (x < 0 || y < 0 || width <= 0 || height <= 0) return false;
  if (x + width > sheetW || y + height > sheetH) return false;
  return true;
}}

export function getDarkRoomAtlasRegion(key) {{
  if (!key || typeof key !== 'string') return null;
  const direct = darkRoomAtlas[key];
  if (direct) return direct;
  const lower = key.toLowerCase();
  if (darkRoomAtlas[lower]) return darkRoomAtlas[lower];
  const underscore = lower.replace(/-/g, '_');
  if (darkRoomAtlas[underscore]) return darkRoomAtlas[underscore];
  return null;
}}
"""
    with open('src/js/assets/darkRoomAtlas.js', 'w') as f:
        f.write(js_content)
    print('Updated src/js/assets/darkRoomAtlas.js!')

if __name__ == '__main__':
    main()

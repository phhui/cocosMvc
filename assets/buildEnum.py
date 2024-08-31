import os

base_dir = 'sub'

output_dir = 'ext/res'
output_file = os.path.join(output_dir, 'resEnum.ts')

os.makedirs(output_dir, exist_ok=True)

def generate_enum(enum_name, items, prefix=None):
    lines = [f"export enum {enum_name} {{"]
    for item in items:
        if prefix:
            key = f"{prefix}_{item}"
        else:
            key = item
        lines.append(f"    {key}='{item}',")
    lines.append("}")
    return '\n'.join(lines)

def process_directories(parent_dir, enum_name):
    subdirs = [d for d in os.listdir(parent_dir) if os.path.isdir(os.path.join(parent_dir, d))]
    return {os.path.basename(d): os.path.join(parent_dir, d) for d in subdirs}

def main():
    top_dirs = process_directories(base_dir, 'BundleEnum')
    with open(output_file, 'w', encoding='utf-8') as ts_file:
        top_enum_items = list(top_dirs.keys())
        ts_file.write(generate_enum('BundleEnum', top_enum_items))
        ts_file.write('\n\n')

        icon_dir = top_dirs.get('icon')
        if icon_dir:
            icon_subdirs = process_directories(icon_dir, 'IconType')
            icon_enum_items = list(icon_subdirs.keys())
            ts_file.write(generate_enum('IconType', icon_enum_items))
            ts_file.write('\n\n')

        res_mem_dir = top_dirs.get('resMem')
        if res_mem_dir:
            img_dir = os.path.join(res_mem_dir, 'img')
            prefab_dir = os.path.join(res_mem_dir, 'prefab')

            if os.path.exists(img_dir):
                img_files = [f.split('.')[0] for f in os.listdir(img_dir) if os.path.isfile(os.path.join(img_dir, f)) and not f.endswith('.meta')]
                ts_file.write(generate_enum('ResMemImg', img_files, 'IMG'))
                ts_file.write('\n\n')

            if os.path.exists(prefab_dir):
                prefab_files = [f.split('.')[0] for f in os.listdir(prefab_dir) if os.path.isfile(os.path.join(prefab_dir, f)) and not f.endswith('.meta')]
                ts_file.write(generate_enum('ResMemPf', prefab_files, 'PF'))
                ts_file.write('\n\n')

if __name__ == "__main__":
    main()
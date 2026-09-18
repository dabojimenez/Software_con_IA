"""Organiza archivos de una carpeta en subcarpetas según su tipo."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

DEFAULT_SOURCE_DIR = Path(__file__).parent / "files"
DEFAULT_DESTINATION_DIR = Path(__file__).parent / "organized_files"

FILE_CATEGORIES = {
    "images": {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"},
    "documents": {".doc", ".docx", ".odt", ".pdf"},
    "spreadsheets": {".xls", ".xlsx", ".ods"},
    "text": {".txt", ".md", ".rst"},
    "data": {".csv", ".json", ".xml", ".yaml", ".yml"},
}


def category_for(file_path: Path) -> str:
    """Devuelve la categoría correspondiente a la extensión del archivo."""
    extension = file_path.suffix.lower()
    for category, extensions in FILE_CATEGORIES.items():
        if extension in extensions:
            return category
    return "others"


def unique_destination(destination: Path) -> Path:
    """Evita sobrescribir un archivo que ya existe en el destino."""
    if not destination.exists():
        return destination

    counter = 1
    while True:
        candidate = destination.with_name(
            f"{destination.stem}_{counter}{destination.suffix}"
        )
        if not candidate.exists():
            return candidate
        counter += 1


def organize_files(
    source_dir: Path, destination_dir: Path, dry_run: bool = False
) -> list[tuple[Path, Path]]:
    """Mueve los archivos del origen a subcarpetas del destino."""
    if not source_dir.is_dir():
        raise NotADirectoryError(f"No existe la carpeta de origen: {source_dir}")

    organized_files = []
    for file_path in sorted(source_dir.iterdir()):
        if not file_path.is_file():
            continue

        category_dir = destination_dir / category_for(file_path)
        target_path = unique_destination(category_dir / file_path.name)
        organized_files.append((file_path, target_path))

        if not dry_run:
            category_dir.mkdir(parents=True, exist_ok=True)
            shutil.move(str(file_path), str(target_path))

    return organized_files


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Organiza archivos en subcarpetas según su tipo."
    )
    parser.add_argument(
        "-s",
        "--source",
        type=Path,
        default=DEFAULT_SOURCE_DIR,
        help=f"Carpeta de origen (por defecto: {DEFAULT_SOURCE_DIR}).",
    )
    parser.add_argument(
        "-d",
        "--destination",
        type=Path,
        default=DEFAULT_DESTINATION_DIR,
        help=f"Carpeta de destino (por defecto: {DEFAULT_DESTINATION_DIR}).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Muestra los movimientos sin ejecutarlos.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    try:
        organized_files = organize_files(
            args.source, args.destination, dry_run=args.dry_run
        )
    except (OSError, ValueError) as error:
        print(f"Error: {error}")
        return 1

    action = "Se organizarían" if args.dry_run else "Se organizaron"
    print(f"{action} {len(organized_files)} archivos.")
    for source_path, target_path in organized_files:
        print(f"- {source_path.name} -> {target_path.parent.name}/{target_path.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
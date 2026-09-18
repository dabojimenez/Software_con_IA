"""Genera archivos de prueba con extensiones comunes y no ejecutables."""

from __future__ import annotations

import argparse
from pathlib import Path

SAFE_EXTENSIONS = (".pdf", ".xlsx", ".jpg", ".png", ".txt", ".csv", ".docx", ".json")
DEFAULT_OUTPUT_DIR = Path(__file__).parent / "files"
MAX_FILES = 10_000


def clear_existing_files(output_dir: Path) -> None:
    """Elimina los archivos existentes directamente dentro de la carpeta."""
    for file_path in output_dir.iterdir():
        if file_path.is_file():
            file_path.unlink()


def generate_files(count: int, output_dir: Path) -> list[Path]:
    """Limpia la carpeta y crea count archivos vacíos."""
    if count < 1:
        raise ValueError("La cantidad debe ser un entero mayor que 0.")
    if count > MAX_FILES:
        raise ValueError(f"La cantidad máxima permitida es {MAX_FILES}.")

    output_dir.mkdir(parents=True, exist_ok=True)
    clear_existing_files(output_dir)
    generated_paths = []

    for index in range(count):
        extension = SAFE_EXTENSIONS[index % len(SAFE_EXTENSIONS)]
        file_path = output_dir / f"generated_file_{index + 1:03d}{extension}"
        file_path.touch()
        generated_paths.append(file_path)

    return generated_paths


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Genera archivos vacíos con extensiones comunes y no ejecutables."
    )
    parser.add_argument(
        "count",
        type=int,
        help="Cantidad de archivos que se desea generar.",
    )
    parser.add_argument(
        "-o",
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help=f"Carpeta de salida (por defecto: {DEFAULT_OUTPUT_DIR}).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    try:
        generated_paths = generate_files(args.count, args.output_dir)
    except (OSError, ValueError) as error:
        print(f"Error: {error}")
        return 1

    print(f"Se generaron {len(generated_paths)} archivos en: {args.output_dir.resolve()}")
    for file_path in generated_paths:
        print(f"- {file_path.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

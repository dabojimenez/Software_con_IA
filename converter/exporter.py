"""Exporta la información de beers.json a un archivo CSV."""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Any

DEFAULT_INPUT_FILE = Path(__file__).parent / "beers.json"
DEFAULT_OUTPUT_FILE = Path(__file__).parent / "beers.csv"


def export_to_csv(input_file: Path, output_file: Path) -> int:
    """Convierte el JSON de cervezas a CSV y devuelve la cantidad de filas."""
    with input_file.open("r", encoding="utf-8") as json_file:
        beers: list[dict[str, Any]] = json.load(json_file)

    if not beers:
        raise ValueError("El archivo JSON no contiene registros.")

    fieldnames = ["cerveza", "Precio"]
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with output_file.open("w", encoding="utf-8-sig", newline="") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(
            {"cerveza": beer["marca"], "Precio": beer["precioUsd"]}
            for beer in beers
        )

    return len(beers)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Exporta un archivo JSON de cervezas a formato CSV."
    )
    parser.add_argument(
        "-i",
        "--input",
        type=Path,
        default=DEFAULT_INPUT_FILE,
        help=f"Archivo JSON de entrada (por defecto: {DEFAULT_INPUT_FILE}).",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT_FILE,
        help=f"Archivo CSV de salida (por defecto: {DEFAULT_OUTPUT_FILE}).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    try:
        record_count = export_to_csv(args.input, args.output)
    except (OSError, json.JSONDecodeError, TypeError, ValueError) as error:
        print(f"Error: {error}")
        return 1

    print(f"Se exportaron {record_count} registros a: {args.output.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
import secrets
import string


def password_generator(length):
    """Generate a password with letters, digits, and special characters."""
    if length < 1:
        raise ValueError("La longitud debe ser un número mayor que 0")

    characters = string.ascii_letters + string.digits + string.punctuation
    return "".join(secrets.choice(characters) for _ in range(length))


if __name__ == "__main__":
    try:
        length = int(input("Introduce la longitud de la contraseña: "))
        password = password_generator(length)
        print(password)
    except ValueError as error:
        print(f"Entrada no válida. Introduce un número entero mayor que 0: {error}")

# Plan: Aplicación de gastos personales

## Objetivo

Definir e implementar una aplicación sencilla para registrar, consultar, totalizar y eliminar gastos personales. Este documento describe el trabajo previsto; todavía no se debe escribir código.

## Alcance

- Registrar un gasto con concepto, cantidad, fecha y moneda.
- Consultar la lista de gastos registrados.
- Calcular y mostrar totales agrupados por moneda.
- Eliminar un gasto existente.
- No incluir usuarios, autenticación ni cuentas.
- No incluir conversiones de moneda, presupuestos, categorías, informes por período ni exportación.
- La fecha representa un día calendario, sin hora.

## Modelo del dominio

### Entidad: Gasto

Cada gasto representa un movimiento individual y contiene:

- `id`: identificador único, generado al registrar el gasto.
- `concepto`: descripción del gasto.
- `cantidad`: importe numérico positivo.
- `fecha`: día calendario en el que ocurrió el gasto.
- `moneda`: código o tipo de moneda del importe.

### Concepto derivado: Total por moneda

El total no se almacena como un gasto independiente. Se obtiene sumando las cantidades de los gastos de cada moneda. No se deben sumar entre sí importes expresados en monedas distintas.

## Reglas de negocio

1. Concepto, cantidad, fecha y moneda son obligatorios.
2. El concepto no puede estar vacío después de quitar espacios al inicio y al final.
3. La cantidad debe ser numérica y estrictamente mayor que cero. No se admiten reembolsos ni ajustes negativos.
4. La fecha debe ser válida y tratarse como fecha calendario, sin hora.
5. La moneda debe pertenecer al conjunto de monedas admitidas por la aplicación.
6. Los gastos pueden compartir concepto, cantidad y fecha; no se consideran duplicados automáticamente.
7. El total se calcula por moneda. No se presenta una suma mezclada ni se aplican tasas de cambio.
8. Solo se elimina un gasto que exista y pueda identificarse por su `id`.
9. Una lista vacía se muestra como tal; los totales disponibles se muestran como cero para las monedas que corresponda.

## Casos de uso

### Registrar gasto

**Entrada:** concepto, cantidad, fecha y moneda.

**Flujo:** validar los campos, asignar un identificador y guardar el gasto.

**Resultado:** el gasto aparece en la consulta y se incluye en el total de su moneda.

### Consultar gastos

**Entrada:** ninguna en la versión inicial.

**Flujo:** recuperar los gastos registrados y mostrarlos con concepto, cantidad, fecha y moneda.

**Resultado:** lista de gastos o estado vacío si no hay registros.

### Calcular total

**Entrada:** gastos registrados.

**Flujo:** agrupar por moneda y sumar las cantidades dentro de cada grupo.

**Resultado:** un total por cada moneda presente; nunca un total convertido o combinado.

### Eliminar gasto

**Entrada:** identificador del gasto seleccionado.

**Flujo:** comprobar que el gasto existe y eliminarlo.

**Resultado:** el gasto deja de aparecer en la lista y se actualiza el total correspondiente.

## Errores y respuestas esperadas

- **Concepto ausente o vacío:** indicar que se debe proporcionar una descripción.
- **Cantidad ausente o no numérica:** solicitar un importe válido.
- **Cantidad cero o negativa:** indicar que el importe debe ser mayor que cero.
- **Fecha ausente o inválida:** solicitar una fecha válida.
- **Moneda ausente o no admitida:** pedir que se seleccione una moneda válida.
- **Gasto inexistente al consultar o eliminar:** informar que ya no está disponible y no modificar los datos.
- **Fallo al guardar, leer o eliminar:** informar que la operación no se completó y evitar mostrarla como exitosa.
- **Sin gastos registrados:** mostrar el estado vacío y totales en cero, sin tratarlo como un error.

## Pasos de implementación posteriores

1. Confirmar plataforma, tecnologías y mecanismo de almacenamiento antes de iniciar la implementación; esos detalles aún no están decididos.
2. Definir el conjunto inicial de monedas admitidas y cómo se representan sus cantidades y formatos.
3. Implementar el modelo de `Gasto` y validaciones de las reglas de negocio.
4. Implementar almacenamiento y operaciones para registrar, consultar y eliminar gastos.
5. Implementar la interfaz para captura, listado, totales por moneda y eliminación.
6. Añadir y ejecutar pruebas de reglas, casos de uso, errores y actualización de totales.

## Criterios de verificación

- Un gasto válido se registra con identificador, concepto, cantidad, fecha y moneda.
- No se aceptan campos obligatorios vacíos, fechas inválidas ni cantidades no positivas.
- Consultar devuelve los gastos guardados; una lista vacía se representa correctamente.
- Los totales son correctos por moneda y no combinan monedas diferentes.
- Eliminar un gasto existente lo quita de la lista y actualiza el total; intentar eliminar uno inexistente produce un error controlado.
- Los fallos de almacenamiento no se presentan como operaciones exitosas.
- No se incorporan usuarios ni autenticación.

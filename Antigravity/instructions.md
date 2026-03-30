# Reglas de la aplicación

**Objetivo:** Practicar:

- Intervalos

Mástil interactivo de guitarra.

La aplicación debe tener un menú pidiéndote qué es lo que quieres practicar, las opciones son: (después se agregarán más)

- Intervalos

Debe haber un input que pida el número de preguntas con las que quieres empezar.

Debe haber un botón que diga “Comenzar” para iniciar con las preguntas.

La aplicación elige una tónica aleatoria, a partir de ella, el usuario debe seleccionar el intervalo correcto.

La aplicación pregunta por el intervalo en este formato.

Selecciona un intervalo de 3M

A partir de la tónica, el usuario debe seleccionar la respuesta correcta.

Debe haber un botón de verificar respuesta que se habilita cuando el usuario haya seleccionado una nota. Al hacer click, las notas o intervalos se revelan.

Una vez se seleccionó la respuesta, si la respuesta es correcta, se revelan las notas seleccionadas, se ponen en verde y se dispara confeti.

Si la respuesta no es correcta, las notas que sí fueron correctas, se ponen en color verde y las incorrectas en color rojo.

Si es incorrecto, la respuesta también se revela con un color resaltado para que el usuario vea cuál era la respuesta correcta.

Debe haber un botón que diga → siguiente pregunta.

Se reinicia el proceso.

Al finalizar con el “N” número de preguntas que el usuario seleccionó, debe mostrar una pantalla de resumen indicando el M/N. Donde M: es el número de respuestas correctas, N: el número de preguntas totales. El resumen incluye también los intervalos preguntados, cuántos fueron correctos y cuántos incorrectos. Ejemplo.

Preguntas correctas: 15/20

- 2M 2/2 → Es decir, se preguntó la 2M 2 veces y las 2 se respondieron correctamente
- 3M 0/3 → Es decir, se preguntó la 3M 3 veces y las 3 se respondieron incorrectamente

### Reglas de lógicas

El intervalo correcto válido será a una octava, siempre ascendente.

La tónica se muestra, es decir aparece el círculo y la nota musical, pero si el usuario selecciona otras notas en el mástil, estás deberán estar escondidas, es decir solo mostrar el circulo sin que aparezca que nota, esto se mantiene oculto hasta que el usuario da click en verificar respuesta, en este caso, la nota se revela.

Los colores son:

- Tónica: Morado
- Notas seleccionadas: Azul
- Notas incorrectas: rojo
- Notas correctas: verde

Reglas de preguntas

Todos los intervalos preguntarlos con la tónica a partir del 5to traste en adelante.

**Hacia amos lados**: significa que verificará hacía ambos lados. Por ejemplo si la tónica es un A, 6ta cuerda, 5to traste. La respuesta correcta será seleccionar el B en 6ta cuerda traste 7 y también el B en 5ta cuerda traste 2. Si solo selecciona uno de estos o tiene uno mal y otro bien, la respuesta es incorrecta.

Intervalos:

- 2M y 2m: Hacia ambos lados en las cuerdas [2-6]
- 3M y 3m: Hacia ambos lados en las cuerdas [2-6]
- 4J: Única dirección en las cuerdas [2-6]
- 5J: Hacia ambos lados en las cuerdas [2-6]
    - En la segunda cuerda solo existe hacía la derecha
- 6M y 6m: Hacia ambos lados en las cuerdas [2-6]
    - En la segunda cuerda solo existe hacía la derecha
- 7M y 7m: Única dirección en las cuerdas [2-6]
- 8: Hacia ambos lados en las cuerdas [3-6]
    - En la tercera cuerda solo existe hacía la derecha

Ejemplo de intervalos izq y der. A manera de ejemplo todos están con tónica en 5to traste y a manera de ejemplo describo solo los intervalos mayores, para los menores es lo mismo pero todo un traste atrás.

### **Cuerdas consecutivas**

**2M. Tónica A, 2M: B**

- 6ta cuerda
    - Derecha: traste 7 misma cuerda
    - Izquierda: traste 2 cuerda 5
- 5ta cuerda
    - Derecha: traste 7 misma cuerda
    - Izquierda: traste 2 cuerda 4
- 4ta cuerda
    - Derecha: traste 7 misma cuerda
    - Izquierda: traste 2 cuerda 3
- 3ra cuerda
    - Derecha: traste 7 misma cuerda
    - Izquierda: traste 3 cuerda 2
- 2da cuerda
    - Derecha: traste 7 misma cuerda
    - Izquierda: traste 2 cuerda 1

**3M. Tónica A, 3M: C#**

- 6ta cuerda
    - Derecha: traste 9 misma cuerda
    - Izquierda: traste 4 cuerda 5
- 5ta cuerda
    - Derecha: traste 9 misma cuerda
    - Izquierda: traste 4 cuerda 4
- 4ta cuerda
    - Derecha: traste 9 misma cuerda
    - Izquierda: traste 4 cuerda 3
- 3ra cuerda
    - Derecha: traste 9 misma cuerda
    - Izquierda: traste 5 cuerda 2
- 2da cuerda
    - Derecha: traste 9 misma cuerda
    - Izquierda: traste 4 cuerda 1

**4J. Tónica A, 3M: D - Unidireccional**

- 6ta cuerda
    - 4J: traste 5, cuerda 5
- 5ta cuerda
    - 4J: traste 5 cuerda 4
- 4ta cuerda
    - 4J: traste 5, cuerda 3
- 3ra cuerda
    - 4J: traste 6, cuerda 2
- 2da cuerda
    - 4J: traste 5, cuerda 1

### Cuerdas No consecutivas

**5J. Tónica A, 5J: E** 

- 6ta cuerda
    - Derecha: traste 7 cuerda 5
    - Izquierda: traste 2 cuerda 4
- 5ta cuerda
    - Derecha: traste 7 cuerda 4
    - Izquierda: traste 2 cuerda 3
- 4ta cuerda
    - Derecha: traste 7 cuerda 3
    - Izquierda: traste 3 cuerda 2
- 3ra cuerda
    - Derecha: traste 8 cuerda 2
    - Izquierda: traste 3 cuerda 1
- 2da cuerda
    - Derecha: traste 7 cuerda 1
    - Izquierda: No hay

**6M. Tónica A, 6M: F#m**

- 6ta cuerda
    - Derecha: traste 9 cuerda 5
    - Izquierda: traste 4 cuerda 4
- 5ta cuerda
    - Derecha: traste 9 cuerda 4
    - Izquierda: traste 4 cuerda 3
- 4ta cuerda
    - Derecha: traste 9 cuerda 3
    - Izquierda: traste 5 cuerda 2
- 3ra cuerda
    - Derecha: traste 10 cuerda 2
    - Izquierda: traste 5 cuerda 1
- 2da cuerda
    - Derecha: traste 9 cuerda 1
    - Izquierda: No hay

**7M. Tónica A, 7M: G# - Unidireccional**

- 6ta cuerda
    - 7M: traste 6, cuerda 4
- 5ta cuerda
    - 7M: traste 6 cuerda 3
- 4ta cuerda
    - 7M: traste 7, cuerda 2
- 3ra cuerda
    - 7M: traste 7, cuerda 1
- 2da cuerda
    - No hay

**8vas. Tónica A, 8J: A**

- 6ta cuerda
    - Derecha: traste 7 cuerda 4
    - Izquierda: traste 2 cuerda 3
- 5ta cuerda
    - Derecha: traste 7 cuerda 3
    - Izquierda: traste 3 cuerda 2
- 4ta cuerda
    - Derecha: traste 8 cuerda 2
    - Izquierda: traste 3 cuerda 1
- 3ra cuerda
    - Derecha: traste 8 cuerda 1
    - Izquierda: No hay
- 2da cuerda
    - Derecha: No hay
    - Izquierda: No hay

- Los nombres de las notas de las escala deben ser de esta manera.
    - Ejemplo 3m de G no es A#, es Bb
    - Ejemplo: 2m de C no es C#, es Db
    - Para esto te proveo las 15 escalas mayores posibles para que te bases en esto

Escalas posibles:

- C: C D E F G A B C
- G: G A B C D E F# G
- D:  D E F# G A B C# D
- A: A B C# D E F# G# A
- E: E F# G# A B C# D# E
- B: B C# D# E F# G# A# B
- F#: F# G# A# B C# D# E# F#
- C#: C# D# E# F# G# A# B# C#
- F: F G A Bb C D E F
- Bb: Bb C D Eb F G A Bb
- Eb: Eb F G Ab Bb C D Eb
- Ab: Ab C Db Eb F G Ab
- Db: Db Eb F Gb Ab Bb C Db
- Gb: Gb Ab Bb Cb Db Eb F Gb
- Cb: Cb Db Eb Fb Gb Ab Bb Cb

Por lo tanto la tónica nunca será A#, en su lugar será Bb, estás son las 15 tónicas y escalas posibles.


Botón de finalizar, esto por si el usuario quiere finalizar antes de que termine el total de preguntas a hacer, redirecciona a la pantalla de estadísticas y muestra el total de preguntas hechas en lugar de las seleccionadas.

Si el usuario seleccionó 20 preguntas y al final, solo hizo 15 y da click en el botón de terminar, en las estadísticas dirá Número de respues correctas sobre 15, NO sobre 20
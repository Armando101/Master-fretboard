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

El orden de los intervalos mostrados en la pantalla final de estadísticas debe estar ordenado del intervalo con mayor preguntas acertadas, al intervalo con menor preguntas acertadas. Para los intervalos que tienen el mismo número de preguntas acertadas, se ordenan por orden de intervalo, siendo el intervalo de 2m el primero y el intervalo de 8va el último

### Escalas

En este momento sólo se desarrollara el soporte a preguntas sobre escala mayor, a una 8va y en las cuerdas restantes dada una tónica. La escala se puede preguntar a la derecha, centro o izquierda.

1 8va - Ejemplo en A

Derecha 

- A B C# → cuerda 6, trastes 5, 7 y 9
- D E F# → cuerda 5, trastes 5, 7 y 9
- G# A → cuerda 4, trates 6 y 7

Centro

- A B → cuerda 6, trastes 5 y 7
- C# D E → cuerda 5, trastes 4, 5 y 7
- F# G# A → cuerda 4, trastes 4, 6 y 7

Izquierda 

- A → cuerda 6, traste 5
- B C# D → cuerda 5, trastes 2, 4, 5
- E F# G# → cuerda 4, trastes 2, 4, 6
- A → cuerda 3, traste 2

En las 6 cuerdas

Derecha 

- A B C# → cuerda 6, trastes 5, 7 y 9
- D E F# → cuerda 5, trastes 5, 7 y 9
- G# A B → cuerda 4, trates 6, 7 y 9
- C# D E → cuerda 3, trastes 6, 7 y 9
- F# G# A → cuerda 2, trastes 7, 9 y 10
- B C# D → cuerda 1, trastes 7, 9 y 10

Centro

- A B → cuerda 6, trastes 5 y 7
- C# D E → cuerda 5, trastes 4, 5 y 7
- F# G# A → cuerda 4, trastes 4, 6 y 7
- B C# D → cuerda 3, trastes 4, 6 y 7
- E F# G# → cuerda 2, traste 5, 7 y 9
- A B C# → cuerda 1, traste 5, 7 y 9

Izquierda 

- A → cuerda 6, traste 5
- B C# D → cuerda 5, trastes 2, 4, 5
- E F# G# → cuerda 4, trastes 2, 4, 6
- A B C#→ cuerda 3, traste 2, 4, 6
- D E F# → cuerda 2, traste 3, 5, 7
- G# A B → cuerda 1, traste 4, 5, 7

Se da una tónica y a partir de ahí el usuario debe completar según lo que se le pida, la escala a una 8va o en todas las cuerdas restantes, entiéndase por cuerdas restantes, lo siguiente: si la tónica se da en la cuerda 4, el usuario debe completar la escala desde la cuerda 4 hasta la 1 (cuerdas 5 y 6 se omiten). Si se da la tónica en la cuerda 5, la escala se debe completar desde esa cuerda hasta la 1 (cuerda 6 se omite).

Los trastes de tónica pueden ser:

- Derecha: Del traste 1 al 12
- Centro: Del traste 2 al 12
- Izquierda: Del traste 4 al 12

Las cuerdas disponibles tanto para 1 8va como para todas las restantes son:

- Derecha: Cuerdas 3 a la 6.
- Centro: Cuerdas 3 a la 6
- Izquierda: Cuerdas 4 a la 6

La única escala que es la misma tanto si se pide una 8va o si se pide todas las cuerdas restantes, es la escala al centro en 3ra cuerda, ejemplo

Ejemplo tomando en cuenta que la tónica está en cuerda 3 tónica en C traste 5, Al centro.

- C D → cuerda 3, traste 5 y 6
- E F G → cuerda 2, traste 5, 6, 8
- A B C → cuerda 1, traste 5, 7 y 8

En total es una 8va y también son todas las cuerdas posibles, ya no hay más, por lo tanto esta sería una respuesta válida tanto para una 8va como para todas las cuerdas restantes.

Ejemplo tomando en cuenta que la tónica está en cuerda 4 tónica en G traste 5,  a la izquierda, a una 8va.

- G → cuerda 4, traste 5
- A B C → cuerda 3, trastes 2, 4, 5
- D E F# → cuerda 2, trastes 3, 5, 7
- G → cuerda 1, traste 3

Lo mismo pero en todas las cuerdas restantes

- G → cuerda 4, traste 5
- A B C → cuerda 3, trastes 2, 4, 5
- D E F# → cuerda 2, trastes 3, 5, 7
- G A B → cuerda 1, traste 3, 5, 7

Como se puede ver, aquí las dos respuestas son diferentes por una diferencia de dos notas.


# Triadas
Necesito que en la pantalla inicial agregues dos select box que sólo se va a activar cuando el usuario seleccione la opción de preguntar triadas.

Los select box va a tener las siguientes opciones de triada:

- Todas
- Fundamental
- 1ra Inversión
- 2da Inversión

Y el otro estas opciones de cualidades

- Todas
- Mayor
- Menor
- Sus2
- Sus4
- Disminuido
- Aumentado

Las triadas las preguntar dando la tónica, misma dinámica que en la sección de intervalos y escalas.

### Triadas fundamentales

La tónica puede estar en las cuerdas [6, 5, 4, 3].

Y se va a preguntar del traste 5 al traste 12.

Ejemplo: Todas con tónica en el traste 5 y cuerda 6

- Tónica A, cualidad: Mayor → A C# E → Cuerdas 6, 5 y 4, trastes 5, 4 y 2
- Tónica A, cualidad: Menor → A C E → Cuerdas 6, 5 y 4, trastes 5, 3 y 2
- Tónica A, cualidad: Sus2 → A B E → Cuerdas 6, 5 y 4, trastes 5, 2 y 2
- Tónica A, cualidad: Sus4 → A D E → Cuerdas 6, 5 y 4, trastes 5, 5 y 2
- Tónica A, cualidad: Disminuido → A C Eb → Cuerdas 6, 5 y 4, trastes 5, 3 y 1
- Tónica A, cualidad: Aumentado → A C# E# → Cuerdas 6, 5 y 4, trastes 5, 4 y 3

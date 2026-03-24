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
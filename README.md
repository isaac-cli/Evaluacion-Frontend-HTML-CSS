# TechStore

## Descripción del Proyecto

TechStore es un sitio web estático desarrollado utilizando HTML5, CSS3 y Git. El proyecto representa una tienda tecnológica preparada para futuras funcionalidades como carrito de compras, registro de usuarios y formularios avanzados.

---

## Tecnologías Utilizadas

* HTML5
* CSS3
* Flexbox
* Git
* GitHub

---

## Estructura de Carpetas

```text
TechStore/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── img/
│   ├── notebook.jpg
│   ├── teclado.jpg
│   └── mouse.jpg
│
└── pages/
```

---

## Prompts Utilizados Durante el Desarrollo

### Prompt 1

Genera una estructura HTML5 semántica para una tienda tecnológica utilizando header, nav, main, section y footer.

Uso:
Crear la estructura principal del sitio web.

---

### Prompt 2

Crea una página web orientada a una tienda tecnológica incluyendo una sección de productos y una sección de contacto.

Uso:
Definir el contenido principal del sitio.

---

### Prompt 3

Genera estilos CSS externos modernos para una tienda tecnológica utilizando una combinación de colores profesional.

Uso:
Diseñar visualmente la página.

---

### Prompt 4

Implementa Flexbox para organizar tarjetas de productos de forma responsiva.

Uso:
Distribuir correctamente los productos en pantalla.

---

### Prompt 5

Genera un formulario HTML5 con validaciones básicas para nombre, correo electrónico y mensaje.

Uso:
Agregar una funcionalidad de contacto.

---

### Prompt 6

Sugiere una estructura de carpetas adecuada para un proyecto Front-End desarrollado con HTML y CSS.

Uso:
Organizar correctamente los archivos del proyecto.

---


## Comandos Git Utilizados

### Inicialización

```bash
git init
```

### Configuración

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "correo@ejemplo.com"
```

### Primer Commit

```bash
git add .
git commit -m "Estructura inicial del proyecto"
```

### Creación de Ramas

```bash
git branch develop
git branch feature/estructura
git branch feature/estilos
```

### Cambio de Rama

```bash
git checkout feature/estructura
```

### Commit de Estructura

```bash
git add .
git commit -m "Se agrega estructura HTML semántica"
```

### Commit de Estilos

```bash
git checkout feature/estilos

git add .
git commit -m "Se agregan estilos CSS y Flexbox"
```

### Merge de Ramas

```bash
git checkout develop

git merge feature/estructura

git merge feature/estilos

git checkout main

git merge develop
```

### Conexión con GitHub

```bash
git remote add origin https://github.com/TU_USUARIO/Evaluacion-Frontend-HTML-CSS.git
```

### Subida a GitHub

```bash
git push -u origin main

git push origin develop

git push origin feature/estructura

git push origin feature/estilos
```

---

## Autor

Gary Gutiérrez

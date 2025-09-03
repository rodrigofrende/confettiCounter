# 💰 MoneyMetrics

Una aplicación web moderna y elegante para gestionar tus finanzas personales con objetivos claros y seguimiento de progreso.

![MoneyMetrics](https://img.shields.io/badge/Status-Activo-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-blue)

## 🎯 Características Principales

### 📊 **Gestión de Objetivos Financieros**
- Crea y gestiona múltiples objetivos de ahorro
- Establece fechas límite y montos objetivo
- Seguimiento visual del progreso con barras animadas
- Personalización con emojis y colores únicos
- Reordenamiento por drag & drop

### 💸 **Seguimiento de Transacciones**
- Registra ingresos y gastos fácilmente
- Historial completo de transacciones
- Edición y eliminación de transacciones
- Asociación automática con objetivos
- Límite de caracteres optimizado (35 caracteres)

### 📈 **Estadísticas Detalladas**
- Resumen financiero completo
- Cálculo automático de ingresos, gastos y balance
- Promedio por transacción
- Gráficos de progreso visual

### 🏅 **Sistema de Logros** *(Próximamente)*
- 8 logros diferentes para motivar el ahorro
- Categorías: Objetivos, Ahorros, Transacciones, Hitos
- Diseño misterioso con efecto "Próximamente"
- Progreso general de logros desbloqueados

### 🎨 **Experiencia de Usuario**
- Diseño responsive para móvil y desktop
- Animaciones suaves y transiciones elegantes
- Interfaz intuitiva y fácil de usar
- Persistencia de datos en localStorage
- Pantalla de bienvenida para nuevos usuarios

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animaciones**: CSS Transitions + Framer Motion
- **Drag & Drop**: @dnd-kit
- **Iconos**: Heroicons + Emojis
- **Build Tool**: Vite
- **Linting**: ESLint

## 📦 Instalación y Uso

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/rodrigofrende/confettiCounter.git
   cd confettiCounter
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Ejecuta la aplicación en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   ```
   http://localhost:5173
   ```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🎮 Cómo Usar la Aplicación

### 1. **Primera Vez**
- Al abrir la aplicación, verás una pantalla de bienvenida
- Crea tu primer objetivo financiero
- Establece un monto objetivo y fecha límite
- Personaliza con emoji y color

### 2. **Gestionar Objetivos**
- **Crear**: Haz clic en "Nuevo Objetivo"
- **Editar**: Usa los botones de edición en cada objetivo
- **Reordenar**: Arrastra y suelta para cambiar el orden
- **Eliminar**: Usa el botón de eliminar (🗑️)

### 3. **Agregar Dinero**
- Haz clic en "Ahorrar" en cualquier objetivo
- Ingresa el monto y descripción
- Elige entre agregar o quitar dinero
- El progreso se actualiza automáticamente

### 4. **Ver Historial**
- Ve a la pestaña "Historial"
- Revisa todas tus transacciones
- Edita o elimina transacciones según necesites

### 5. **Estadísticas**
- Consulta la pestaña "Estadísticas"
- Ve tu resumen financiero completo
- Explora el sistema de logros (próximamente)

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── Achievements.tsx  # Sistema de logros
│   ├── AddMoneyModal.tsx # Modal para agregar dinero
│   ├── GoalForm.tsx      # Formulario de objetivos
│   ├── GoalProgress.tsx  # Progreso de objetivos
│   ├── GoalSettings.tsx  # Configuración inicial
│   ├── MoneyInput.tsx    # Input de dinero
│   ├── ResetButton.tsx   # Botón de reset
│   ├── Statistics.tsx    # Estadísticas
│   ├── Tabs.tsx          # Sistema de pestañas
│   ├── TransactionList.tsx # Lista de transacciones
│   └── WelcomeScreen.tsx # Pantalla de bienvenida
├── hooks/                # Custom hooks
│   ├── useLazyLoad.ts    # Carga perezosa
│   └── usePagination.ts  # Paginación
├── utils/                # Utilidades
│   └── moneyFormatter.ts # Formateo de dinero
├── types.ts              # Tipos TypeScript
├── App.tsx               # Componente principal
└── main.tsx              # Punto de entrada
```

## 🎨 Características de Diseño

- **Paleta de Colores**: Gradientes azules suaves
- **Tipografía**: Sistema de fuentes optimizado
- **Espaciado**: Sistema de espaciado consistente
- **Responsive**: Diseño adaptativo para todos los dispositivos
- **Accesibilidad**: Contraste y navegación por teclado

## 🔧 Configuración Avanzada

### Personalización de Colores
Los colores principales se pueden modificar en `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    }
  }
}
```

### Almacenamiento de Datos
La aplicación usa `localStorage` para persistir datos:
- `moneymetrics-transactions`: Transacciones
- `moneymetrics-goals`: Objetivos
- `moneymetrics-visited`: Estado de visita

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si quieres contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

### Próximas Características
- [ ] **Sistema de Logros Funcional**: Implementar lógica de desbloqueo
- [ ] **Exportación de Datos**: PDF y Excel
- [ ] **Categorías de Gastos**: Clasificación automática
- [ ] **Gráficos Avanzados**: Charts.js o similar
- [ ] **Notificaciones**: Recordatorios de objetivos
- [ ] **Modo Oscuro**: Tema dark/light
- [ ] **Sincronización en la Nube**: Firebase/Supabase
- [ ] **App Móvil**: React Native

## 🐛 Reportar Bugs

Si encuentras algún bug, por favor:
1. Verifica que no esté ya reportado en [Issues](https://github.com/rodrigofrende/confettiCounter/issues)
2. Crea un nuevo issue con:
   - Descripción detallada del problema
   - Pasos para reproducir
   - Capturas de pantalla si es necesario
   - Información del navegador y sistema operativo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Rodrigo Frende**
- GitHub: [@rodrigofrende](https://github.com/rodrigofrende)

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Framework de UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [@dnd-kit](https://dndkit.com/) - Drag and drop
- [Heroicons](https://heroicons.com/) - Iconos
- [Vite](https://vitejs.dev/) - Build tool

---

⭐ **¡Si te gusta este proyecto, no olvides darle una estrella!** ⭐

---

*MoneyMetrics - Gestiona tus finanzas con objetivos claros* 💰
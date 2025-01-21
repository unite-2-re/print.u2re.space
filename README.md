# 🏠 OS.U2RE 🏠

> 🪟 **OS:** <https://os.u2re.space/> 🪟

Full remake of that project.

Possible code-names: "Aderal", "Adeline", "Adel"...

---

## 🧩 Conception and Description 🧩

<...>, a core component of the **U2RE.OS** family, embarks on a pioneering journey to redefine the essence of design and functionality within the realm of operating systems and user interfaces. Inspired by the evocative principles of **Material Design 3 (Material You)**, <...> integrates a dynamic and personalized approach to design, allowing for a deeply customizable experience that resonates with the user's style and preferences.

## 🎨 Design Philosophy 🎨

At the heart of <...> lies a commitment to a seamless, fluid, and adaptable design ethos. Drawing inspiration from an array of influential design systems, including **Fluent Design, Xiaomi/MIUI/HyperOS**, and others, <...> harmonizes these influences into a unique, coherent visual language. Key to this endeavor is the implementation of light and dark themes, enabling users to choose the aesthetic that best suits their mood or needs, while also prioritizing eye comfort and accessibility.

The design further explores the possibilities of HDR and AMOLED displays, with a focus on delivering vivid, lifelike colors and deep contrasts that make every interaction a delight. To achieve this, the primary color model currently employed is **oklch**, with plans to explore and incorporate more advanced color models to enhance visual fidelity and user experience.

## 🏛️ Technical Architecture 🏛️

<...> is crafted with a modular and asynchronous model at its core, which redefines how the DOM operates by emphasizing dynamic interactions over static engagements. Event handling is sophisticatedly designed to support various implementation strategies, such as binding to specific selector representatives, employing delegation, or targeting directly, thus offering flexibility and efficiency in response to user actions.

This architecture lays the foundation for the development of a desktop/launcher/environment envisaged as a Web application or Progressive Web App (PWA), signifying <...>'s commitment to creating an environment that is inherently adaptable and responsive across different device categories—mobile phones, tablets, terminals, and to a lesser extent, desktops and laptops.

## 📱 Platform and Development Environment 📱

<...> is primarily developed and tested on **Chrome Canary** or **Edge Canary**, leveraging the cutting-edge capabilities enabled by their experimental features. While the framework includes certain fallback mechanisms, these are not the majority, pointing to a forward-looking, modern web technologies-driven approach.

## 🗄️ Build and Server Architecture 🗄️

Complementing the build process, **Fastify** has been selected as the server framework of choice for its high performance and low overhead characteristics. Fastify's emphasis on speed and its rich ecosystem of plugins make it an ideal companion for developing lightweight and fast server-side applications. Although ... is currently designed to operate primarily in an offline setting, Fastify lays the groundwork for potential future expansions where server-side rendering, API interactions, or other server-dependent features might be explored.

---

## What is done?

- [x] Full screen mode (refinement) 💻
- [x] Support adding your own icons to the desktop 🖼️
- [x] Support adding your own links to the icon 🔗
- [x] Fix overlapping of icons in the grid 🩹
- [x] Basic multi-windowed UI (for desktops and tablets) 🪟
- [x] Backdrop and modal (message, menu) support 🧩
- [x] Import and export settings
- [x] Custom wallpaper support (by OPFS)
- [x] Make-up some design refinements
- [x] Improved context menu (mouse support)
- [x] Hide common visualization and interact issues
- [x] Colorization by wallpaper
- [x] Basic Item Edit
- [x] Basic Actions (such as open links)
- [x] Dragging workspace elements
- [x] Wallpaper management
- [x] Basic Settings
- [x] Basic Grid Settings (rows/columns)
- [x] Orientation-fixed wallpaper
- [x] Orientation-fixed grid-layout
- [x] Basic animations (under construction)
- [x] Resizable and draggable windowed frames
- [x] Export/Import settings (I thinking about it)
- [x] Calendar (Taskbar)
- [x] Wallpapers support
  - [x] Accent colors support

### Planned in next-season or done partially

- [ ] Hello or installation screen, with first-run customization 🎨
- [ ] Lock screen and pin code (for example `0001`) 🔒
- [ ] Full control over screen orientation 📱
- [ ] More complete package of actions in the registry 📦
- [ ] Some notifications support (floating message or window form) 🔔
- [ ] More settings and options (such as UI saturation, contrast) 🔧
- [ ] Multi-level context menu, better design
- [ ] Better Modularization (color pick system)
- [ ] Better Debuggable
- [ ] Better UI elements
  - [ ] Sidebar (Settings, Manager)
  - [ ] Maximize Window (Desktop)
- [ ] File manager
  - [x] Done only wallpaper manager
  - [ ] Directory navigation
- [ ] Better Settings
- [ ] Soft DPI Scaling
- [ ] More Others...

---

**Hidden plans that are scheduled for release:**

- Calendar in TaskBar, Quick Settings
- Improved file manager, directories support
- Support for HFS or backend file systems
- Improved color scheme (dual and more color)
- Additional colors due to Hue shifts of 45 degrees on OkLCH
- Will be used, for example, folder icons
- Some important also will have another colors

---

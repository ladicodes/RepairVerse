import type { ModelAsset } from "./missions";

/**
 * Laptops a learner can put on the bench. Every device shares one normalized
 * frame (base 3.2 units wide) so hotspots and the internal cooling illustration
 * line up on any model. Specs describe the model line in general terms; exact
 * parts vary by configuration, so the UI tells learners to check the service
 * manual for their own unit.
 */
export interface DeviceLook {
  /** Top case (palm rest and deck). */
  deck: string;
  bottom: string;
  lid: string;
  /** "metal" uses brushed aluminium, "soft" a matte coated finish. */
  finish: "metal" | "soft";
  keycap: string;
  legend: string;
  /** Backlight color; legends glow when set. */
  backlight?: string;
  /** Gap between keys in world units. Smaller looks like an edge-to-edge keyboard. */
  keyGap: number;
  numpad: boolean;
  trackpoint?: boolean;
  /** Emissive strip along the front edge. */
  lightbar?: string;
  rearVent?: boolean;
}

export const DEVICE_CATEGORIES = [
  "Everyday laptop",
  "Thin ultrabook",
  "Business laptop",
  "Gaming laptop",
  "2-in-1 convertible",
  "Pro laptop",
  "Mobile workstation",
  "Creator laptop",
] as const;

export type DeviceCategory = (typeof DEVICE_CATEGORIES)[number];

export interface Device {
  id: string;
  brand: string;
  name: string;
  /** Class label shown on picker cards and used by the picker filter. */
  category: DeviceCategory;
  screen: string;
  weight: string;
  cooling: string;
  /** What the technician should expect when this model overheats. */
  benchNote: string;
  accent: string;
  look: DeviceLook;
  model: ModelAsset;
}

export const devices: Device[] = [
  {
    id: "hp-15",
    brand: "HP",
    name: "HP 15",
    category: "Everyday laptop",
    screen: '15.6"',
    weight: "1.6 kg",
    cooling: "Single fan, rear hinge exhaust",
    benchNote:
      "Budget 15-inch models often live on beds and sofas. Fabric blocks the bottom intake and lint collects on the fin stack.",
    accent: "#22d3ee",
    look: {
      deck: "#dde1e6",
      bottom: "#aab0b8",
      lid: "#dde1e6",
      finish: "metal",
      keycap: "#d6d9de",
      legend: "rgba(48,53,61,0.9)",
      keyGap: 0.024,
      numpad: true,
    },
    model: {
      url: "/models/hp-15.glb",
      source: "lux3d",
      prompt:
        "A 15.6-inch everyday laptop, lid open, natural silver aluminium chassis, light gray keyboard with numeric keypad, large trackpad, visible side air vents, studio lighting",
    },
  },
  {
    id: "dell-xps-13",
    brand: "Dell",
    name: "Dell XPS 13",
    category: "Thin ultrabook",
    screen: '13.4"',
    weight: "1.2 kg",
    cooling: "Small fans, narrow rear vent",
    benchNote:
      "Thin chassis leave little thermal headroom. A partly blocked vent or dried thermal paste shows up as heat quickly.",
    accent: "#a5b4fc",
    look: {
      deck: "#e6e7ea",
      bottom: "#c9ccd1",
      lid: "#e3e5e8",
      finish: "metal",
      keycap: "#2a2d33",
      legend: "rgba(235,238,242,0.92)",
      backlight: "#e8f1ff",
      keyGap: 0.008,
      numpad: false,
    },
    model: {
      url: "/models/dell-xps-13.glb",
      source: "lux3d",
      prompt:
        "A 13-inch premium ultrabook, lid open, platinum silver machined aluminium, edge-to-edge black backlit keyboard without numeric keypad, glass trackpad, very thin profile, studio lighting",
    },
  },
  {
    id: "thinkpad-t14",
    brand: "Lenovo",
    name: "ThinkPad T14",
    category: "Business laptop",
    screen: '14"',
    weight: "1.4 kg",
    cooling: "Single fan, side and rear exhaust",
    benchNote:
      "Business fleets run these for years without service. Dust builds slowly, so the fan gets louder month by month before shutdowns start.",
    accent: "#f87171",
    look: {
      deck: "#25272b",
      bottom: "#1c1e21",
      lid: "#222428",
      finish: "soft",
      keycap: "#16181b",
      legend: "rgba(225,228,232,0.9)",
      keyGap: 0.03,
      numpad: false,
      trackpoint: true,
    },
    model: {
      url: "/models/thinkpad-t14.glb",
      source: "lux3d",
      prompt:
        "A 14-inch business laptop, lid open, matte black soft-touch chassis, sculpted black keyboard with a red pointing stick between the G and H keys, three trackpad buttons, side vents, studio lighting",
    },
  },
  {
    id: "rog-strix-g16",
    brand: "ASUS",
    name: "ROG Strix G16",
    category: "Gaming laptop",
    screen: '16"',
    weight: "2.5 kg",
    cooling: "Multiple fans, rear and side exhaust",
    benchNote:
      "Gaming loads push the CPU and GPU together. Dust on the fin stacks and pet hair in the intake are the usual causes of thermal shutdowns.",
    accent: "#8b5cf6",
    look: {
      deck: "#3a3d44",
      bottom: "#26282d",
      lid: "#34373d",
      finish: "metal",
      keycap: "#1b1d22",
      legend: "rgba(34,211,238,0.95)",
      backlight: "#22d3ee",
      keyGap: 0.026,
      numpad: true,
      lightbar: "#8b5cf6",
      rearVent: true,
    },
    model: {
      url: "/models/rog-strix-g16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch gaming laptop, lid open, dark gunmetal gray chassis, black keyboard with cyan RGB backlight and numeric keypad, purple light bar along the front edge, large rear exhaust vents, studio lighting",
    },
  },
  {
    id: "hp-spectre-x360-14",
    brand: "HP",
    name: "Spectre x360 14",
    category: "2-in-1 convertible",
    screen: '14"',
    weight: "1.4 kg",
    cooling: "Dual fans, exhaust through the hinge edge",
    benchNote:
      "Convertibles are often used folded as tablets on laps or blankets, which blocks the intake under the base.",
    accent: "#d4a373",
    look: {
      deck: "#2b2f3a",
      bottom: "#23262f",
      lid: "#2b2f3a",
      finish: "metal",
      keycap: "#1d2028",
      legend: "rgba(232,220,198,0.92)",
      backlight: "#fff4e0",
      keyGap: 0.012,
      numpad: false,
    },
    model: {
      url: "/models/hp-spectre-x360-14.glb",
      source: "lux3d",
      prompt:
        "A 14-inch premium 2-in-1 convertible laptop, lid open, dark navy-black aluminium chassis with gold-toned edges, black backlit keyboard without numeric keypad, wide trackpad, chamfered corners, studio lighting",
    },
  },
  {
    id: "hp-omen-16",
    brand: "HP",
    name: "Omen 16",
    category: "Gaming laptop",
    screen: '16.1"',
    weight: "2.3 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Long gaming sessions on a desk mat still pull in fibers. Clogged rear fins push both CPU and GPU into throttling.",
    accent: "#f43f5e",
    look: {
      deck: "#1f2125",
      bottom: "#17181b",
      lid: "#26282c",
      finish: "soft",
      keycap: "#141518",
      legend: "rgba(240,242,245,0.92)",
      backlight: "#ffffff",
      rearVent: true,
      keyGap: 0.026,
      numpad: true,
    },
    model: {
      url: "/models/hp-omen-16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch gaming laptop, lid open, matte black chassis, black backlit keyboard with numeric keypad, large rear exhaust vents, angular hinge, studio lighting",
    },
  },
  {
    id: "dell-inspiron-15",
    brand: "Dell",
    name: "Inspiron 15",
    category: "Everyday laptop",
    screen: '15.6"',
    weight: "1.7 kg",
    cooling: "Single fan, rear hinge exhaust",
    benchNote:
      "Student and home laptops collect dust and crumbs for years without a cleaning. The single fan has little reserve once the fins clog.",
    accent: "#38bdf8",
    look: {
      deck: "#2f3238",
      bottom: "#25282d",
      lid: "#33363c",
      finish: "soft",
      keycap: "#1a1c20",
      legend: "rgba(225,228,232,0.9)",
      keyGap: 0.026,
      numpad: true,
    },
    model: {
      url: "/models/dell-inspiron-15.glb",
      source: "lux3d",
      prompt:
        "A 15.6-inch everyday laptop, lid open, matte carbon black plastic chassis, black keyboard with numeric keypad, centered trackpad, side vents, studio lighting",
    },
  },
  {
    id: "dell-latitude-5440",
    brand: "Dell",
    name: "Latitude 5440",
    category: "Business laptop",
    screen: '14"',
    weight: "1.4 kg",
    cooling: "Single fan, side exhaust",
    benchNote:
      "Office fleets sit docked with the lid closed for hours. Heat builds up when the side vent faces a wall or a monitor stand.",
    accent: "#60a5fa",
    look: {
      deck: "#3a3d42",
      bottom: "#2e3135",
      lid: "#3a3d42",
      finish: "soft",
      keycap: "#1c1e22",
      legend: "rgba(225,228,232,0.9)",
      backlight: "#f1f5f9",
      keyGap: 0.03,
      numpad: false,
    },
    model: {
      url: "/models/dell-latitude-5440.glb",
      source: "lux3d",
      prompt:
        "A 14-inch business laptop, lid open, matte titan gray chassis, black keyboard without numeric keypad, plain trackpad, side vents and many ports, studio lighting",
    },
  },
  {
    id: "alienware-m16",
    brand: "Dell",
    name: "Alienware m16",
    category: "Gaming laptop",
    screen: '16"',
    weight: "3.2 kg",
    cooling: "Quad-fan layout, rear thermal shelf exhaust",
    benchNote:
      "High-wattage parts depend on clean airflow. Dust on the rear fin stacks shows up as fan roar, frame drops, then shutdowns.",
    accent: "#22d3ee",
    look: {
      deck: "#20232a",
      bottom: "#181a1f",
      lid: "#262a31",
      finish: "metal",
      keycap: "#121418",
      legend: "rgba(125,211,252,0.95)",
      backlight: "#38bdf8",
      rearVent: true,
      keyGap: 0.026,
      numpad: true,
    },
    model: {
      url: "/models/alienware-m16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch premium gaming laptop, lid open, dark metallic gray chassis, black keyboard with cyan backlight and numeric keypad, extended rear section with large exhaust vents, studio lighting",
    },
  },
  {
    id: "lenovo-ideapad-slim-5",
    brand: "Lenovo",
    name: "IdeaPad Slim 5",
    category: "Everyday laptop",
    screen: '15.3"',
    weight: "1.7 kg",
    cooling: "Single fan, rear hinge exhaust",
    benchNote:
      "Thin everyday laptops run warm under load. A dusty fan or a soft surface under the base is enough to trigger shutdowns.",
    accent: "#93c5fd",
    look: {
      deck: "#b7bcc3",
      bottom: "#9ea4ac",
      lid: "#b7bcc3",
      finish: "metal",
      keycap: "#c3c7cc",
      legend: "rgba(48,53,61,0.9)",
      keyGap: 0.024,
      numpad: true,
    },
    model: {
      url: "/models/lenovo-ideapad-slim-5.glb",
      source: "lux3d",
      prompt:
        "A 15-inch thin everyday laptop, lid open, light cloud gray aluminium chassis, gray keyboard with numeric keypad, large trackpad, studio lighting",
    },
  },
  {
    id: "lenovo-legion-5",
    brand: "Lenovo",
    name: "Legion 5",
    category: "Gaming laptop",
    screen: '16"',
    weight: "2.4 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Gaming laptops on carpets or beds starve the bottom intake. Dust and pet hair on the fins are common at the bench.",
    accent: "#a78bfa",
    look: {
      deck: "#2c3038",
      bottom: "#22252b",
      lid: "#2f333b",
      finish: "soft",
      keycap: "#16181c",
      legend: "rgba(240,242,245,0.92)",
      backlight: "#ffffff",
      rearVent: true,
      keyGap: 0.026,
      numpad: true,
    },
    model: {
      url: "/models/lenovo-legion-5.glb",
      source: "lux3d",
      prompt:
        "A 16-inch gaming laptop, lid open, dark storm gray chassis, black backlit keyboard with numeric keypad, rear exhaust vents and rear ports, studio lighting",
    },
  },
  {
    id: "lenovo-yoga-7",
    brand: "Lenovo",
    name: "Yoga 7",
    category: "2-in-1 convertible",
    screen: '14"',
    weight: "1.5 kg",
    cooling: "Single fan, hinge exhaust",
    benchNote:
      "Tent and tablet modes put the vents in odd places. Blocked intake while folded is a common reason for heat complaints.",
    accent: "#c4b5fd",
    look: {
      deck: "#4a5059",
      bottom: "#3d424a",
      lid: "#4a5059",
      finish: "metal",
      keycap: "#3b4048",
      legend: "rgba(232,236,240,0.9)",
      backlight: "#f1f5f9",
      keyGap: 0.02,
      numpad: false,
    },
    model: {
      url: "/models/lenovo-yoga-7.glb",
      source: "lux3d",
      prompt:
        "A 14-inch 2-in-1 convertible laptop, lid open, storm gray aluminium chassis, dark gray backlit keyboard without numeric keypad, rounded edges, 360-degree hinge, studio lighting",
    },
  },
  {
    id: "asus-zenbook-14",
    brand: "ASUS",
    name: "Zenbook 14",
    category: "Thin ultrabook",
    screen: '14"',
    weight: "1.2 kg",
    cooling: "Single fan, rear hinge exhaust",
    benchNote:
      "Very thin builds leave little headroom. A small layer of dust on the fin stack raises temperatures quickly.",
    accent: "#818cf8",
    look: {
      deck: "#2f3a55",
      bottom: "#283149",
      lid: "#2f3a55",
      finish: "metal",
      keycap: "#26304a",
      legend: "rgba(220,228,240,0.92)",
      backlight: "#e6eeff",
      keyGap: 0.016,
      numpad: false,
    },
    model: {
      url: "/models/asus-zenbook-14.glb",
      source: "lux3d",
      prompt:
        "A 14-inch thin ultrabook, lid open, deep blue aluminium chassis, dark blue backlit keyboard without numeric keypad, wide trackpad, very thin profile, studio lighting",
    },
  },
  {
    id: "asus-vivobook-15",
    brand: "ASUS",
    name: "Vivobook 15",
    category: "Everyday laptop",
    screen: '15.6"',
    weight: "1.7 kg",
    cooling: "Single fan, rear hinge exhaust",
    benchNote:
      "Budget models often run years without service. Lint in the intake and a dusty fan are the usual findings.",
    accent: "#67e8f9",
    look: {
      deck: "#c3c7cd",
      bottom: "#a9aeb5",
      lid: "#c3c7cd",
      finish: "soft",
      keycap: "#2b2e33",
      legend: "rgba(230,233,237,0.9)",
      keyGap: 0.026,
      numpad: true,
    },
    model: {
      url: "/models/asus-vivobook-15.glb",
      source: "lux3d",
      prompt:
        "A 15.6-inch everyday laptop, lid open, silver plastic chassis, dark gray keyboard with numeric keypad, centered trackpad, studio lighting",
    },
  },
  {
    id: "acer-aspire-5",
    brand: "Acer",
    name: "Aspire 5",
    category: "Everyday laptop",
    screen: '15.6"',
    weight: "1.8 kg",
    cooling: "Single fan, rear and side exhaust",
    benchNote:
      "Mid-range laptops are common in homes and schools. Dust buildup and use on soft surfaces cause most overheating tickets.",
    accent: "#5eead4",
    look: {
      deck: "#8a9098",
      bottom: "#737980",
      lid: "#8a9098",
      finish: "metal",
      keycap: "#1d1f23",
      legend: "rgba(232,235,239,0.9)",
      backlight: "#f5f5f5",
      keyGap: 0.026,
      numpad: true,
    },
    model: {
      url: "/models/acer-aspire-5.glb",
      source: "lux3d",
      prompt:
        "A 15.6-inch everyday laptop, lid open, steel gray aluminium chassis, black backlit keyboard with numeric keypad, trackpad, side vents, studio lighting",
    },
  },
  {
    id: "acer-nitro-v-15",
    brand: "Acer",
    name: "Nitro V 15",
    category: "Gaming laptop",
    screen: '15.6"',
    weight: "2.1 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Entry gaming laptops run hot by design. Clogged fins and a dried thermal interface push them past their limits.",
    accent: "#ef4444",
    look: {
      deck: "#1c1d20",
      bottom: "#151618",
      lid: "#1f2023",
      finish: "soft",
      keycap: "#121315",
      legend: "rgba(252,165,165,0.95)",
      backlight: "#ef4444",
      rearVent: true,
      keyGap: 0.026,
      numpad: true,
    },
    model: {
      url: "/models/acer-nitro-v-15.glb",
      source: "lux3d",
      prompt:
        "A 15.6-inch entry gaming laptop, lid open, matte black chassis, black keyboard with red backlight and numeric keypad, rear exhaust vents, studio lighting",
    },
  },
  {
    id: "acer-swift-go-14",
    brand: "Acer",
    name: "Swift Go 14",
    category: "Thin ultrabook",
    screen: '14"',
    weight: "1.3 kg",
    cooling: "Single fan, rear hinge exhaust",
    benchNote:
      "Light laptops travel in bags and get used on laps. A blocked intake plus dust on the small fan quickly limits performance.",
    accent: "#cbd5e1",
    look: {
      deck: "#c9ccd0",
      bottom: "#b0b4b9",
      lid: "#c9ccd0",
      finish: "metal",
      keycap: "#2a2d32",
      legend: "rgba(232,235,239,0.9)",
      backlight: "#ffffff",
      keyGap: 0.016,
      numpad: false,
    },
    model: {
      url: "/models/acer-swift-go-14.glb",
      source: "lux3d",
      prompt:
        "A 14-inch thin ultrabook, lid open, pure silver aluminium chassis, dark backlit keyboard without numeric keypad, large trackpad, slim profile, studio lighting",
    },
  },
  {
    id: "macbook-pro-14",
    brand: "Apple",
    name: "MacBook Pro 14",
    category: "Pro laptop",
    screen: '14.2"',
    weight: "1.6 kg",
    cooling: "Dual fans, rear exhaust behind the hinge",
    benchNote:
      "Sustained video exports and builds keep the fans busy. Dust on the fins and blocked intakes under the base raise temperatures.",
    accent: "#e5e7eb",
    look: {
      deck: "#c8cbcf",
      bottom: "#b5b8bc",
      lid: "#c8cbcf",
      finish: "metal",
      keycap: "#111214",
      legend: "rgba(225,228,232,0.92)",
      backlight: "#ffffff",
      keyGap: 0.012,
      numpad: false,
    },
    model: {
      url: "/models/macbook-pro-14.glb",
      source: "lux3d",
      prompt:
        "A 14-inch professional laptop, lid open, silver aluminium unibody chassis, black backlit keyboard without numeric keypad, very large glass trackpad, flat slab design, studio lighting",
    },
  },
  {
    id: "msi-katana-15",
    brand: "MSI",
    name: "Katana 15",
    category: "Gaming laptop",
    screen: '15.6"',
    weight: "2.3 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Plastic gaming chassis trap heat. Dust on the shared heat pipe fins usually shows up as fan noise first.",
    accent: "#f87171",
    look: {
      deck: "#202226",
      bottom: "#17181b",
      lid: "#232529",
      finish: "soft",
      keycap: "#141518",
      legend: "rgba(252,165,165,0.95)",
      backlight: "#ef4444",
      rearVent: true,
      keyGap: 0.026,
      numpad: true,
    },
    model: {
      url: "/models/msi-katana-15.glb",
      source: "lux3d",
      prompt:
        "A 15.6-inch gaming laptop, lid open, matte black chassis, black keyboard with red backlight and numeric keypad, angular rear exhaust vents, studio lighting",
    },
  },
  {
    id: "surface-laptop-5",
    brand: "Microsoft",
    name: "Surface Laptop 5",
    category: "Thin ultrabook",
    screen: '13.5"',
    weight: "1.3 kg",
    cooling: "Single fan, exhaust through the hinge gap",
    benchNote:
      "The vent hides in the hinge gap. Using it with the lid tilted far back against a wall or cushion traps hot air.",
    accent: "#a3e635",
    look: {
      deck: "#cfd2d6",
      bottom: "#b9bcc0",
      lid: "#cfd2d6",
      finish: "metal",
      keycap: "#c4c7cb",
      legend: "rgba(48,53,61,0.9)",
      keyGap: 0.02,
      numpad: false,
    },
    model: {
      url: "/models/surface-laptop-5.glb",
      source: "lux3d",
      prompt:
        "A 13.5-inch thin laptop, lid open, platinum aluminium chassis, light gray keyboard without numeric keypad, wide trackpad, tall screen, studio lighting",
    },
  },
  {
    id: "macbook-pro-16",
    brand: "Apple",
    name: "MacBook Pro 16",
    category: "Pro laptop",
    screen: '16.2"',
    weight: "2.1 kg",
    cooling: "Dual fans, rear exhaust behind the hinge",
    benchNote:
      "Long renders and builds keep both fans working. Dust on the fins and blocked base intakes raise sustained temperatures.",
    accent: "#a1a1aa",
    look: {
      deck: "#2b2c2f",
      bottom: "#232427",
      lid: "#2b2c2f",
      finish: "metal",
      keycap: "#0f1012",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.012,
      numpad: false,
    },
    model: {
      url: "/models/macbook-pro-16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch professional laptop, lid open, space black aluminium unibody chassis, black backlit keyboard without numeric keypad, very large glass trackpad, flat slab design, studio lighting",
    },
  },
  {
    id: "dell-precision-5690",
    brand: "Dell",
    name: "Precision 5690",
    category: "Mobile workstation",
    screen: '16"',
    weight: "2.0 kg",
    cooling: "Dual fans, rear and hinge exhaust",
    benchNote:
      "Workstation GPUs run long simulations at full load. Clogged fin stacks show up as throttled renders before any shutdown.",
    accent: "#38bdf8",
    look: {
      deck: "#3b3f46",
      bottom: "#2f3238",
      lid: "#3b3f46",
      finish: "metal",
      keycap: "#16181c",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.01,
      numpad: false,
    },
    model: {
      url: "/models/dell-precision-5690.glb",
      source: "lux3d",
      prompt:
        "A 16-inch premium mobile workstation laptop, lid open, dark graphite aluminium chassis, black edge-to-edge backlit keyboard without numeric keypad, large glass trackpad, thin bezels, studio lighting",
    },
  },
  {
    id: "dell-xps-16",
    brand: "Dell",
    name: "XPS 16",
    category: "Creator laptop",
    screen: '16.3"',
    weight: "2.1 kg",
    cooling: "Dual fans, rear hinge exhaust",
    benchNote:
      "Creator workloads push CPU and GPU together. Dust in the narrow rear vent raises temperatures fast in this slim chassis.",
    accent: "#94a3b8",
    look: {
      deck: "#4a4d55",
      bottom: "#3d4047",
      lid: "#4a4d55",
      finish: "metal",
      keycap: "#1a1c20",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.006,
      numpad: false,
    },
    model: {
      url: "/models/dell-xps-16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch premium creator laptop, lid open, graphite aluminium chassis, zero-gap black backlit keyboard without numeric keypad, seamless glass trackpad, touch function row, studio lighting",
    },
  },
  {
    id: "dell-xps-14",
    brand: "Dell",
    name: "XPS 14",
    category: "Creator laptop",
    screen: '14.5"',
    weight: "1.7 kg",
    cooling: "Dual fans, rear hinge exhaust",
    benchNote:
      "A small chassis with a discrete GPU has little thermal margin. A partly blocked vent shows up as heat quickly.",
    accent: "#cbd5e1",
    look: {
      deck: "#d9dbdf",
      bottom: "#c4c7cc",
      lid: "#d9dbdf",
      finish: "metal",
      keycap: "#25272c",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.006,
      numpad: false,
    },
    model: {
      url: "/models/dell-xps-14.glb",
      source: "lux3d",
      prompt:
        "A 14-inch premium creator laptop, lid open, platinum silver aluminium chassis, zero-gap black backlit keyboard without numeric keypad, seamless glass trackpad, studio lighting",
    },
  },
  {
    id: "dell-latitude-9450",
    brand: "Dell",
    name: "Latitude 9450",
    category: "Business laptop",
    screen: '14"',
    weight: "1.5 kg",
    cooling: "Dual fans, rear hinge exhaust",
    benchNote:
      "Executive laptops spend hours on video calls while docked. Dust and a closed lid against the dock limit airflow.",
    accent: "#7dd3fc",
    look: {
      deck: "#3f444c",
      bottom: "#34383f",
      lid: "#3f444c",
      finish: "metal",
      keycap: "#1c1e22",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.006,
      numpad: false,
    },
    model: {
      url: "/models/dell-latitude-9450.glb",
      source: "lux3d",
      prompt:
        "A 14-inch premium business laptop, lid open, dark gray aluminium chassis, zero-lattice black backlit keyboard without numeric keypad, collaboration touchpad, slim profile, studio lighting",
    },
  },
  {
    id: "hp-zbook-studio-g11",
    brand: "HP",
    name: "ZBook Studio G11",
    category: "Mobile workstation",
    screen: '16"',
    weight: "1.8 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Slim workstations trade thermal headroom for weight. Dusty fans cause throttling during long exports.",
    accent: "#22d3ee",
    look: {
      deck: "#2f3238",
      bottom: "#26292e",
      lid: "#2f3238",
      finish: "metal",
      keycap: "#141518",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.014,
      numpad: false,
    },
    model: {
      url: "/models/hp-zbook-studio-g11.glb",
      source: "lux3d",
      prompt:
        "A 16-inch slim mobile workstation laptop, lid open, dark silver aluminium chassis, black backlit keyboard without numeric keypad, large trackpad, speaker grilles beside the keyboard, studio lighting",
    },
  },
  {
    id: "hp-zbook-fury-16-g11",
    brand: "HP",
    name: "ZBook Fury 16 G11",
    category: "Mobile workstation",
    screen: '16"',
    weight: "2.6 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Desktop-class workstation parts produce a lot of heat. Fin stacks clog under constant load in dusty studios.",
    accent: "#0ea5e9",
    look: {
      deck: "#34373d",
      bottom: "#2a2c31",
      lid: "#34373d",
      finish: "metal",
      keycap: "#16181b",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      rearVent: true,
      keyGap: 0.026,
      numpad: true,
    },
    model: {
      url: "/models/hp-zbook-fury-16-g11.glb",
      source: "lux3d",
      prompt:
        "A 16-inch heavy-duty mobile workstation laptop, lid open, dark gray aluminium chassis, black backlit keyboard with numeric keypad, large trackpad, big rear exhaust vents, studio lighting",
    },
  },
  {
    id: "hp-elitebook-1040-g11",
    brand: "HP",
    name: "EliteBook 1040 G11",
    category: "Business laptop",
    screen: '14"',
    weight: "1.2 kg",
    cooling: "Single fan, rear hinge exhaust",
    benchNote:
      "Thin business laptops run warm during calls. Use on soft surfaces and slow dust build-up are common causes.",
    accent: "#60a5fa",
    look: {
      deck: "#c3c7cd",
      bottom: "#aeb3ba",
      lid: "#c3c7cd",
      finish: "metal",
      keycap: "#2a2d32",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.02,
      numpad: false,
    },
    model: {
      url: "/models/hp-elitebook-1040-g11.glb",
      source: "lux3d",
      prompt:
        "A 14-inch premium business laptop, lid open, silver aluminium chassis, dark gray backlit keyboard without numeric keypad, wide trackpad, slim bezels, studio lighting",
    },
  },
  {
    id: "hp-spectre-x360-16",
    brand: "HP",
    name: "Spectre x360 16",
    category: "2-in-1 convertible",
    screen: '16"',
    weight: "2.0 kg",
    cooling: "Dual fans, hinge exhaust",
    benchNote:
      "Large convertibles are often used folded or on laps. Blocked intakes under the base cause most heat complaints.",
    accent: "#c8a27a",
    look: {
      deck: "#2b2f3a",
      bottom: "#23262f",
      lid: "#2b2f3a",
      finish: "metal",
      keycap: "#1d2028",
      legend: "rgba(232,220,198,0.92)",
      backlight: "#fff4e0",
      keyGap: 0.012,
      numpad: false,
    },
    model: {
      url: "/models/hp-spectre-x360-16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch premium 2-in-1 convertible laptop, lid open, dark slate blue aluminium chassis with gold-toned edges, black backlit keyboard without numeric keypad, wide haptic trackpad, chamfered corners, studio lighting",
    },
  },
  {
    id: "thinkpad-x1-carbon-g12",
    brand: "Lenovo",
    name: "ThinkPad X1 Carbon Gen 12",
    category: "Business laptop",
    screen: '14"',
    weight: "1.1 kg",
    cooling: "Single fan, side and rear exhaust",
    benchNote:
      "Ultralight business laptops have small fans. Dust and fleet use without service slowly raise temperatures.",
    accent: "#ef4444",
    look: {
      deck: "#1f2124",
      bottom: "#191b1e",
      lid: "#1f2124",
      finish: "soft",
      keycap: "#141619",
      legend: "rgba(232,235,239,0.92)",
      trackpoint: true,
      backlight: "#ffffff",
      keyGap: 0.03,
      numpad: false,
    },
    model: {
      url: "/models/thinkpad-x1-carbon-g12.glb",
      source: "lux3d",
      prompt:
        "A 14-inch ultralight business laptop, lid open, matte black carbon-fibre-weave chassis, sculpted black backlit keyboard with a red pointing stick between the G and H keys, three trackpad buttons, studio lighting",
    },
  },
  {
    id: "thinkpad-p1-gen-7",
    brand: "Lenovo",
    name: "ThinkPad P1 Gen 7",
    category: "Mobile workstation",
    screen: '16"',
    weight: "1.8 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Thin workstations under CAD load depend on clean fins. Dust shows up as fan noise, then throttling.",
    accent: "#dc2626",
    look: {
      deck: "#222428",
      bottom: "#1b1d20",
      lid: "#222428",
      finish: "soft",
      keycap: "#15171a",
      legend: "rgba(232,235,239,0.92)",
      trackpoint: true,
      backlight: "#ffffff",
      keyGap: 0.028,
      numpad: false,
    },
    model: {
      url: "/models/thinkpad-p1-gen-7.glb",
      source: "lux3d",
      prompt:
        "A 16-inch mobile workstation laptop, lid open, matte black chassis, sculpted black backlit keyboard with a red pointing stick between the G and H keys, three trackpad buttons, rear vents, studio lighting",
    },
  },
  {
    id: "lenovo-legion-pro-7i",
    brand: "Lenovo",
    name: "Legion Pro 7i",
    category: "Gaming laptop",
    screen: '16"',
    weight: "2.7 kg",
    cooling: "Triple fans, rear and side exhaust",
    benchNote:
      "High-wattage gaming hardware needs clean airflow. Dust and carpet use cause shutdowns under load.",
    accent: "#8b5cf6",
    look: {
      deck: "#2a2d33",
      bottom: "#202227",
      lid: "#2a2d33",
      finish: "metal",
      keycap: "#141518",
      legend: "rgba(196,181,253,0.95)",
      backlight: "#a78bfa",
      rearVent: true,
      keyGap: 0.026,
      numpad: true,
    },
    model: {
      url: "/models/lenovo-legion-pro-7i.glb",
      source: "lux3d",
      prompt:
        "A 16-inch premium gaming laptop, lid open, dark eclipse black aluminium chassis, black keyboard with purple RGB backlight and numeric keypad, rear exhaust vents with light strip, studio lighting",
    },
  },
  {
    id: "lenovo-yoga-pro-9i",
    brand: "Lenovo",
    name: "Yoga Pro 9i",
    category: "Creator laptop",
    screen: '16"',
    weight: "2.1 kg",
    cooling: "Dual fans, rear hinge exhaust",
    benchNote:
      "Creators edit for hours on sofas and desks. Blocked bottom intakes and dust on the fins raise GPU temperatures.",
    accent: "#a5b4fc",
    look: {
      deck: "#5a5f68",
      bottom: "#4b5058",
      lid: "#5a5f68",
      finish: "metal",
      keycap: "#3a3f47",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#f1f5f9",
      keyGap: 0.018,
      numpad: true,
    },
    model: {
      url: "/models/lenovo-yoga-pro-9i.glb",
      source: "lux3d",
      prompt:
        "A 16-inch creator laptop, lid open, luna gray aluminium chassis, dark gray backlit keyboard with numeric keypad, large trackpad, rounded edges, studio lighting",
    },
  },
  {
    id: "asus-proart-studiobook-16",
    brand: "ASUS",
    name: "ProArt Studiobook 16",
    category: "Creator laptop",
    screen: '16"',
    weight: "2.4 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Long colour-grading sessions keep the GPU busy. Dust on the fin stacks reduces performance before shutdowns.",
    accent: "#94a3b8",
    look: {
      deck: "#1d1f23",
      bottom: "#17191c",
      lid: "#1d1f23",
      finish: "metal",
      keycap: "#121316",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.02,
      numpad: true,
    },
    model: {
      url: "/models/asus-proart-studiobook-16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch professional creator laptop, lid open, matte black aluminium chassis, black backlit keyboard with numeric keypad, large trackpad with a physical control dial at the top-left, studio lighting",
    },
  },
  {
    id: "asus-proart-p16",
    brand: "ASUS",
    name: "ProArt P16",
    category: "Creator laptop",
    screen: '16"',
    weight: "1.9 kg",
    cooling: "Dual fans, rear exhaust",
    benchNote:
      "Thin creator laptops with a strong GPU leave little thermal headroom. Clean fins matter a lot.",
    accent: "#64748b",
    look: {
      deck: "#1e2024",
      bottom: "#18191c",
      lid: "#1e2024",
      finish: "metal",
      keycap: "#131417",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.012,
      numpad: false,
    },
    model: {
      url: "/models/asus-proart-p16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch slim creator laptop, lid open, nano black aluminium chassis, black backlit keyboard without numeric keypad, very large trackpad, minimal design, studio lighting",
    },
  },
  {
    id: "asus-rog-zephyrus-g14",
    brand: "ASUS",
    name: "ROG Zephyrus G14",
    category: "Gaming laptop",
    screen: '14"',
    weight: "1.5 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Compact gaming laptops run hot by design. Dust on the small fin stacks quickly causes throttling.",
    accent: "#e5e7eb",
    look: {
      deck: "#c9ccd1",
      bottom: "#b3b7bd",
      lid: "#c9ccd1",
      finish: "metal",
      keycap: "#2a2d32",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.018,
      numpad: false,
    },
    model: {
      url: "/models/asus-rog-zephyrus-g14.glb",
      source: "lux3d",
      prompt:
        "A 14-inch compact gaming laptop, lid open, platinum white aluminium chassis, dark backlit keyboard without numeric keypad, wide trackpad, slim profile, studio lighting",
    },
  },
  {
    id: "asus-rog-zephyrus-g16",
    brand: "ASUS",
    name: "ROG Zephyrus G16",
    category: "Gaming laptop",
    screen: '16"',
    weight: "1.9 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Thin gaming laptops depend on unblocked intakes. Lap and bed use plus dust cause most overheating.",
    accent: "#9ca3af",
    look: {
      deck: "#3a3d43",
      bottom: "#2f3237",
      lid: "#3a3d43",
      finish: "metal",
      keycap: "#16181b",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.018,
      numpad: false,
    },
    model: {
      url: "/models/asus-rog-zephyrus-g16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch thin gaming laptop, lid open, eclipse gray aluminium chassis, black backlit keyboard without numeric keypad, large trackpad, slim rear vents, studio lighting",
    },
  },
  {
    id: "asus-expertbook-b9",
    brand: "ASUS",
    name: "ExpertBook B9",
    category: "Business laptop",
    screen: '14"',
    weight: "1.0 kg",
    cooling: "Single fan, side exhaust",
    benchNote:
      "Very light business laptops have small cooling systems. Dust in the single fan quickly limits performance.",
    accent: "#475569",
    look: {
      deck: "#232631",
      bottom: "#1c1f28",
      lid: "#232631",
      finish: "metal",
      keycap: "#16181f",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.022,
      numpad: false,
    },
    model: {
      url: "/models/asus-expertbook-b9.glb",
      source: "lux3d",
      prompt:
        "A 14-inch ultralight business laptop, lid open, star black magnesium-lithium chassis, black backlit keyboard without numeric keypad, trackpad, very thin profile, studio lighting",
    },
  },
  {
    id: "razer-blade-16",
    brand: "Razer",
    name: "Blade 16",
    category: "Gaming laptop",
    screen: '16"',
    weight: "2.4 kg",
    cooling: "Vapor chamber, dual fans, rear exhaust",
    benchNote:
      "Premium gaming laptops in CNC aluminium get hot to the touch. Dust in the fans and blocked bottom intakes cause shutdowns.",
    accent: "#22c55e",
    look: {
      deck: "#141516",
      bottom: "#101112",
      lid: "#141516",
      finish: "metal",
      keycap: "#0d0e0f",
      legend: "rgba(134,239,172,0.95)",
      backlight: "#22c55e",
      keyGap: 0.02,
      numpad: false,
    },
    model: {
      url: "/models/razer-blade-16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch premium gaming laptop, lid open, matte black CNC aluminium unibody chassis, black keyboard with green per-key RGB backlight without numeric keypad, large glass trackpad, speaker grilles beside keyboard, studio lighting",
    },
  },
  {
    id: "razer-blade-14",
    brand: "Razer",
    name: "Blade 14",
    category: "Gaming laptop",
    screen: '14"',
    weight: "1.8 kg",
    cooling: "Vapor chamber, dual fans, rear exhaust",
    benchNote:
      "A small aluminium chassis spreads heat into the case. Dust in the fans pushes surface temperatures up fast.",
    accent: "#4ade80",
    look: {
      deck: "#151617",
      bottom: "#111213",
      lid: "#151617",
      finish: "metal",
      keycap: "#0d0e0f",
      legend: "rgba(134,239,172,0.95)",
      backlight: "#22c55e",
      keyGap: 0.02,
      numpad: false,
    },
    model: {
      url: "/models/razer-blade-14.glb",
      source: "lux3d",
      prompt:
        "A 14-inch compact premium gaming laptop, lid open, matte black aluminium unibody chassis, black RGB backlit keyboard without numeric keypad, glass trackpad, speaker grilles beside keyboard, studio lighting",
    },
  },
  {
    id: "msi-stealth-16-ai-studio",
    brand: "MSI",
    name: "Stealth 16 AI Studio",
    category: "Gaming laptop",
    screen: '16"',
    weight: "2.0 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Thin performance laptops run near their limits. Dust on the fins quickly causes throttling.",
    accent: "#3b82f6",
    look: {
      deck: "#1f2a44",
      bottom: "#19223a",
      lid: "#1f2a44",
      finish: "metal",
      keycap: "#141b2e",
      legend: "rgba(191,219,254,0.95)",
      backlight: "#93c5fd",
      keyGap: 0.02,
      numpad: false,
    },
    model: {
      url: "/models/msi-stealth-16-ai-studio.glb",
      source: "lux3d",
      prompt:
        "A 16-inch thin performance laptop, lid open, star blue magnesium-aluminium chassis, dark blue RGB backlit keyboard without numeric keypad, large trackpad, studio lighting",
    },
  },
  {
    id: "msi-prestige-16",
    brand: "MSI",
    name: "Prestige 16",
    category: "Business laptop",
    screen: '16"',
    weight: "1.6 kg",
    cooling: "Dual fans, rear hinge exhaust",
    benchNote:
      "Large thin business laptops get used on laps. Blocked intakes and dust are the usual heat causes.",
    accent: "#93c5fd",
    look: {
      deck: "#b9bdc3",
      bottom: "#a4a9b0",
      lid: "#b9bdc3",
      finish: "metal",
      keycap: "#2a2d32",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.02,
      numpad: false,
    },
    model: {
      url: "/models/msi-prestige-16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch thin business laptop, lid open, urban silver magnesium-aluminium chassis, dark backlit keyboard without numeric keypad, large trackpad, studio lighting",
    },
  },
  {
    id: "msi-titan-18-hx",
    brand: "MSI",
    name: "Titan 18 HX",
    category: "Gaming laptop",
    screen: '18"',
    weight: "3.6 kg",
    cooling: "Quad-fan layout, rear and side exhaust",
    benchNote:
      "Desktop-replacement laptops draw a lot of power. Dust on the large fin stacks causes heavy throttling.",
    accent: "#f97316",
    look: {
      deck: "#18191c",
      bottom: "#121315",
      lid: "#18191c",
      finish: "metal",
      keycap: "#0e0f11",
      legend: "rgba(253,186,116,0.95)",
      backlight: "#fb923c",
      lightbar: "#f97316",
      rearVent: true,
      keyGap: 0.024,
      numpad: true,
    },
    model: {
      url: "/models/msi-titan-18-hx.glb",
      source: "lux3d",
      prompt:
        "An 18-inch flagship desktop-replacement gaming laptop, lid open, black aluminium chassis, mechanical RGB keyboard with numeric keypad, glass trackpad with RGB edge, very large rear exhaust vents, studio lighting",
    },
  },
  {
    id: "surface-laptop-studio-2",
    brand: "Microsoft",
    name: "Surface Laptop Studio 2",
    category: "Creator laptop",
    screen: '14.4"',
    weight: "2.0 kg",
    cooling: "Dual fans, vents under the stepped base",
    benchNote:
      "The stepped base hides the vents. Using it on a soft surface or in stage mode blocks airflow.",
    accent: "#bef264",
    look: {
      deck: "#c8cbcf",
      bottom: "#9ea2a8",
      lid: "#c8cbcf",
      finish: "metal",
      keycap: "#c0c3c7",
      legend: "rgba(48,53,61,0.9)",
      keyGap: 0.02,
      numpad: false,
    },
    model: {
      url: "/models/surface-laptop-studio-2.glb",
      source: "lux3d",
      prompt:
        "A 14-inch creator laptop with a pull-forward display, lid open, platinum magnesium chassis with a stepped base, light gray keyboard without numeric keypad, large haptic trackpad, studio lighting",
    },
  },
  {
    id: "acer-predator-helios-16",
    brand: "Acer",
    name: "Predator Helios 16",
    category: "Gaming laptop",
    screen: '16"',
    weight: "2.6 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Gaming loads on soft surfaces starve the intake. Dust and dried thermal paste cause most shutdowns.",
    accent: "#06b6d4",
    look: {
      deck: "#202226",
      bottom: "#18191c",
      lid: "#202226",
      finish: "metal",
      keycap: "#121315",
      legend: "rgba(103,232,249,0.95)",
      backlight: "#22d3ee",
      lightbar: "#06b6d4",
      rearVent: true,
      keyGap: 0.026,
      numpad: true,
    },
    model: {
      url: "/models/acer-predator-helios-16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch gaming laptop, lid open, abyssal black aluminium chassis, black keyboard with cyan RGB backlight and numeric keypad, rear light bar and large exhaust vents, studio lighting",
    },
  },
  {
    id: "acer-swift-x-14",
    brand: "Acer",
    name: "Swift X 14",
    category: "Creator laptop",
    screen: '14.5"',
    weight: "1.5 kg",
    cooling: "Dual fans, rear hinge exhaust",
    benchNote:
      "A slim chassis with a discrete GPU runs warm. Dust and lap use push temperatures up quickly.",
    accent: "#94a3b8",
    look: {
      deck: "#2b2e33",
      bottom: "#222429",
      lid: "#2b2e33",
      finish: "metal",
      keycap: "#16181b",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.018,
      numpad: false,
    },
    model: {
      url: "/models/acer-swift-x-14.glb",
      source: "lux3d",
      prompt:
        "A 14-inch slim creator laptop, lid open, steam black aluminium chassis, black backlit keyboard without numeric keypad, large trackpad, studio lighting",
    },
  },
  {
    id: "samsung-galaxy-book4-pro-16",
    brand: "Samsung",
    name: "Galaxy Book4 Pro 16",
    category: "Pro laptop",
    screen: '16"',
    weight: "1.6 kg",
    cooling: "Dual fans, rear hinge exhaust",
    benchNote:
      "Thin 16-inch laptops have limited airflow. Dust and use on soft surfaces cause heat complaints.",
    accent: "#a3a3a3",
    look: {
      deck: "#3a3c40",
      bottom: "#303236",
      lid: "#3a3c40",
      finish: "metal",
      keycap: "#1a1b1e",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.018,
      numpad: true,
    },
    model: {
      url: "/models/samsung-galaxy-book4-pro-16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch thin premium laptop, lid open, moonstone gray aluminium chassis, black backlit keyboard with numeric keypad, very large trackpad, studio lighting",
    },
  },
  {
    id: "framework-laptop-16",
    brand: "Framework",
    name: "Laptop 16",
    category: "Pro laptop",
    screen: '16"',
    weight: "2.1 kg",
    cooling: "Dual fans, rear exhaust",
    benchNote:
      "Modular parts make cleaning easy. Dust on the fins and loose input modules are common bench findings.",
    accent: "#f59e0b",
    look: {
      deck: "#b8bcc2",
      bottom: "#a2a7ae",
      lid: "#b8bcc2",
      finish: "metal",
      keycap: "#2a2d32",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.022,
      numpad: true,
    },
    model: {
      url: "/models/framework-laptop-16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch modular laptop, lid open, silver aluminium chassis, dark keyboard module with numeric keypad module, centered trackpad with spacer strips on both sides, studio lighting",
    },
  },
  {
    id: "gigabyte-aero-16-oled",
    brand: "Gigabyte",
    name: "Aero 16 OLED",
    category: "Creator laptop",
    screen: '16"',
    weight: "2.0 kg",
    cooling: "Dual fans, rear and side exhaust",
    benchNote:
      "Creator laptops with high-power GPUs need clean airflow. Dust builds up under long render loads.",
    accent: "#d4d4d8",
    look: {
      deck: "#c5c8cc",
      bottom: "#b0b4b9",
      lid: "#c5c8cc",
      finish: "metal",
      keycap: "#2a2d32",
      legend: "rgba(232,235,239,0.92)",
      backlight: "#ffffff",
      keyGap: 0.018,
      numpad: false,
    },
    model: {
      url: "/models/gigabyte-aero-16-oled.glb",
      source: "lux3d",
      prompt:
        "A 16-inch creator laptop, lid open, silver aluminium chassis, dark backlit keyboard without numeric keypad, large trackpad, slim bezels, studio lighting",
    },
  },
  {
    id: "lg-gram-pro-16",
    brand: "LG",
    name: "gram Pro 16",
    category: "Thin ultrabook",
    screen: '16"',
    weight: "1.2 kg",
    cooling: "Single fan, rear hinge exhaust",
    benchNote:
      "Very light 16-inch laptops have small cooling systems. Dust and lap use quickly raise temperatures.",
    accent: "#d1d5db",
    look: {
      deck: "#d4d6d9",
      bottom: "#c0c3c7",
      lid: "#d4d6d9",
      finish: "metal",
      keycap: "#cfd2d6",
      legend: "rgba(48,53,61,0.9)",
      keyGap: 0.02,
      numpad: true,
    },
    model: {
      url: "/models/lg-gram-pro-16.glb",
      source: "lux3d",
      prompt:
        "A 16-inch ultralight laptop, lid open, essence white magnesium chassis, white keyboard with numeric keypad, large trackpad, very thin profile, studio lighting",
    },
  },
];

/** The XPS 13 is the laptop with a published Lux3D model, so new visitors see it first. */
export const DEFAULT_DEVICE_ID = "dell-xps-13";

export function getDevice(id: string | null | undefined): Device {
  return devices.find((d) => d.id === id) ?? devices.find((d) => d.id === DEFAULT_DEVICE_ID) ?? devices[0];
}

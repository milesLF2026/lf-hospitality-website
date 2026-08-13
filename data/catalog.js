/* ============================================================
   MILES — Hotel Supplies Catalog Data
   ------------------------------------------------------------
   HOW TO UPDATE (no coding needed):

   1. PRODUCTS (服装/其它展示产品):
      - Put your image file into the folder:  images/uniform/
      - Copy one of the blocks below inside "products: [ ... ]"
        and change the fields:
          name        — product name (English)
          category    — MUST match a subcategory "en" below
                        (currently only "Hotel Uniform" shows products)
          image       — "images/uniform/your-photo.jpg"
          description — one short line
          specs       — key/value pairs shown in the detail view
      - To remove a product, delete its block.

   2. CATEGORIES (品类目录):
      - Listed below in "categories". Only edit text if a name changes.
      - When a new category is ready to show products, set
          live: true
        and add products with that category name.

   Keep the commas and quotes exactly as shown.
   ============================================================ */

const CATALOG = {

  company: {
    name: "MILES",
    tagline: "Your Trusted Hotel Supplies Partner",
    intro:
      "MILES is a one-stop sourcing partner for the hospitality industry, " +
      "covering hotel uniforms, F&B equipment, guestroom supplies, " +
      "operations essentials and more — from standard items to fully " +
      "custom-made solutions.",
    email: "sales@miles-example.com",   // ← change to your real email
  },

  categories: [
    {
      en: "Hotel Uniform",
      zh: "酒店服装",
      live: true,                       // full product showcase
      blurb: "Professional uniforms for every hotel role — front office, F&B, housekeeping, kitchen, spa and management. Custom designs, fabrics and branding available.",
      subs: ["Hotel Uniform"],
    },
    {
      en: "F&B Equipment & Supplies",
      image: "images/categories/fnb.jpg",
      zh: "餐饮用品与设备",
      live: false,
      blurb: "Complete food & beverage service solutions, from buffet setup to tableware.",
      subs: [
        "Buffet Set UP", "Case Iron Pot", "Chinaware", "F&B Linen",
        "Glass Plat & Lazy Susan", "Glassware", "Kitchen Utensil",
        "Melamine", "Tableware & Chafing Dish",
      ],
    },
    {
      en: "Guestroom Equipment & Supplies",
      image: "images/categories/guestroom.jpg",
      zh: "客房用品与设备",
      live: false,
      blurb: "Everything for the guestroom — linen, minibar, safes and custom amenities.",
      subs: ["Linen", "Minibar & Safe", "Rooms Custom Made Amenity"],
    },
    {
      en: "Operations & Back-of-House",
      image: "images/categories/operations.jpg",
      zh: "运营设备与后勤",
      live: false,
      blurb: "Keep operations running smoothly — trolleys, appliances, mats and cleaning tools.",
      subs: ["Buggy", "Electrical Appliance", "Floor Mat", "Trolley & Cleaning Tools"],
    },
    {
      en: "Systems & Security",
      image: "images/categories/security.jpg",
      zh: "系统与安防",
      live: false,
      blurb: "Door lock systems, fragrance solutions and key card consumables.",
      subs: ["Door Locker System", "Fragrance", "Key Card & Other Wood Consume Items"],
    },
    {
      en: "General Consumables",
      image: "images/categories/consumables.jpg",
      zh: "通用耗材",
      live: false,
      blurb: "Daily consumables and disposables for hotel operations.",
      subs: ["Consumable"],
    },
  ],

  /* -------- COLLECTIONS (uniform cases) ---------------------
     Each collection groups products under its own header.
     To add a case: copy a block, give it a new "id", and set
     collection: "<same id>" on its products below.
     ------------------------------------------------------------ */
  collections: [
    {
      id: "case1",
      title: "Executive & Front Office Collection",
      blurb: "Tailored suits and blazers for front desk, casino floor and premium F&B service teams.",
    },
    {
      id: "case2",
      title: "Chinese Restaurant Collection",
      blurb: "Modern oriental silhouettes with bold color blocking — designed for signature Chinese dining venues.",
    },
    {
      id: "case3",
      title: "All-Day Dining Service Collection",
      blurb: "Warm earth-tone service sets with aprons for restaurants, cafés and banquet service.",
    },
    {
      id: "case4",
      title: "Premium Lounge & Bar Collection",
      blurb: "Black-and-gold statement uniforms for high-end lounges, bars and VIP service.",
    },
  ],

  /* -------- PRODUCTS ----------------------------------------
     Only products whose category is a "live: true" category
     are displayed. "collection" groups the product under a
     case header above. Image path: images/uniform/<case>/<file>
     ------------------------------------------------------------ */
  products: [
    {
      name: "Casino Floor Team Suit",
      category: "Hotel Uniform",
      collection: "case1",
      image: "images/uniform/case1/casino-floor-team-suit.jpg",
      description: "One-button suit in light blue for casino marketing & floor teams.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Front Office Suit — Women",
      category: "Hotel Uniform",
      collection: "case1",
      image: "images/uniform/case1/front-office-suit-women.jpg",
      description: "Charcoal skirt suit with gold name badge for front office ladies.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Front Office Suit — Men",
      category: "Hotel Uniform",
      collection: "case1",
      image: "images/uniform/case1/front-office-suit-men.jpg",
      description: "Classic charcoal three-piece style suit for front office & concierge.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Premium F&B Suit",
      category: "Hotel Uniform",
      collection: "case1",
      image: "images/uniform/case1/fnb-premium-suit.jpg",
      description: "Burgundy suit with gold tie for premium F&B and captain roles.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Chinese Restaurant Look 01",
      category: "Hotel Uniform",
      collection: "case2",
      image: "images/uniform/case2/chinese-restaurant-look-1.jpg",
      description: "Modern oriental uniform with mandarin collar and contrast palette.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Chinese Restaurant Look 02",
      category: "Hotel Uniform",
      collection: "case2",
      image: "images/uniform/case2/chinese-restaurant-look-2.jpg",
      description: "Modern oriental uniform with mandarin collar and contrast palette.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Chinese Restaurant Look 03",
      category: "Hotel Uniform",
      collection: "case2",
      image: "images/uniform/case2/chinese-restaurant-look-3.jpg",
      description: "Modern oriental uniform with mandarin collar and contrast palette.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Chinese Restaurant Look 04",
      category: "Hotel Uniform",
      collection: "case2",
      image: "images/uniform/case2/chinese-restaurant-look-4.jpg",
      description: "Modern oriental uniform with mandarin collar and contrast palette.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Chinese Restaurant Look 05",
      category: "Hotel Uniform",
      collection: "case2",
      image: "images/uniform/case2/chinese-restaurant-look-5.jpg",
      description: "Modern oriental uniform with mandarin collar and contrast palette.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Chinese Restaurant Look 06",
      category: "Hotel Uniform",
      collection: "case2",
      image: "images/uniform/case2/chinese-restaurant-look-6.jpg",
      description: "Modern oriental uniform with mandarin collar and contrast palette.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Dining Service Look 01",
      category: "Hotel Uniform",
      collection: "case3",
      image: "images/uniform/case3/dining-service-look-1.jpg",
      description: "Earth-tone shirt with full apron for all-day dining service.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Dining Service Look 02",
      category: "Hotel Uniform",
      collection: "case3",
      image: "images/uniform/case3/dining-service-look-2.jpg",
      description: "Earth-tone shirt with full apron for all-day dining service.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Dining Service Look 03",
      category: "Hotel Uniform",
      collection: "case3",
      image: "images/uniform/case3/dining-service-look-3.jpg",
      description: "Earth-tone shirt with full apron for all-day dining service.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Dining Service Look 04",
      category: "Hotel Uniform",
      collection: "case3",
      image: "images/uniform/case3/dining-service-look-4.jpg",
      description: "Earth-tone shirt with full apron for all-day dining service.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Dining Service Look 05",
      category: "Hotel Uniform",
      collection: "case3",
      image: "images/uniform/case3/dining-service-look-5.jpg",
      description: "Earth-tone shirt with full apron for all-day dining service.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Dining Service Look 06",
      category: "Hotel Uniform",
      collection: "case3",
      image: "images/uniform/case3/dining-service-look-6.jpg",
      description: "Earth-tone shirt with full apron for all-day dining service.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Lounge & Bar Look 01",
      category: "Hotel Uniform",
      collection: "case4",
      image: "images/uniform/case4/lounge-bar-look-1.jpg",
      description: "Black & gold statement uniform for premium lounge and bar service.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Lounge & Bar Look 02",
      category: "Hotel Uniform",
      collection: "case4",
      image: "images/uniform/case4/lounge-bar-look-2.jpg",
      description: "Black & gold statement uniform for premium lounge and bar service.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Lounge & Bar Look 03",
      category: "Hotel Uniform",
      collection: "case4",
      image: "images/uniform/case4/lounge-bar-look-3.jpg",
      description: "Black & gold statement uniform for premium lounge and bar service.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Lounge & Bar Look 04",
      category: "Hotel Uniform",
      collection: "case4",
      image: "images/uniform/case4/lounge-bar-look-4.jpg",
      description: "Black & gold statement uniform for premium lounge and bar service.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Lounge & Bar Look 05",
      category: "Hotel Uniform",
      collection: "case4",
      image: "images/uniform/case4/lounge-bar-look-5.jpg",
      description: "Black & gold statement uniform for premium lounge and bar service.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
    {
      name: "Lounge & Bar Look 06",
      category: "Hotel Uniform",
      collection: "case4",
      image: "images/uniform/case4/lounge-bar-look-6.jpg",
      description: "Black & gold statement uniform for premium lounge and bar service.",
      specs: { Customization: "Design, fabric, colors & logo fully custom-made", MOQ: "50 pcs" },
    },
  ],
};
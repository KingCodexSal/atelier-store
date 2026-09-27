const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const heroImage = img("photo-1490481651871-ab68de25d43d", 2000);

export const collections = [
  {
    title: "Womenswear",
    copy: "Draped silhouettes and sculpted tailoring",
    image: img("photo-1515886657613-9f3515b0c78f", 1000),
    alt: "Editorial womenswear look",
  },
  {
    title: "Menswear",
    copy: "Sharp outerwear and refined essentials",
    image: img("photo-1617137968427-85924c800a22", 1000),
    alt: "Editorial menswear look",
  },
  {
    title: "Accessories",
    copy: "Bags, small leather goods and objects",
    image: img("photo-1584917865442-de89df76afd3", 1000),
    alt: "Leather accessories still life",
  },
];

export const editorialImage = img("photo-1445205170230-053b83016050", 1400);

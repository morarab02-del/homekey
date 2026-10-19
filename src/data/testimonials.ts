export interface Testimonial {
  name: string;
  role: string;
  city: string;
  quote: string;
  rating: number;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Alicia Romero",
    role: "Relocated from Chicago",
    city: "Dallas",
    initials: "AR",
    rating: 5,
    quote:
      "I found a three-bedroom in Lakewood within a week of landing in Dallas. George answered every message on WhatsApp within minutes and had the lease ready before I flew in.",
  },
  {
    name: "Daniel Okafor",
    role: "Software engineer",
    city: "Austin",
    initials: "DO",
    rating: 5,
    quote:
      "The listing photos were exactly what the house looked like, which is rare. The tour form was simple and I got a reply the same afternoon.",
  },
  {
    name: "Mei-Ling Chen",
    role: "Six-month contract",
    city: "Houston",
    initials: "MC",
    rating: 4,
    quote:
      "I needed a furnished place for three months near the Medical Center. Being able to pick dates and see the total up front made the decision easy.",
  },
  {
    name: "Marcus Bell",
    role: "Family of four",
    city: "Fort Worth",
    initials: "MB",
    rating: 5,
    quote:
      "Verified listings, one landlord, no hidden fees. After two bad experiences with other sites, HomeKey felt genuinely trustworthy.",
  },
];

export interface Bio {
  name: string;
  role: string;
  initials: string;
}

export const team: Bio[] = [
  {
    name: "George Mark",
    role: "Owner & Licensed Agent",
    initials: "GM",
  },
];

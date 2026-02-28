import profile1 from "@/assets/profile-1.png";
import profile2 from "@/assets/profile-2.png";
import profile3 from "@/assets/profile-3.png";
import profile4 from "@/assets/profile-4.png";
import profile5 from "@/assets/profile-5.png";

export interface Profile {
  id: number;
  name: string;
  age: number;
  bio: string;
  distance: string;
  image: string;
  interests: string[];
  occupation: string;
  company: string;
  intent: string;
  verified: boolean;
}

export const profiles: Profile[] = [
  {
    id: 1,
    name: "Amara",
    age: 28,
    bio: "Pediatric surgeon by day, world traveler by heart 🌍✈️",
    distance: "3 miles away",
    image: profile1,
    interests: ["Travel", "Fitness", "Photography"],
    occupation: "Pediatric Surgeon",
    company: "Johns Hopkins Hospital",
    intent: "Long-term relationship",
    verified: true,
  },
  {
    id: 2,
    name: "Marcus",
    age: 31,
    bio: "Fitness coach & entrepreneur 💪 Building generational wealth 📈",
    distance: "5 miles away",
    image: profile2,
    interests: ["Fitness", "Entrepreneurship", "Food & Dining"],
    occupation: "Fitness Coach",
    company: "Self-Employed",
    intent: "Marriage",
    verified: true,
  },
  {
    id: 3,
    name: "Zara",
    age: 26,
    bio: "Investment banker with a wild heart 💹🌆 Wine aficionado 🍷",
    distance: "2 miles away",
    image: profile3,
    interests: ["Art", "Business", "Music"],
    occupation: "Investment Banker",
    company: "Goldman Sachs",
    intent: "Long-term relationship",
    verified: true,
  },
  {
    id: 4,
    name: "Devon",
    age: 29,
    bio: "Software engineer & jazz musician 🎸 Tech meets soul 🎵",
    distance: "7 miles away",
    image: profile4,
    interests: ["Music", "Tech", "Reading"],
    occupation: "Senior Software Engineer",
    company: "Google",
    intent: "Open to explore",
    verified: false,
  },
  {
    id: 5,
    name: "Naomi",
    age: 27,
    bio: "Wellness advocate 🧘‍♀️ Faith-driven 🙏 Sunset chaser 🌅",
    distance: "4 miles away",
    image: profile5,
    interests: ["Wellness", "Faith", "Nature"],
    occupation: "Wellness Coach",
    company: "Holistic Health Co.",
    intent: "Marriage",
    verified: true,
  },
];

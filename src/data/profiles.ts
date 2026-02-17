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
}

export const profiles: Profile[] = [
  {
    id: 1,
    name: "Sofia",
    age: 24,
    bio: "Adventure seeker 🌍 Coffee addict ☕ Dog mom 🐕",
    distance: "3 miles away",
    image: profile1,
    interests: ["Travel", "Photography", "Coffee"],
  },
  {
    id: 2,
    name: "James",
    age: 28,
    bio: "Fitness enthusiast 💪 Foodie 🍕 Let's explore together",
    distance: "5 miles away",
    image: profile2,
    interests: ["Fitness", "Cooking", "Hiking"],
  },
  {
    id: 3,
    name: "Emma",
    age: 26,
    bio: "City girl with a wild heart 🌆 Wine lover 🍷",
    distance: "2 miles away",
    image: profile3,
    interests: ["Art", "Wine", "Music"],
  },
  {
    id: 4,
    name: "Alex",
    age: 25,
    bio: "Software dev by day, guitarist by night 🎸",
    distance: "7 miles away",
    image: profile4,
    interests: ["Music", "Tech", "Gaming"],
  },
  {
    id: 5,
    name: "Olivia",
    age: 27,
    bio: "Sunset chaser 🌅 Yoga enthusiast 🧘‍♀️ Bookworm 📚",
    distance: "4 miles away",
    image: profile5,
    interests: ["Yoga", "Reading", "Nature"],
  },
];

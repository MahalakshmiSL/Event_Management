require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Event = require("../models/Event.model");
const User  = require("../models/User.model");
const { Gallery } = require("../models/index");

const events = [
  {
    title: "International Conference on Ophthalmology 2026",
    description:
      "Join leading ophthalmologists from across the globe for three days of cutting-edge research presentations, live surgical demonstrations, and networking sessions. Topics include retinal diseases, cataract surgery innovations, and AI-assisted diagnostics.",
    specialty: "Ophthalmology",
    date: new Date("2026-07-10"),
    endDate: new Date("2026-07-12"),
    time: "9:00 AM – 6:00 PM",
    location: {
      venue:   "Bangkok Convention Centre",
      city:    "Bangkok",
      country: "Thailand",
      address: "Queen Sirikit National Convention Center, New Ratchadapisek Rd",
    },
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    isPremium:  true,
    isFeatured: true,
    maxAttendees: 800,
    status: "upcoming",
    tags: ["ophthalmology", "retina", "cataract", "AI diagnostics"],
    speakers: [
      { name: "Dr. Sarah Mitchell",  designation: "Head of Retinal Surgery, Johns Hopkins", bio: "Pioneer in minimally invasive retinal procedures with 25+ years of experience." },
      { name: "Dr. Kenji Nakamura", designation: "AI Research Lead, Tokyo Medical University", bio: "Leading researcher in AI-assisted eye disease detection." },
      { name: "Dr. Priya Sharma",   designation: "Director, AIIMS Ophthalmology Dept.", bio: "Internationally recognized for her work in pediatric ophthalmology." },
    ],
  },
  {
    title: "World Cardiology Summit 2026",
    description:
      "A premier gathering of cardiologists, cardiac surgeons, and researchers to discuss breakthroughs in heart failure management, minimally invasive cardiac procedures, and the future of wearable cardiac monitoring technology.",
    specialty: "Cardiology",
    date: new Date("2026-08-16"),
    endDate: new Date("2026-08-18"),
    time: "8:30 AM – 5:30 PM",
    location: {
      venue:   "Dubai World Trade Centre",
      city:    "Dubai",
      country: "UAE",
      address: "Sheikh Zayed Road, Dubai",
    },
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
    isPremium:  true,
    isFeatured: false,
    maxAttendees: 1200,
    status: "upcoming",
    tags: ["cardiology", "heart failure", "wearable tech", "cardiac surgery"],
    speakers: [
      { name: "Dr. James Whitfield", designation: "Chief Cardiologist, Mayo Clinic", bio: "World-renowned for pioneering transcatheter aortic valve replacement techniques." },
      { name: "Dr. Amara Osei",      designation: "Professor, Oxford Medical School", bio: "Leading voice in preventive cardiology and global heart health policy." },
    ],
  },
  {
    title: "Global Dental Innovation Congress",
    description:
      "Explore the latest advancements in dental implantology, digital dentistry, and cosmetic procedures. Featuring hands-on workshops with the latest dental technology, live patient demonstrations, and an industry exhibition.",
    specialty: "Dentistry",
    date: new Date("2026-09-05"),
    endDate: new Date("2026-09-07"),
    time: "9:00 AM – 7:00 PM",
    location: {
      venue:   "ExCeL London",
      city:    "London",
      country: "UK",
      address: "Royal Docks, 1 Western Gateway, London E16 1XL",
    },
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800",
    isPremium:  false,
    isFeatured: false,
    maxAttendees: 600,
    status: "upcoming",
    tags: ["dentistry", "implants", "digital dentistry", "cosmetic"],
    speakers: [
      { name: "Dr. Elena Rossi",    designation: "Head of Implantology, University of Milan", bio: "Author of over 80 peer-reviewed papers on dental implant innovations." },
      { name: "Dr. Mark Thompson", designation: "Digital Dentistry Pioneer, UCLA", bio: "Creator of the widely adopted DDS-Digital workflow for dental labs." },
    ],
  },
  {
    title: "NeuroScience & Brain Health Conference",
    description:
      "A multidisciplinary conference bringing together neurologists, neurosurgeons, and researchers to address Alzheimer's disease, Parkinson's treatment, neuroplasticity, and the emerging role of psychedelics in mental health therapy.",
    specialty: "Neurology",
    date: new Date("2026-10-20"),
    endDate: new Date("2026-10-22"),
    time: "10:00 AM – 6:00 PM",
    location: {
      venue:   "Moscone Center",
      city:    "San Francisco",
      country: "USA",
      address: "747 Howard St, San Francisco, CA 94103",
    },
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800",
    isPremium:  true,
    isFeatured: false,
    maxAttendees: 900,
    status: "upcoming",
    tags: ["neurology", "alzheimers", "parkinsons", "brain health", "mental health"],
    speakers: [
      { name: "Dr. Lisa Chen",       designation: "Director, Stanford Neuroscience Lab", bio: "Groundbreaking research on neuroplasticity and cognitive recovery." },
      { name: "Dr. Ravi Kapoor",     designation: "Chief Neurologist, NIMHANS Bengaluru", bio: "Leading expert in movement disorders and deep brain stimulation." },
      { name: "Dr. Oliver Bennett",  designation: "Professor, Harvard Medical School", bio: "Pioneer in psychedelic-assisted therapy research." },
    ],
  },
  {
    title: "MedTech & AI in Healthcare Summit",
    description:
      "Where technology meets medicine. Explore how artificial intelligence, robotics, and big data are transforming diagnostics, surgical procedures, and patient care management. Includes live robot-assisted surgery demonstrations.",
    specialty: "Technology",
    date: new Date("2026-11-12"),
    endDate: new Date("2026-11-13"),
    time: "9:00 AM – 5:00 PM",
    location: {
      venue:   "Singapore EXPO",
      city:    "Singapore",
      country: "Singapore",
      address: "1 Expo Drive, Singapore 486150",
    },
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    isPremium:  false,
    isFeatured: true,
    maxAttendees: 1500,
    status: "upcoming",
    tags: ["AI", "medtech", "robotics", "healthcare", "big data"],
    speakers: [
      { name: "Dr. Nina Patel",      designation: "AI Research Director, Google Health", bio: "Led the development of AI models achieving radiologist-level diagnostic accuracy." },
      { name: "Dr. Hiroshi Tanaka",  designation: "Surgical Robotics Lead, Intuitive Surgical", bio: "Over 3,000 robot-assisted surgeries performed across three continents." },
    ],
  },
  {
    title: "General Medicine & Primary Care Forum",
    description:
      "A comprehensive forum for general practitioners and family medicine physicians covering diabetes management, hypertension guidelines, preventive care best practices, and telemedicine implementation strategies.",
    specialty: "General",
    date: new Date("2026-12-03"),
    endDate: new Date("2026-12-04"),
    time: "8:00 AM – 4:00 PM",
    location: {
      venue:   "Hotel Leela Palace",
      city:    "Bengaluru",
      country: "India",
      address: "23, Kodihalli, Old Airport Rd, Bengaluru, Karnataka 560008",
    },
    image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800",
    isPremium:  false,
    isFeatured: false,
    maxAttendees: 400,
    status: "upcoming",
    tags: ["general medicine", "diabetes", "primary care", "telemedicine"],
    speakers: [
      { name: "Dr. Ananya Reddy", designation: "HOD General Medicine, Manipal Hospital", bio: "25 years in primary care with a focus on rural health outreach programs." },
    ],
  },
];

const galleryImages = [
  { imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600", caption: "Keynote session — Ophthalmology 2025", category: "conference" },
  { imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600", caption: "Surgical demonstration workshop",          category: "workshop"    },
  { imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600", caption: "Cardiology networking dinner",               category: "ceremony"    },
  { imageUrl: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600", caption: "Medical device exhibition hall",           category: "exhibition"  },
  { imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600", caption: "Panel discussion on AI diagnostics",       category: "conference"  },
  { imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600", caption: "Award ceremony — Best Research Paper",        category: "ceremony"    },
  { imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600", caption: "Live robotic surgery demo",                category: "workshop"    },
  { imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600", caption: "International delegates networking",        category: "general"     },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Event.deleteMany({});
    await Gallery.deleteMany({});
    console.log("🗑️  Cleared existing events and gallery");

    // Create admin user if not exists
    let admin = await User.findOne({ email: "admin@eventsphere.com" });
    if (!admin) {
      admin = await User.create({
        name:     "EventSphere Admin",
        email:    "admin@eventsphere.com",
        password: "Admin@123",
        role:     "admin",
        specialty:"General",
      });
      console.log("👤 Admin created — email: admin@eventsphere.com | password: Admin@123");
    }

    // Create test user
    let testUser = await User.findOne({ email: "user@eventsphere.com" });
    if (!testUser) {
      testUser = await User.create({
        name:      "Test User",
        email:     "user@eventsphere.com",
        password:  "User@123",
        role:      "user",
        specialty: "Cardiology",
      });
      console.log("👤 Test user created — email: user@eventsphere.com | password: User@123");
    }

    // Seed events
    const createdEvents = await Event.insertMany(events);
    console.log(`✅ ${createdEvents.length} events seeded`);

    // Seed gallery with first event reference
    const galleryData = galleryImages.map((img, i) => ({
      ...img,
      event:      i < 3 ? createdEvents[0]._id : null,
      uploadedBy: admin._id,
    }));
    await Gallery.insertMany(galleryData);
    console.log(`🖼️  ${galleryImages.length} gallery images seeded`);

    console.log("\n✅ Database seeded successfully!\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seedDB();
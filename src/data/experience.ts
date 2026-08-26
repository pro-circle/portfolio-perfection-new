export type ExperienceItem = {
  slug: string;
  role: string;
  company: string;
  duration: string;
  description: string;
  technologies: string[];
  detailedJourney: string;
  images: [string, string];
};

export const experienceData: ExperienceItem[] = [
  {
    slug: "deeplearning-intern",
    role: "Springboard Deep Learning Intern",
    company: "Infosys",
    duration: "Aug 2025 – Oct 2025",
    description:
      "Developed a Deep Learning model, YOLO and deployed successfully for validating Aadhar card.",
    technologies: ["YOLO", "Node.js", "PostgreSQL"],
    detailedJourney:
      "During my internship, I was part of the platform engineering team of more than 10 members where I designed and implemented the object detection model, YOLO for detecting and verifying Aadhar card validity. The parameters includes, Name, Aadhar number, date of birth, photo and the card layout. Flushed out an accuracy of 0.8. This project craved me to learn deeper on AI",
    images: ["/images/experience/exp-img1.png", "/images/experience/1-intern-cert.png"],
  },
  {
    slug: "web-development-intern",
    role: "Web Development Intern",
    company: "National Small Industries Corporation",
    duration: "Mar 2025",
    description:
      "Developed REST APIs, optimized backend, frontend pipelines. Collaborated with cross-functional teams on product features.",
    technologies: ["HTML", "CSS", "Fast API"],
    detailedJourney:
      "Worked on the customer-facing web application, an e-commerce website rebuilding APIs and inegrating the backend with frontend. This is the first step of my practical implementation. I came out with many doubts and clarification  of how the website works, recives and sends requests and responding to the client queries.",
    images: ["/images/experience/exp-img2.png", "/images/experience/2-intern-cert.jpg"],
  },
];

export const getExperienceBySlug = (slug: string) =>
  experienceData.find((e) => e.slug === slug);
